"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import PersonaCard from "./PersonaCard";
import { Persona } from "../types/persona";
import { useRouter } from "next/navigation";

export const PERSONAS: Persona[] = [
  {
    id: 1,
    name: "Elon Musk",
    title: "Visionary Entrepreneur",
    description: "Direct, innovative, and boldly forward-looking perspective",
    image: "/elon.webp",
    traits: ["Visionary", "Tech-focused", "Direct", "Future-thinking"],
    slug: "elon-musk",
  },
  {
    id: 2,
    name: "Gary Vaynerchuk",
    title: "Hustle Guru",
    description: "High-energy, motivational, and no-nonsense approach",
    image: "/gary.png",
    traits: ["Energetic", "Motivational", "Hustler", "Authentic"],
    slug: "gary-vee",
  },
  {
    id: 3,
    name: "Steve Jobs",
    title: "Design Visionary",
    description: "Simplicity-first and user experience obsessed philosophy",
    image: "/stevejobs.webp",
    traits: ["Elegant", "User-focused", "Visionary", "Minimalist"],
    slug: "steve-jobs",
  },
  {
    id: 4,
    name: "Oprah Winfrey",
    title: "Empowerment Coach",
    description: "Warm, compassionate, and deeply connected to people",
    image: "/oprah.avif",
    traits: ["Empathetic", "Inspiring", "Connected", "Growth-focused"],
    slug: "oprah-winfrey",
  },
];

export function PersonaSection() {
  const router = useRouter()
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const headerInView = useInView(headerRef, { once: false, amount: 1 });
  const gridInView = useInView(gridRef, { once: false, amount: 0.1 });

  const handlePersonaClick = (slug: string) => {
    router.push(`/chat/${slug}`);
  };

  return (
    <motion.section
      id="personas"
      className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
  
      <motion.div
        ref={headerRef}
        className="mb-16 flex items-end justify-between"
        initial={{ x: -60, opacity: 0 }}
        animate={headerInView ? { x: 0, opacity: 1 } : { x: -60, opacity: 0 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-400">
            01 / AI PERSONAS
          </span>
          <h2 className="mt-4 font-bebas text-5xl md:text-7xl tracking-tight text-white">
            CHOOSE YOUR VOICE
          </h2>
        </motion.div>
        <p className="hidden md:block max-w-xs font-mono text-xs text-white text-right leading-relaxed">
          Chat with AI personalities inspired by iconic innovators and leaders.
        </p>
      </motion.div>

      <motion.div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 auto-rows-[280px] md:auto-rows-[600px]"
        initial="hidden"
        animate={gridInView ? "visible" : "hidden"}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
          hidden: {},
        }}
      >
        {PERSONAS.map((persona, index) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            index={index}
            onClick={() => handlePersonaClick(persona.slug)}
          />
        ))}
      </motion.div>
    </motion.section>
  );
}
