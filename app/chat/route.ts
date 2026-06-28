import { NextRequest } from "next/server";
import OpenAI from "openai";
import { trimMessages, type ChatMessage } from "@/lib/chat";
import { getPersonaBySlug } from "@/lib/personas";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, persona } = await req.json();

    if (!persona || !getPersonaBySlug(persona)) {
      return Response.json({ error: "Invalid persona" }, { status: 400 });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages required" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role !== "user" || !lastMessage.content?.trim()) {
      return Response.json(
        { error: "Last message must be a non-empty user message" },
        { status: 400 }
      );
    }

    const personaConfig = getPersonaBySlug(persona)!;
    const history = trimMessages(messages as ChatMessage[]);

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: personaConfig.systemPrompt },
        ...history,
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
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
