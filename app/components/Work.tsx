"use client"

import { useState, useRef } from "react"
import { cubicBezier, motion, useInView } from "framer-motion"
import { cn } from "../lib/utils"


const experiments = [
  {
    title: "Project Lattice",
    medium: "Interface Study",
    description: "Structural framework for adaptive layouts in dynamic content systems.",
    span: "col-span-2 row-span-2",
  },
  {
    title: "Signal Field",
    medium: "Agent Orchestration",
    description: "Autonomous coordination layer for multi-agent environments.",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Silent Agent",
    medium: "Visual System",
    description: "Non-intrusive interface patterns for ambient computing.",
    span: "col-span-1 row-span-2",
  },
  {
    title: "Noir Grid",
    medium: "Typography",
    description: "High-contrast typographic system for editorial interfaces.",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Echo Chamber",
    medium: "Audio-Visual",
    description: "Generative soundscapes mapped to interface interactions.",
    span: "col-span-2 row-span-1",
  },
  {
    title: "Void Protocol",
    medium: "Experimental",
    description: "Negative space as primary interaction medium.",
    span: "col-span-1 row-span-1",
  },
]

export function WorkSection() {
  const headerRef = useRef(null)
  const gridRef = useRef(null)
  
  const headerInView = useInView(headerRef, { once: false, amount: 0.3 })
  const gridInView = useInView(gridRef, { once: false, amount: 0.1 })

  return (
    <motion.section
      id="work"
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
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">02 / Experiments</span>
          <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">SELECTED WORK</h2>
        </div>
        <p className="hidden md:block max-w-xs font-mono text-xs text-muted-foreground text-right leading-relaxed">
          Studies across interface design, agent systems, and visual computation.
        </p>
      </motion.div>

      {/* Asymmetric grid */}
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
        {experiments.map((experiment, index) => (
          <WorkCard key={index} experiment={experiment} index={index} persistHover={index === 0} />
        ))}
      </motion.div>
    </motion.section>
  )
}

function WorkCard({
  experiment,
  index,
  persistHover = false,
}: {
  experiment: {
    title: string
    medium: string
    description: string
    span: string
  }
  index: number
  persistHover?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const cardInView = useInView(cardRef, { once: false, amount: 0.5 })

  const isActive = isHovered || (persistHover && cardInView)

  const cardVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  }

  return (
    <motion.article
      ref={cardRef}
      variants={cardVariants}
      className={cn(
        "group relative border border-border/40 p-5 flex flex-col justify-between transition-colors duration-500 cursor-pointer overflow-hidden",
        experiment.span,
        isActive && "border-accent/60",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background layer */}
      <motion.div
        className="absolute inset-0 bg-accent/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Content */}
      <div className="relative z-10">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {experiment.medium}
        </span>
        <h3
          className={cn(
            "mt-3 font-[var(--font-bebas)] text-2xl md:text-4xl tracking-tight transition-colors duration-300",
            isActive ? "text-accent" : "text-foreground"
          )}
        >
          {experiment.title}
        </h3>
      </div>

      {/* Description - reveals on hover */}
      <div className="relative z-10">
        <motion.p
          className="font-mono text-xs text-muted-foreground leading-relaxed max-w-[280px]"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : 8,
          }}
          transition={{ duration: 0.5 }}
        >
          {experiment.description}
        </motion.p>
      </div>

      {/* Index marker */}
      <span
        className={cn(
          "absolute bottom-4 right-4 font-mono text-[10px] transition-colors duration-300",
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
    </motion.article>
  )
}

// Demo wrapper with basic styling
export default function Demo() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <style jsx>{`
        :root {
          --font-bebas: 'Arial', sans-serif;
        }
      `}</style>
      <div className="h-[50vh] flex items-center justify-center border-b border-zinc-800">
        <p className="text-zinc-500 font-mono text-sm">Scroll down to see animations</p>
      </div>
      <WorkSection />
      <div className="h-screen" />
    </div>
  )
}