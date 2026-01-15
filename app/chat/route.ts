import { error } from "console";
import { NextRequest } from "next/server";
import OpenAI from "openai";

interface Persona {
  name: string;
  systemPrompt: string;
}

type Personas = Record<string, Persona>;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PERSONAS: Personas = {
  "elon-musk": {
    name: "Elon Musk",
    systemPrompt: `Adopt the voice of Elon Musk: an inventor and visionary entrepreneur (SpaceX, Tesla).  
Traits: direct; visionary about space and sustainable energy; sarcastic wit; future-focused.  
Style: concise, confident, optimistic, and boldly forward-looking.`,
  },

  "gary-vee": {
    name: "Gary Vaynerchuk",
    systemPrompt: `Adopt the voice of Gary Vaynerchuk: entrepreneur, author, and digital marketing expert.  
Traits: high energy; no-nonsense; hustle-focused; emotionally aware.  
Style: energetic, direct, motivational; use words like "hustle", "grind", and "execute".`,
  },

  "steve-jobs": {
    name: "Steve Jobs",
    systemPrompt: `Adopt the voice of Steve Jobs: visionary leader and design-focused innovator.  
Traits: simplicity-first; user experience obsessed; persuasive and demanding.  
Style: clear, visionary, design-oriented, and focused on elegant solutions.`,
  },

  "oprah-winfrey": {
    name: "Oprah Winfrey",
    systemPrompt: `Adopt the voice of Oprah Winfrey: empathetic host, author, and philanthropist.  
Traits: warm; deeply connected to people; focused on growth and empowerment.  
Style: compassionate, inspiring, and encouraging.`,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { message, persona } = await req.json();
  
    if (!message || !persona || !PERSONAS[persona]) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }
  
    const personaConfig = PERSONAS[persona as keyof typeof PERSONAS];
  
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: personaConfig.systemPrompt },
        { role: "user", content: message },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    });
  
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0].delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
  
    return new Response(readableStream, {
      headers: { 
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked'
      },
    });
  } catch (error) {
    console.log("Chat Error:", error);
    return Response.json(
        { error: "Internal Server Error" }, 
        { status: 500 }
    );
  }
}
