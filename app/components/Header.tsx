"use client";

import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { motion, Variants } from "framer-motion";

const btnVariants: Variants = {
  initial: { opacity: 0, y: -6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.0, 0.0, 0.2, 1] },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.12, ease: [0.0, 0.0, 0.2, 1] },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.08 },
  },
};

export default function Header() {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16 pt-10">
      <Show when="signed-out">
        <SignInButton>
          <motion.button
            variants={btnVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            className="px-6 py-3 border-2 border-yellow-400 text-yellow-400 bg-transparent cursor-pointer transition-colors duration-150 hover:bg-yellow-400 hover:text-black"
          >
            <span className="font-bebas text-2xl tracking-wide">Sign In</span>
          </motion.button>
        </SignInButton>

        <SignUpButton>
          <motion.button
            variants={btnVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            className="px-6 py-3 border-2 border-yellow-400 bg-yellow-400 text-black cursor-pointer transition-colors duration-150"
          >
            <span className="font-bebas text-2xl tracking-wide">Sign Up</span>
          </motion.button>
        </SignUpButton>
      </Show>

      <Show when="signed-in">
        <UserButton />
      </Show>
    </header>
  );
}