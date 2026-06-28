"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const BackToPersona = () => {
  const router = useRouter()

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Button
        onClick={() => router.push("/")}
        className="bg-yellow-400 text-black hover:bg-yellow-300 font-bebas text-lg tracking-wide transition-all duration-300"
      >
        ← Back to Personas
      </Button>
    </motion.div>
  )
}

export default BackToPersona
