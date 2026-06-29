import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-black px-4 py-10">
      <div className="pointer-events-none absolute inset-0 " />
      <div className="relative z-10 w-full max-w-md rounded-[2rem] ">
        <SignUp />
      </div>
    </div>
  );
}
