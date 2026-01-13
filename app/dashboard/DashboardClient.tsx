"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, LogOut, AlertCircle, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { SessionSidebar } from "@/components/chat/SessionSidebar";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  institution: string | null;
  specialization: string | null;
  usage_count: number;
}

interface Session {
  id: string;
  title: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface DashboardClientProps {
  initialProfile: Profile | null;
  initialSessions: Session[];
}

export function DashboardClient({ initialProfile, initialSessions }: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      loadMessages(currentSessionId);
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);

  const loadMessages = async (sessionId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/messages`);
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleNewSession = async () => {
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Case" }),
      });

      const data = await response.json();
      if (data.session) {
        setSessions([data.session, ...sessions]);
        setCurrentSessionId(data.session.id);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await fetch(`/api/sessions/${id}`, {
        method: "DELETE",
      });

      setSessions(sessions.filter((s) => s.id !== id));
      if (currentSessionId === id) {
        setCurrentSessionId(null);
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    // If no session exists, create one first
    if (!currentSessionId && sessions.length === 0) {
      await handleNewSession();
      // Wait for state to update
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const sessionId = currentSessionId || sessions[0]?.id;
    if (!sessionId) {
      alert("Please create a session first");
      return;
    }

    // Optimistically add user message to UI
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          content,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      if (data.userMessage && data.aiMessage) {
        // Replace temp message with real messages from server
        setMessages((prev) => {
          // Remove temp message and add real ones
          const withoutTemp = prev.filter((m) => m.id !== tempUserMessage.id);
          return [...withoutTemp, data.userMessage, data.aiMessage];
        });
        
        // Update session title and timestamp in the sidebar
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  title: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
                  updated_at: new Date().toISOString(),
                }
              : s
          )
        );

        // Refresh profile to update usage count
        const { data: updatedProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profile?.id)
          .single();
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
      }
    } catch (error: any) {
      console.error("Failed to send message:", error);
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
      
      // Show user-friendly error message
      const errorMsg = error.message || "Failed to send message. Please try again.";
      setErrorMessage(errorMsg);
      
      // Auto-hide error after 8 seconds
      setTimeout(() => setErrorMessage(null), 8000);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">SnapDx</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {profile?.full_name || profile?.email}
              </p>
              <p className="text-xs text-gray-600">
                {profile?.usage_count || 0} cases analyzed
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Session Sidebar */}
        <SessionSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
        />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="ml-3 flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
          
          {currentSessionId ? (
            <>
              <MessageList messages={messages} isLoading={isLoadingMessages} />
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={isLoadingMessages}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Welcome to SnapDx!</h2>
                <p className="text-gray-600 mb-6">
                  Start a new case to begin learning orthopedics with AI assistance.
                  Ask questions, discuss fracture classifications, and explore treatment protocols.
                </p>
                <Button onClick={handleNewSession} size="lg">
                  Start Your First Case
                </Button>
                <div className="mt-8 p-4 bg-accent-50 border-l-4 border-accent-500 rounded-r-lg text-left">
                  <p className="text-xs text-accent-900">
                    <strong>⚠️ Educational Tool Only:</strong> SnapDx is for learning purposes only.
                    Not for clinical use.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
