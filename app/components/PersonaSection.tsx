"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import PersonaCard from "./PersonaCard";
import { useRouter } from "next/navigation";
import { PERSONAS } from "@/lib/personas";

export { PERSONAS };

export function PersonaSection() {
  const router = useRouter();
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const headerInView = useInView(headerRef, { once: false, amount: 0.5 });
  const gridInView = useInView(gridRef, { once: false, amount: 0.1 });

  const handlePersonaClick = (slug: string) => {
    router.push(`/chat/${slug}`);
  };

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Hero */}
      <motion.header
        ref={headerRef}
        className="border-b border-white/10 px-6 md:px-28 pt-20 pb-12"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-400">
          Pitch Persona
        </span>
        <h1 className="mt-3 font-bebas text-6xl md:text-8xl tracking-tight text-white leading-none">
          PRACTICE YOUR PITCH
        </h1>
        <p className="mt-6 max-w-xl font-mono text-sm text-neutral-400 leading-relaxed">
          Choose an AI coach inspired by iconic leaders. Get honest feedback on
          your startup idea before you build your slides.
        </p>
      </motion.header>

      {/* Persona grid */}
      <motion.section
        id="personas"
        className="relative px-6 md:px-28 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-12 flex items-end justify-between"
          initial={{ x: -40, opacity: 0 }}
          animate={headerInView ? { x: 0, opacity: 1 } : { x: -40, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="hidden md:block max-w-xs font-mono text-xs text-neutral-400 text-left leading-relaxed">
            Each coach brings a different perspective — from design clarity to
            raw hustle.
          </p>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-400">
              01 / PITCH COACHES
            </span>
            <h2 className="mt-3 font-bebas text-4xl md:text-6xl tracking-tight text-white">
              CHOOSE YOUR COACH
            </h2>
          </div>
        </motion.div>

        <motion.div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[480px] md:auto-rows-[680px]"
          initial="hidden"
          animate={gridInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
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
    </div>
  );
}