import { Persona } from "../types/persona";

import { useState, useRef } from "react";
import { cubicBezier, motion, useInView } from "framer-motion";
import { cn } from "../lib/utils";
import Image from "next/image";

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
        "group relative border border-border/40 p-5 flex flex-col justify-between transition-colors duration-500 cursor-pointer overflow-hidden",
        isActive && "border-white"
      )}
      onClick={onClick}
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
      <div className="relative z-10 py-2">
        <span className="font-mono text-[7px] uppercase tracking-widest text-white">
          [{persona.traits}]
        </span>

        <h3
          className={cn(
            "mt-3 font-bebas text-2xl text-right md:text-4xl tracking-tight transition-colors duration-300",
            isActive ? "text-yellow-400" : "text-white"
          )}
        >
          {persona.name}
        </h3>

        <div className="relative w-full h-94 overflow-hidden">
          <Image
            src={persona.image}
            alt={persona.name}
            fill
            className="object-cover"
          />
        </div>

        {/* <span className="text-sm text-white font-mono">[{persona.title} ]</span> */}

        <motion.button
          initial={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="px-6 py-3 bg-yellow-400 text-black cursor-pointer"
        >
          <span className="font-bebas text-2xl">Start Charting</span>
        </motion.button>
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
          "absolute top-9 right-4 font-mono text-[10px] transition-colors duration-300",
          isActive ? "text-accent" : "text-muted-foreground/40"
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Corner line */}
      <motion.div
        className="absolute top-0 right-0 w-12 h-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 w-full h-px bg-yellow-400" />
        <div className="absolute top-0 right-0 w-px h-full bg-yellow-400" />
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 w-12 h-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-400" />
        <div className="absolute bottom-0 left-0 w-px h-full bg-yellow-400" />
      </motion.div>

      {/* Click indicator */}
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
