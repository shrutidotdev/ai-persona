"use client";

import { useState, useRef } from "react";
import { cubicBezier, motion, useInView } from "framer-motion";
import { cn } from "../lib/utils";
import Image from "next/image";

interface Persona {
  id: number;
  name: string;
  title: string;
  image: string;
  description: string;
  traits: string[];
  span: string;
}
const PERSONAS: Persona[] = [
  {
    id: 1,
    name: "Elon Musk",
    title: "Visionary Entrepreneur",
    description: "Direct, innovative, and boldly forward-looking perspective",
    image: "🚀",
    traits: ["Visionary", "Tech-focused", "Direct", "Future-thinking"],
    span: "col-span-2 row-span-2",
  },
  {
    id: 2,
    name: "Gary Vaynerchuk",
    title: "Hustle Guru",
    description: "High-energy, motivational, and no-nonsense approach",
    image: "⚡",
    traits: ["Energetic", "Motivational", "Hustler", "Authentic"],
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    name: "Steve Jobs",
    title: "Design Visionary",
    description: "Simplicity-first and user experience obsessed philosophy",
    image: "✨",
    traits: ["Elegant", "User-focused", "Visionary", "Minimalist"],
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    name: "Oprah Winfrey",
    title: "Empowerment Coach",
    description: "Warm, compassionate, and deeply connected to people",
    image: "💫",
    traits: ["Empathetic", "Inspiring", "Connected", "Growth-focused"],
    span: "col-span-2 row-span-1",
  },
];

export function PersonaSection() {
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const headerInView = useInView(headerRef, { once: false, amount: 1 });
  const gridInView = useInView(gridRef, { once: false, amount: 0.1 });

  return (
    <motion.section
      id="personas"
      className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Section header */}
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
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[200px]"
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
            key={index}
            persona={persona}
            index={index}
            persistHover={index === 0}
          />
        ))}
      </motion.div>
    </motion.section>
  );
}

function PersonaCard({
  persona,
  index,
  persistHover = false,
}: {
  persona: Persona;
  index: number;
  persistHover?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: false, amount: 0.5 });

  const isActive = isHovered || (persistHover && cardInView);

  const cardVariants = {
    hidden: { y: 60, opacity: 0.3 },
    visible: {
      y: 10,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };

  return (
    <motion.article
      ref={cardRef}
      variants={cardVariants}
      className={cn(
        "group relative border border-border/40 p-5 flex flex-col justify-between transition-colors duration-500 cursor-pointer overflow-hidden",
        persona.span,
        isActive && "border-accent/60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background layer */}
      <motion.div
        className="absolute inset-0 bg-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Content */}
      <div className="relative z-10">
        <span className="font-mono text-[7px] uppercase tracking-widest text-white">
          [{persona.traits}]
        </span>
        <h3
          className={cn(
            "mt-3 font-bebas text-2xl md:text-4xl tracking-tight transition-colors duration-300",
            isActive ? "text-yellow-400" : "text-white"
          )}
        >
          {persona.name}
        </h3>
       <div className="object-contain">
         <Image
          src="https://upload.wikimedia.org/wikipedia/commons/4/49/Elon_Musk_2015.jpg"
          alt=""
          width={1000}
          height={1000}
        />
       </div>
        {/* <span className="text-sm text-white font-mono">[{persona.title} ]</span> */}
      </div>

      {/* Description - reveals on hover */}
      <div className="relative z-10">
        <motion.p
          className="font-mono text-[12px] text-muted-foreground max-w-70"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: isActive ? 1 : 0.9,
            y: isActive ? 0 : 8,
          }}
          transition={{ duration: 0.5 }}
        >
          {persona.description}
        </motion.p>
      </div>

      {/* Index marker */}
      <span
        className={cn(
          "absolute top-5 right-4 font-mono text-[10px] transition-colors duration-300",
          isActive ? "text-accent" : "text-muted-foreground/40"
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Corner line */}
      <motion.div
        className="absolute top-0 right-0 w-12 h-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 w-full h-[1px] bg-accent" />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-accent" />
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 w-12 h-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent" />
        <div className="absolute bottom-0 left-0 w-[1px] h-full bg-accent" />
      </motion.div>
    </motion.article>
  );
}

// Demo wrapper with basic styling
export default function Demo() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <PersonaSection />
      <div className="h-screen" />
    </div>
  );
}
