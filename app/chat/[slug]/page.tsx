"use client";

import BackToPersona from "@/app/components/BackToPersona";
import ChatInterface from "@/app/components/ChatInterface";
import { PERSONAS } from "@/app/components/PersonaSection";
import { useParams } from "next/navigation";

const ChatPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const persona = PERSONAS.find((p) => p.slug === slug);

  if (!persona) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bebas text-white mb-4">
            Persona not found
          </h1>
          <BackToPersona />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <BackToPersona />
        
        <div className="mb-8 mt-4">
          <h1 className="text-7xl md:text-6xl text-center font-bebas text-white mb-2">
            Chat with {persona.name}
          </h1>
          <p className="text-gray-400 font-mono text-sm">
            {persona.description}
          </p>
        </div>

        <ChatInterface personaSlug={slug} personaName={persona.name} />
      </div>
    </div>
  );
};

export default ChatPage;