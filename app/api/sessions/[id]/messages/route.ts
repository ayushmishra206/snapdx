import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET all messages for a session
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user owns this session
    const { data: session } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", id)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
