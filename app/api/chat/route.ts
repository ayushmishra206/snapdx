import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
      response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: SNAPDX_SYSTEM_PROMPT,
        messages: conversationMessages,
      });
    } catch (anthropicError: any) {
      // Handle Anthropic API errors (credits, rate limits, etc.)
      console.error("Anthropic API Error:", anthropicError);
      
      // Delete the user message since we couldn't get a response
      await supabase.from("messages").delete().eq("id", userMessage.id);
      
      if (anthropicError.status === 400 && anthropicError.message?.includes("credit balance")) {
        return NextResponse.json(
          { error: "AI service credits exhausted. Please contact support or add credits to your Anthropic account." },
          { status: 400 }
        );
      }
      
      if (anthropicError.status === 429) {
        return NextResponse.json(
          { error: "AI service rate limit reached. Please try again in a moment." },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: "AI service temporarily unavailable. Please try again later." },
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
          model: "claude-3-5-sonnet-20241022",
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
