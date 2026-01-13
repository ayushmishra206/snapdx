"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!message.trim() || isSending || disabled) return;

    const content = message.trim();
    setMessage("");
    setIsSending(true);

    try {
      await onSendMessage(content);
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  };

  return (
    <div className="border-t bg-white p-3 md:p-4 flex-shrink-0">
      <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3 items-start">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask about cases, fractures..."
            disabled={disabled || isSending}
            rows={1}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 md:px-4 py-2 md:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ maxHeight: "200px" }}
          />
          <p className="hidden sm:block text-xs text-gray-500 mt-1">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || disabled || isSending}
          size="lg"
          className="flex-shrink-0 px-3 md:px-4 h-[42px] md:h-[46px]"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4 md:w-5 md:h-5 md:mr-2" />
              <span className="hidden md:inline">Send</span>
            </>
          )}
        </Button>
      </form>

      {/* Educational Disclaimer */}
      <div className="mt-3 text-xs text-gray-500 flex items-start gap-2">
        <span>⚠️</span>
        <p>
          SnapDx is an educational tool only. All responses are AI-generated and not a substitute
          for professional medical advice.
        </p>
      </div>
    </div>
  );
}
