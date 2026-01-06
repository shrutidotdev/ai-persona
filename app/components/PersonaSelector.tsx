import Image from "next/image";

interface Persona {
    id: number;
    name: string;
    title: string;
    image: string;
    description: string;
    traits: string[];
}
const PERSONAS: Persona[] = [
    {
        id: 1,
        name: "Elon Musk",
        title: "Visionary Entrepreneur",
        description: "Direct, innovative, and boldly forward-looking perspective",
        image: "🚀",
        traits: ["Visionary", "Tech-focused", "Direct", "Future-thinking"],
    },
    {
        id: 2,
        name: "Gary Vaynerchuk",
        title: "Hustle Guru",
        description: "High-energy, motivational, and no-nonsense approach",
        image: "⚡",
        traits: ["Energetic", "Motivational", "Hustler", "Authentic"],
    },
    {
        id: 3,
        name: "Steve Jobs",
        title: "Design Visionary",
        description: "Simplicity-first and user experience obsessed philosophy",
        image: "✨",
        traits: ["Elegant", "User-focused", "Visionary", "Minimalist"],
    },
    {
        id: 4,
        name: "Oprah Winfrey",
        title: "Empowerment Coach",
        description: "Warm, compassionate, and deeply connected to people",
        image: "💫",
        traits: ["Empathetic", "Inspiring", "Connected", "Growth-focused"],
    },
];
const PersonaSelector = () => {
    return (
        <div className=" flex flex-col justify-center items-center text-white">
            <h1 className="text-3xl font-bold ">Choose your AI Persona to talk to</h1>
            <p className="text-sm">Select a persona to chat with and experience unique perspectives</p>

            <div className="grid grid-cols-2 py-10">
                {PERSONAS.map(({id, title , name, description, image, traits}) => (
                    <div key={id} className="bg-red-100">
                        {/* <Image
                        src={image}
                        alt={name}
                        width={1000}
                        height={1000}
                        /> */}
                        <h2 className="">{name}</h2>
                        <p>{description}</p>
                        
                        <h1>{title}</h1>

                        <div>
                            {traits.map((t) => {
                                return (
                                    <span key={t}>
                                        {t}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                ) )}
            </div>
        </div>
    );
};

export default PersonaSelector;
