import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// GET available Claude models
export async function GET() {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    const models: Array<{ id: string; created_at?: string; display_name?: string }> = [];
    
    // Fetch all available models
    for await (const modelInfo of anthropic.beta.models.list()) {
      models.push({
        id: modelInfo.id,
        created_at: modelInfo.created_at,
        display_name: modelInfo.display_name,
      });
    }

    // Filter to message-capable models
    const messageModels = models.filter(m => 
      m.id.includes('claude') && !m.id.includes('embed')
    ).sort((a, b) => {
      // Prioritize cheapest first: haiku > sonnet > opus
      if (a.id.includes('haiku')) return -1;
      if (b.id.includes('haiku')) return 1;
      if (a.id.includes('sonnet')) return -1;
      if (b.id.includes('sonnet')) return 1;
      return b.id.localeCompare(a.id); // Newest first
    });

    return NextResponse.json({
      total: messageModels.length,
      models: messageModels,
      recommended: messageModels[0]?.id, // First model (cheapest Haiku)
      costInfo: {
        haiku: "$0.25 per million input tokens, $1.25 per million output tokens",
        sonnet: "$3 per million input tokens, $15 per million output tokens",
        opus: "$15 per million input tokens, $75 per million output tokens"
      }
    });
  } catch (error: any) {
    console.error("Failed to fetch models:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch models",
        message: error.message,
        fallback: [
          "claude-sonnet-4-20250514",
          "claude-3-5-sonnet-20241022",
          "claude-3-5-sonnet-20240620",
          "claude-3-5-haiku-20241022",
        ]
      },
      { status: 500 }
    );
  }
}
