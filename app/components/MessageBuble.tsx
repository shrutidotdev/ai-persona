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
        className={` px-4 py-3 font-mono text-sm transition-all duration-300 max-w-[70%]
        ${isUser ? "bg-yellow-400 text-black" : "bg-gray-900 text-white border border-gray-700"}`}
      >
        <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
      </div>
    </motion.div>
  )
}

export default MessageBubble
