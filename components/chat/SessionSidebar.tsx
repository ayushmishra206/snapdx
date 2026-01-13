"use client";

import { useState } from "react";
import { Plus, MessageSquare, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  title: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

interface SessionSidebarProps {
  sessions: Session[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
}

export function SessionSidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}: SessionSidebarProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this case?")) {
      setDeletingId(id);
      await onDeleteSession(id);
      setDeletingId(null);
    }
  };

  return (
    <div className="w-80 bg-white border-r flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <Button onClick={onNewSession} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          New Case
        </Button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No cases yet</p>
            <p className="text-xs mt-1">Click "New Case" to start</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={cn(
                  "group relative p-3 rounded-lg cursor-pointer transition-colors",
                  currentSessionId === session.id
                    ? "bg-primary-50 border border-primary-200"
                    : "hover:bg-gray-50 border border-transparent"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {session.is_favorite && (
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                      )}
                      <h3 className="text-sm font-medium truncate">
                        {session.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 suppressHydrationWarning">
                      {new Date(session.updated_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, session.id)}
                    disabled={deletingId === session.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                    title="Delete case"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
