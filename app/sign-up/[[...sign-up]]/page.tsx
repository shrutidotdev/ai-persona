import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-black px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/95 p-3 shadow-[0_0_80px_rgba(0,0,0,0.55)] backdrop-blur-md">
        <SignUp />
      </div>
    </div>
  );
}
