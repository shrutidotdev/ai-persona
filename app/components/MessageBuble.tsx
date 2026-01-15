"use client"

import { motion } from "framer-motion"

interface MessageProp {
  message: {
    role: "user" | "assistant"
    content: string
  }
}

const MessageBubble = ({ message }: MessageProp) => {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 font-mono text-sm transition-all duration-300 
        ${isUser ? "bg-yellow-400 text-black font-semibold" : "bg-gray-900 text-white"}`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  )
}

export default MessageBubble
