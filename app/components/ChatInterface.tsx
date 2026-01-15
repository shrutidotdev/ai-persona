"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import MessageBubble from "./MessageBuble"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Loader } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatInterfaceProps {
  personaSlug: string
  personaName: string
}

const suggestedPrompts = [
  "What are your thoughts on innovation?",
  "How do you approach problem-solving?",
  "What drives your passion?",
  "Tell me about your philosophy",
]

const ChatInterface = ({ personaSlug, personaName }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messageEndRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

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
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      if (reader) {
        setMessages((prev) => [...prev, { role: "assistant", content: "" }])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          assistantMessage += chunk

          setMessages((prev) => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: assistantMessage,
            }
            return newMessages
          })
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      ref={containerRef}
      className="fixed inset-0 bg-black flex flex-col overflow-hidden"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="border-b border-gray-800 bg-black px-6 py-4 sm:px-8 sm:py-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide">Chat with {personaName}</h1>
            <p className="font-mono text-xs sm:text-sm text-gray-500 mt-1">Ask questions and explore perspectives</p>
          </div>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 space-y-4 max-w-2xl mx-auto w-full pb-32">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full"
            >
              <div className="text-center">
                <h2 className="font-bebas text-3xl text-white mb-2">Start chatting</h2>
                <p className="font-mono text-sm text-gray-400">Ask {personaName} anything</p>
              </div>
            </motion.div>
          ) : (
            <>
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}

              <AnimatePresence>
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-900 rounded-lg px-4 py-3 border border-gray-700 flex items-center gap-2">
                      <Loader className="w-4 h-4 text-yellow-400 animate-spin" />
                      <span className="text-gray-400 font-mono text-sm">Thinking...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messageEndRef} />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 px-6 py-6 sm:px-8 sm:py-8"
      >
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                type="text"
                placeholder={`Ask ${personaName} something...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="w-full "
              />
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="font-bebas text-lg px-6 sm:px-8 py-6 bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
              >
                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default ChatInterface
