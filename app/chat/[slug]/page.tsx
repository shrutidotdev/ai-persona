"use client";

import { getPersonaBySlug } from "@/lib/personas";
import ChatInterface from "@/app/components/ChatInterface";
import BackToPersona from "@/app/components/BackToPersona";
import { useParams } from "next/navigation";

const ChatPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const persona = getPersonaBySlug(slug);

  if (!persona) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center space-y-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-400">
            404
          </span>
          <h1 className="font-bebas text-5xl text-white">Coach Not Found</h1>
          <p className="font-mono text-sm text-neutral-400">
            This persona doesn&apos;t exist. Pick one from the home page.
          </p>
          <BackToPersona />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <ChatInterface persona={persona} />
    </div>
  );
};

export default ChatPage;
