import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Log API key status on initialization (only first 10 chars for security)
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("❌ ANTHROPIC_API_KEY is not set in environment variables!");
} else {
  const keyPrefix = process.env.ANTHROPIC_API_KEY.substring(0, 10);
  console.log(`✓ Anthropic API Key loaded: ${keyPrefix}...`);
}

// Cache for available models (refreshed periodically)
let cachedModels: string[] = [];
let lastModelFetch: number = 0;
const MODEL_CACHE_TTL = 3600000; // 1 hour in milliseconds

// Fetch available models from Anthropic API
async function getAvailableModels(): Promise<string[]> {
  const now = Date.now();
  
  // Return cached models if still valid
  if (cachedModels.length > 0 && now - lastModelFetch < MODEL_CACHE_TTL) {
    return cachedModels;
  }

  try {
    console.log("🔍 Fetching available Claude models...");
    const models: string[] = [];
    
    // Fetch models using the beta API
    for await (const modelInfo of anthropic.beta.models.list()) {
      models.push(modelInfo.id);
    }
    
    // Filter to only message-capable models and sort by preference
    const messageModels = models.filter(id => 
      id.includes('claude') && !id.includes('embed')
    ).sort((a, b) => {
      // Prioritize: haiku (cheapest) > sonnet > opus (most expensive)
      if (a.includes('haiku')) return -1;
      if (b.includes('haiku')) return 1;
      if (a.includes('sonnet')) return -1;
      if (b.includes('sonnet')) return 1;
      return b.localeCompare(a); // Newest first for same tier
    });
    
    cachedModels = messageModels;
    lastModelFetch = now;
    
    console.log(`✓ Found ${messageModels.length} available models:`, messageModels.slice(0, 5));
    return messageModels;
  } catch (error) {
    console.error("Failed to fetch models, using fallback list:", error);
    // Fallback to known models if API call fails (cheapest first)
    return [
      "claude-3-5-haiku-20241022",     // Cheapest
      "claude-3-haiku-20240307",       // Older haiku
      "claude-3-5-sonnet-20241022",    // Mid-tier
      "claude-sonnet-4-20250514",      // More expensive
    ];
  }
}

const SNAPDX_SYSTEM_PROMPT = `You are SnapDx, an AI educational assistant for orthopedic learning. You help medical students and residents understand fractures, diseases, and management protocols.

## Core Rules:
1. **Educational Only**: Always remind users this is for learning, not clinical diagnosis
2. **Confidence Scores**: Provide confidence % for all diagnostic suggestions when analyzing images
3. **Cite Sources**: Reference medical literature when possible (Campbell's Orthopaedics, AO/OTA classifications, AAOS guidelines)
4. **Admit Uncertainty**: Say "I don't have verified information" rather than guessing
5. **Safety First**: For emergencies (compartment syndrome, open fractures), always say "Seek immediate medical attention"

## Response Format:
When analyzing images:
- State what you see
- Provide classification (if applicable)
- Give confidence score
- Explain clinical significance
- Offer management overview
- List common complications

## Conversation Style:
- Be friendly and encouraging
- Use clear, educational language
- Break down complex topics
- Encourage follow-up questions
- Provide learning points with 📚 emoji

Remember: You're a teaching assistant, not a diagnostic tool. Always emphasize the educational nature of your responses.`;

