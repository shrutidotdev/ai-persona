import { Persona } from "../types/persona";

import { useState, useRef } from "react";
import { cubicBezier, motion, useInView } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

function PersonaCard({
  persona,
  index,
  persistHover = false,
  onClick,
}: {
  persona: Persona;
  onClick: () => void;
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
        "group relative border border-white/15 p-4 flex flex-col transition-colors duration-500 cursor-pointer overflow-hidden bg-black",
        isActive && "border-yellow-400"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background layer */}
      <motion.div
        className="absolute inset-0 bg-transparent "
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Top section: traits + name + index */}
      <div className="relative z-10 flex items-start justify-between mb-3">
        <span className="font-mono text-[7px] uppercase tracking-widest text-white">
          [{persona.traits}]
        </span>
        <span
          className={cn(
            "font-mono text-[10px] transition-colors duration-300",
            isActive ? "text-yellow-400" : "text-neutral-600"
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Name */}
      <h3
        className={cn(
          "relative z-10 font-bebas text-3xl md:text-4xl tracking-tight transition-colors duration-300 mb-3",
          isActive ? "text-yellow-400" : "text-white"
        )}
      >
        {persona.name}
      </h3>

      {/* Image - reduced height to make room for description */}
      <div className="relative z-10 w-full h-[18rem] md:h-[26rem] overflow-hidden flex-shrink-0">
        <Image
          src={persona.image}
          alt={persona.name}
          fill
          className="object-cover "
        />
      </div>

      {/* Description - now clearly visible with better styling */}
      <div className="relative z-10 mt-4 flex-grow">
        <motion.p
          className="font-mono text-[11px] text-neutral-300 max-w-full break-words leading-relaxed"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: isActive ? 1 : 0.7,
            y: isActive ? 0 : 4,
          }}
          transition={{ duration: 0.5 }}
        >
          {persona.description}
        </motion.p>
      </div>

      {/* Button at bottom */}
      <motion.button
        initial={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 mt-4 px-6 py-3 bg-yellow-400 text-black cursor-pointer w-full"
      >
        <span className="font-bebas text-xl">Start Chatting</span>
      </motion.button>

      {/* Corner lines - top right */}
      <motion.div
        className="absolute top-0 right-0 w-12 h-12 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 w-full h-px bg-yellow-400" />
        <div className="absolute top-0 right-0 w-px h-full bg-yellow-400" />
      </motion.div>

      {/* Corner lines - bottom left */}
      <motion.div
        className="absolute bottom-0 left-0 w-12 h-12 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-400" />
        <div className="absolute bottom-0 left-0 w-px h-full bg-yellow-400" />
      </motion.div>

      {/* Tap border effect */}
      <motion.div
        className="absolute inset-0 border-2 border-yellow-400 pointer-events-none"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0 }}
        whileTap={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.article>
  );
}

export default PersonaCard;