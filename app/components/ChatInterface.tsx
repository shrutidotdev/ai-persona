"use client";

import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader, Copy, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { storageKey } from "@/lib/chat";
import { Persona } from "@/app/types/persona";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

interface ChatInterfaceProps {
  persona: Persona;
}

const STARTER_PROMPTS = [
  "Roast my pitch — be brutally honest",
  "What's the weakest part of my idea?",
  "Help me simplify my story",
];

const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-5 py-3.5 font-mono text-sm leading-relaxed max-w-[75%] ${
          isUser
            ? "bg-yellow-400 text-black"
            : "bg-neutral-900 text-white border border-white/10"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
};

const ChatInterface = ({ persona }: ChatInterfaceProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(persona.slug));
      if (saved) setMessages(JSON.parse(saved));
    } catch {
      localStorage.removeItem(storageKey(persona.slug));
    }
    setIsHydrated(true);
  }, [persona.slug]);

  useEffect(() => {
    if (!isHydrated) return;
    if (messages.length === 0) {
      localStorage.removeItem(storageKey(persona.slug));
    } else {
      localStorage.setItem(storageKey(persona.slug), JSON.stringify(messages));
    }
  }, [messages, persona.slug, isHydrated]);

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamResponse = useCallback(
    async (conversationHistory: Message[]) => {
      const apiMessages = conversationHistory.map(({ role, content }) => ({
        role,
        content,
      }));

      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: persona.slug,
          messages: apiMessages,
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

          assistantMessage += decoder.decode(value);

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
    },
    [persona.slug]
  );

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: content.trim(),
      id: Date.now().toString(),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput("");
    setIsLoading(true);

    try {
      await streamResponse(updatedHistory);
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

  const regenerate = async (messageIndex: number) => {
    const userMessage = messages[messageIndex];
    if (userMessage.role !== "user") return;

    setIsLoading(true);
    const historyUpToUser = messages.slice(0, messageIndex + 1);
    setMessages(historyUpToUser);

    try {
      await streamResponse(historyUpToUser);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied!");
  };

  const handleRetry = async (index: number) => {
    await regenerate(index - 1);
    toast.success("Response regenerated!");
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem(storageKey(persona.slug));
    toast.success("Conversation cleared");
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader className="w-6 h-6 text-yellow-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between border-b border-white/10 px-4 md:px-8 py-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-400 hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 overflow-hidden border border-white/20">
            <Image
              src={persona.image}
              alt={persona.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-yellow-400 leading-none">
              {persona.title}
            </p>
            <h1 className="font-bebas text-xl md:text-2xl text-white tracking-wide leading-tight">
              {persona.name}
            </h1>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          disabled={messages.length === 0 || isLoading}
          className="font-mono text-xs text-neutral-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>
      </header>

      {/* Messages */}
      <div
        ref={contentRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 md:px-8 py-6 md:py-10"
      >
        <div className="mx-auto max-w-3xl h-full">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center gap-8"
              >
                <div className="space-y-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-400">
                    02 / PITCH SESSION
                  </span>
                  <h2 className="font-bebas text-4xl md:text-5xl text-white tracking-tight">
                    PRACTICE YOUR PITCH
                  </h2>
                  <p className="font-mono text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                    Share your startup idea or presentation draft.{" "}
                    {persona.name} will give you honest feedback — and remember
                    what you said earlier.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center w-full max-w-lg">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      disabled={isLoading}
                      className="px-4 py-2.5 border border-white/15 font-mono text-xs text-neutral-300 hover:border-yellow-400 hover:text-yellow-400 transition-colors disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 pb-4"
              >
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MessageBubble message={message} />

                    {message.role === "assistant" &&
                      index === messages.length - 1 &&
                      !isLoading &&
                      message.content && (
                        <div className="flex gap-2 mt-2 ml-1">
                          <Button
                            onClick={() => handleCopy(message.content)}
                            variant="ghost"
                            size="sm"
                            className="font-mono text-xs text-neutral-500 hover:text-white hover:bg-white/5"
                          >
                            <Copy className="w-3 h-3" />
                            Copy
                          </Button>
                          <Button
                            onClick={() => handleRetry(index)}
                            disabled={isLoading}
                            variant="ghost"
                            size="sm"
                            className="font-mono text-xs text-neutral-500 hover:text-white hover:bg-white/5"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Retry
                          </Button>
                        </div>
                      )}
                  </motion.div>
                ))}

                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-3 bg-neutral-900 border border-white/10">
                        <Loader className="w-4 h-4 text-yellow-400 animate-spin" />
                        <span className="font-mono text-sm text-neutral-300">
                          {persona.name} is typing...
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input */}
      <footer className="shrink-0 border-t border-white/10 px-4 md:px-8 py-4 md:py-5 bg-black">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex gap-3 items-center">
            <Input
              type="text"
              placeholder={`Pitch your idea to ${persona.name}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 h-12 bg-neutral-900 text-white border-white/15 font-mono text-sm placeholder:text-neutral-500 focus:border-yellow-400 focus:ring-yellow-400/20 disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="font-bebas text-lg px-6 h-12 bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-40 shrink-0"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>
      </footer>
    </div>
  );
};

export default ChatInterface;
