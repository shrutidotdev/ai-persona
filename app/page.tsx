import PersonaSelector from "./components/PersonaSelector";
import { PersonaSection } from "./components/PersonaSection";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans">
      {/* <main className="flex min-h-screen bg-black w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
       <PersonaSelector />
      </main> */}

      <PersonaSection />
    </div>
  );
}
