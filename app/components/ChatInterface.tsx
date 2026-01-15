"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBuble";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader, Copy, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
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
  const contentRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const regenerate = async (messageIndex: number) => {
    const userMessage = messages[messageIndex];
    if (userMessage.role !== "user") return;

    setIsLoading(true);
    const newMessages = messages.slice(0, messageIndex + 1);
    setMessages(newMessages);

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

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "", id: Date.now().toString() },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantMessage += chunk;

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: assistantMessage,
            };
            return updated;
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      id: Date.now().toString(),
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
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "", id: Date.now().toString() },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantMessage += chunk;

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: assistantMessage,
            };
            return updated;
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
          id: Date.now().toString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-6xl">
      {/* Header */}
      <div className="flex justify-end">
        <div className="text-right pr-6 pt-4">
          <h1 className="font-bebas text-2xl text-white tracking-wide">
            Chat with {personaName}
          </h1>
          <p className="font-mono text-xs text-gray-400">
            Ask questions and explore perspectives
          </p>
        </div>
      </div>

      <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full"
              >
                <div className="text-center">
                  <h2 className="font-bebas text-3xl text-white mb-2">
                    Start chatting
                  </h2>
                  <p className="font-mono text-sm text-gray-400">
                    Ask {personaName} anything
                  </p>
                </div>
              </motion.div>
            ) : (
              <>
                <ScrollArea className="h-[calc(100vh-60px)]">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-2xl ${
                          message.role === "user" ? "w-auto" : "w-full"
                        }`}
                      >
                        <MessageBubble message={message} />

                        {message.role === "assistant" &&
                          index === messages.length - 1 && (
                            <div className="flex gap-2 mt-2 ml-0">
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(message.content)
                                }
                                className="flex items-center gap-1 px-3 py-1.5  text-xs font-mono text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
                                title="Copy"
                              >
                                <Copy className="w-3 h-3" />
                                Copy
                              </button>
                              <button
                                onClick={() => regenerate(index - 1)}
                                disabled={isLoading}
                                className="flex items-center gap-1 px-3 py-1.5  text-xs font-mono text-gray-400 hover:text-white hover:bg-gray-900 transition-colors disabled:opacity-50"
                                title="Retry"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Retry
                              </button>
                            </div>
                          )}
                      </div>
                    </motion.div>
                  ))}
                </ScrollArea>

                <AnimatePresence>
                  {isLoading &&
                    messages[messages.length - 1]?.role === "user" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-900 px-4 py-3 border border-gray-700 flex items-center gap-2">
                          <Loader className="w-4 h-4 text-yellow-400 animate-spin" />
                          <span className="text-gray-400 font-mono text-sm">
                            Typing...
                          </span>
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>

                <div ref={messageEndRef} />
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Footer  */}
      <div className="border-t border-gray-800 bg-black px-6 py-6">
        <form onSubmit={handleSubmit} className="mx-auto max-w-6xl">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                type="text"
                placeholder={`Ask ${personaName} something...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="w-full bg-gray-900 text-white border-gray-700 focus:border-yellow-400 placeholder-gray-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="font-bebas text-lg px-6 py-6 bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
