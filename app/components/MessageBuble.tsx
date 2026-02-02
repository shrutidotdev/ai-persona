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
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-3 font-mono text-sm transition-all duration-300 max-w-[70%]
        ${isUser ? "bg-yellow-400 text-black" : "bg-gray-900 text-white border border-gray-800"}`}
      >
        <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
      </div>
    </div>
  )
}
export default MessageBubble
