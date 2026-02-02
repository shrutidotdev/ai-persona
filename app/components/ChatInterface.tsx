"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

interface ChatInterfaceProps {
  personaSlug: string;
  personaName: string;
}

const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-3 font-mono text-sm transition-all duration-300 max-w-[70%]
        ${isUser ? "bg-yellow-400 text-black" : "bg-gray-900 text-white border border-gray-800"}`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
};

const ChatInterface = ({ personaSlug, personaName }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamResponse = async (userMessageContent: string) => {
    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessageContent,
          persona: personaSlug,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        const tempId = Date.now().toString();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "", id: tempId },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantMessage += chunk;

          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (updated[lastIndex].id === tempId) {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: assistantMessage,
              };
            }
            return updated;
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const regenerate = async (messageIndex: number) => {
    const userMessage = messages[messageIndex];
    if (userMessage.role !== "user") return;

    setIsLoading(true);
    const newMessages = messages.slice(0, messageIndex + 1);
    setMessages(newMessages);

    try {
      await streamResponse(userMessage.content);
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
      await streamResponse(userMessage.content);
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

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied!");
  };

  const handleRetry = async (index: number) => {
    await regenerate(index - 1);
    toast.success("Response regenerated!");
  };

  return (
    <section className="min-h-screen max-w-6xl mx-auto">
      <div className="flex flex-col h-screen w-full bg-black relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-end border-b border-gray-800">
          <div className="text-right pr-6 py-4">
            <h1 className="font-bebas text-2xl text-white tracking-wide">
              Chat with {personaName}
            </h1>
            <p className="font-mono text-xs text-gray-400">
              Ask questions and explore perspectives
            </p>
          </div>
        </div>

        {/* Messages Container */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-6 py-8"
        >
          <div className="mx-auto max-w-4xl">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full min-h-100 text-center space-y-4"
                >
                  <h2 className="font-bebas text-4xl text-white ">
                    Start a Conversation
                  </h2>
                  {/* <p className="font-mono text-sm text-gray-400">
                    Ask {personaName} anything to begin
                  </p> */}
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MessageBubble message={message} />

                      {/* Action Buttons for Assistant Messages */}
                      {message.role === "assistant" &&
                        index === messages.length - 1 &&
                        !isLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex gap-2 ml-2 mt-2"
                          >
                            <Button
                              onClick={() => handleCopy(message.content)}
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                              Copy
                            </Button>
                            <Button
                              onClick={() => handleRetry(index)}
                              disabled={isLoading}
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-white hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Retry
                            </Button>
                          </motion.div>
                        )}
                    </motion.div>
                  ))}

                  {/* Loading Indicator */}
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-900 px-4 py-3 border border-gray-700 rounded-lg flex items-center gap-2">
                          <Loader className="w-4 h-4 text-yellow-400 animate-spin" />
                          <span className="text-white font-mono text-sm">
                            {personaName} is typing...
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Input Footer */}
        <div className="border-t border-gray-800 bg-black px-6 py-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={`Ask ${personaName} something...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-gray-900 text-white border-gray-700 focus:border-yellow-400 focus:ring-yellow-400 placeholder-gray-500 font-mono text-sm h-12"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="font-bebas text-lg px-6 h-12 bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Sending</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChatInterface;