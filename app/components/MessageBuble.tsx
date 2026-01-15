"use client";

interface MessageProp {
  message: {
    role: "user" | "assistant";
    content: string;
  };
}

const MessageBubble = ({ message }: MessageProp) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2
        ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

export default MessageBubble;