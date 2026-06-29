import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const FOLLOWUP_PROMPT = `You are a helpful pitch coach. Based on the conversation so far, generate 3 insightful follow-up questions the user might want to ask next.

Return ONLY valid JSON with this exact structure:
{
  "questions": [
    "<question 1 - start with a verb, be specific to their pitch>",
    "<question 2 - probe deeper into their idea>",
    "<question 3 - challenge them constructively>"
  ]
}

Rules:
- Questions should be 5-12 words
- Be specific to what they shared
- Each should explore a different angle
- No preamble, just valid JSON`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length < 2) {
      return Response.json(
        { error: "At least 2 messages required" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: FOLLOWUP_PROMPT },
        ...messages.map((m: ChatMessage) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 200,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return Response.json(
        { error: "No response from OpenAI" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);

    return Response.json({
      success: true,
      questions: parsed.questions || [],
    });
  } catch (error) {
    console.error("Followup questions error:", error);
    return Response.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
