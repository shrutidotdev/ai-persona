"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const BackToPersona = () => {
  const router = useRouter();
  
  return (
    <Button
      onClick={() => router.push("/")}
      className="mb-4 bg-yellow-400 text-black hover:bg-yellow-500"
    >
      ← Back to Personas
    </Button>
  );
};

export default BackToPersona;