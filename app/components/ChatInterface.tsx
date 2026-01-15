"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBuble";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  personaSlug: string;
  personaName: string;
}

const ChatInterface = ({ personaSlug, personaName }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          persona: personaSlug,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantMessage += chunk;

          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: assistantMessage,
            };
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 rounded-3xl shadow-2xl overflow-hidden">
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="font-bebas text-3xl text-gray-700 mb-2">
                Start a conversation
              </h1>
              <p className="font-mono text-sm text-gray-500">
                Ask anything to {personaName}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-lg px-4 py-2">
                  <p className="text-gray-600 font-mono text-sm">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>
      
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-5 bg-white"
      >
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />

          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-black text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-gray-800"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;