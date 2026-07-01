import { PersonaSection } from "./components/PersonaSection";
import { currentUser } from '@clerk/nextjs/server';

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4 ">
      <h1 className="mt-3 font-bebas text-2xl md:text-4xl tracking-tight text-white leading-none ">
        Welcome, {user ? user.firstName : "to Pitch Persona"}
      </h1>
      <PersonaSection />
    </div>
  );
}