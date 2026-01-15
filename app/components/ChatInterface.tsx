import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  persona: string;
}
const ChatInterface = ({ persona }: ChatInterfaceProps) => {
  const [message, setMessage] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="border border-border/40 p-5 flex flex-col justify-between transition-colors duration-500 cursor-pointer overflow-hidden">
        <div className="space-y-2 flex gap-2">
          <Input
            type="text"
            placeholder="Type you message...."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />

          <Button
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-black text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">Send</Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