// POST send a message and get AI response
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { session_id, content } = await request.json();

    if (!session_id || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify user owns this session
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", session_id)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Save user message
    const { data: userMessage, error: userMessageError } = await supabase
      .from("messages")
      .insert({
        session_id,
        role: "user",
        content,
      })
      .select()
      .single();

    if (userMessageError) throw userMessageError;

    // Get conversation history for context
    const { data: messageHistory } = await supabase
      .from("messages")
      .select("role, content")
      .eq("session_id", session_id)
      .order("created_at", { ascending: true })
      .limit(10); // Last 10 messages for context

    // Build conversation for Claude
    const conversationMessages = (messageHistory || []).map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    // Call Claude API
    let response;
    try {
      // Check if API key is set
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY environment variable is not set");
      }

      // Get available models dynamically
      const availableModels = await getAvailableModels();
      
      if (availableModels.length === 0) {
        throw new Error("No Claude models available");
      }
      
      let lastError;
      let attemptedModels: string[] = [];
      
      // Try each available model until one works
      for (const model of availableModels) {
        try {
          console.log(`Attempting to use model: ${model}...`);
          response = await anthropic.messages.create({
            model,
            max_tokens: 1024,
            system: SNAPDX_SYSTEM_PROMPT,
            messages: conversationMessages,
          });
          console.log(`✓ Successfully using model: ${model}`);
          break; // Success, exit loop
        } catch (modelError: any) {
          attemptedModels.push(model);
          console.log(`✗ Model ${model} failed:`, modelError.status, modelError.message);
          lastError = modelError;
          
          // Only try up to 3 models to avoid long delays
          if (attemptedModels.length >= 3) {
            break;
          }
          continue; // Try next model
        }
      }
      
      if (!response) {
        console.error(`❌ All attempted models failed: ${attemptedModels.join(", ")}`);
        throw lastError || new Error("All available Claude models failed");
      }
    } catch (anthropicError: any) {
      // Handle Anthropic API errors (credits, rate limits, etc.)
      console.error("Anthropic API Error:", JSON.stringify(anthropicError, null, 2));
      
      // Delete the user message since we couldn't get a response
      await supabase.from("messages").delete().eq("id", userMessage.id);
      
      const errorMessage = anthropicError.message || anthropicError.error?.message || "";
      const errorType = anthropicError.error?.type || "";
      const errorStatus = anthropicError.status;
      
      // Check for model not found (404) - API key tier issue
      if (errorStatus === 404 || errorType === "not_found_error") {
        return NextResponse.json(
          { error: "⚠️ Your Anthropic API key doesn't have access to Claude models. Please:\n1. Check your API key at console.anthropic.com\n2. Verify billing is set up (add credits)\n3. Make sure your key starts with 'sk-ant-api03-'\n4. Try generating a new API key" },
          { status: 403 }
        );
      }
      
      // Check for credit balance issues
      if (
        errorMessage.toLowerCase().includes("credit balance") ||
        errorMessage.toLowerCase().includes("billing") ||
        errorType === "invalid_request_error"
      ) {
        return NextResponse.json(
          { error: "⚠️ Anthropic API credits needed. Please add credits at console.anthropic.com → Plans & Billing. See ANTHROPIC_SETUP.md for details." },
          { status: 400 }
        );
      }
      
      // Check for rate limits
      if (anthropicError.status === 429 || errorMessage.toLowerCase().includes("rate limit")) {
        return NextResponse.json(
          { error: "AI service rate limit reached. Please try again in a moment." },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: `AI service error: ${errorMessage || "Please check your Anthropic API key and credits."}` },
        { status: 503 }
      );
    }

    const aiContent = response.content[0].type === "text" 
      ? response.content[0].text 
      : "I apologize, but I couldn't generate a response.";

    // Save AI response
    const { data: aiMessage, error: aiMessageError } = await supabase
      .from("messages")
      .insert({
        session_id,
        role: "assistant",
        content: aiContent,
        metadata: {
          model: response.model || "claude-sonnet-4-20250514",
          usage: response.usage,
        },
      })
      .select()
      .single();

    if (aiMessageError) throw aiMessageError;

    // Update session title if it's the first message
    if (conversationMessages.length <= 1) {
      const title = content.substring(0, 50) + (content.length > 50 ? "..." : "");
      await supabase
        .from("chat_sessions")
        .update({ title })
        .eq("id", session_id);
    }

    // Update usage count
    const { data: profile } = await supabase
      .from("profiles")
      .select("usage_count")
      .eq("id", user.id)
      .single();

    await supabase
      .from("profiles")
      .update({ usage_count: (profile?.usage_count || 0) + 1 })
      .eq("id", user.id);

    // Log usage
    await supabase.from("usage_logs").insert({
      user_id: user.id,
      action_type: "chat_message",
    });

    return NextResponse.json({
      userMessage,
      aiMessage,
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
