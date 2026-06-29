"use client";

import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  if (pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-end gap-3 px-4 sm:px-6 lg:px-8">
        <Show when="signed-out">
          <SignInButton>
            <motion.button
              variants={btnVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              className="inline-flex items-center justify-center rounded-full border border-yellow-400/80 px-4 py-2 text-yellow-400 transition-colors duration-150 hover:bg-yellow-400 hover:text-black"
            >
              <span className="font-bebas text-xl tracking-wide">Sign In</span>
            </motion.button>
          </SignInButton>

          <SignUpButton>
            <motion.button
              variants={btnVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              className="inline-flex items-center justify-center rounded-full border border-yellow-400 bg-yellow-400 px-4 py-2 text-black transition-colors duration-150"
            >
              <span className="font-bebas text-xl tracking-wide">Sign Up</span>
            </motion.button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}