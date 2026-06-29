import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SCORING_PROMPT = `You are an expert pitch coach evaluating startup pitches. Analyze the following pitch conversation and score it across 5 key dimensions on a scale of 1-10.

Score on these dimensions:
1. Problem Clarity (0-10): How clearly does the pitcher define the problem?
2. Market Size (0-10): Is the addressable market well-articulated and realistic?
3. Solution Uniqueness (0-10): How differentiated and innovative is the proposed solution?
4. Monetization (0-10): Is the business model clear and viable?
5. Storytelling (0-10): How engaging and compelling is the narrative?

Return ONLY valid JSON with this exact structure (no markdown, no backticks):
{
  "problemClarity": <number 0-10>,
  "marketSize": <number 0-10>,
  "solutionUniqueness": <number 0-10>,
  "monetization": <number 0-10>,
  "storytelling": <number 0-10>,
  "summary": "<2-sentence summary of the pitch>",
  "feedback": {
    "problemClarity": "<1-line specific feedback>",
    "marketSize": "<1-line specific feedback>",
    "solutionUniqueness": "<1-line specific feedback>",
    "monetization": "<1-line specific feedback>",
    "storytelling": "<1-line specific feedback>"
  }
}`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Messages array required" },
        { status: 400 }
      );
    }

    // Build conversation context
    const conversationText = messages
      .map((m: ChatMessage) => `${m.role === "user" ? "Pitcher" : "Coach"}: ${m.content}`)
      .join("\n\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SCORING_PROMPT },
        {
          role: "user",
          content: `Here's the pitch conversation:\n\n${conversationText}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return Response.json({ error: "No response from OpenAI" }, { status: 500 });
    }

    const scoreData = JSON.parse(content);

    return Response.json({
      success: true,
      data: scoreData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Score API Error:", error);
    return Response.json(
      { error: "Failed to score pitch" },
      { status: 500 }
    );
  }
}
