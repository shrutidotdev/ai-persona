import type * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-gray-700 h-9 w-full min-w-0 border bg-gray-900 px-3 py-2 text-white text-base shadow-none transition-all outline-none font-mono placeholder-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
