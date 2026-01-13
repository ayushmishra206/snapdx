"use client";

import { useEffect, useRef } from "react";
import { User, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Start a Conversation</h3>
          <p className="text-gray-600 mb-6">
            Ask me about orthopedic cases, fracture classifications, or any medical questions.
            I'm here to help you learn!
          </p>
          <div className="text-left bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-700">Try asking:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• "What is a Colles fracture?"</li>
              <li>• "Explain the AO/OTA classification system"</li>
              <li>• "What are common hip fracture types?"</li>
              <li>• "How do you manage a supracondylar fracture?"</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 md:gap-4 ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role === "assistant" && (
            <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          )}

          <div
            className={`max-w-[85%] md:max-w-3xl rounded-2xl px-3 md:px-4 py-2 md:py-3 ${
              message.role === "user"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <div className="prose prose-sm max-w-none">
              {message.role === "assistant" ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="mb-2 ml-4 list-disc">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    code: ({ children }) => (
                      <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">{children}</code>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
            <p className={`text-xs mt-2 suppressHydrationWarning ${
              message.role === "user" ? "text-primary-100" : "text-gray-500"
            }`}>
              {new Date(message.created_at).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          </div>

          {message.role === "user" && (
            <div className="w-7 h-7 md:w-8 md:h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-gray-100 rounded-2xl px-4 py-3">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
