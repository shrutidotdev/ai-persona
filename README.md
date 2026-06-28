# Pitch Persona

Practice your startup pitch with AI coaches inspired by iconic leaders — then refine your story before you build slides.

**Stack:** Next.js 16 · OpenAI streaming API · Tailwind CSS · Framer Motion

---

## What it does

- Pick a pitch coach (Steve Jobs, Oprah, Elon Musk, Gary Vee)
- Multi-turn pitch practice with **streaming** AI responses
- Coaches **remember** your earlier messages in the conversation
- Conversations persist in **localStorage** (survive page refresh)

---

## Architecture

```
Browser (ChatInterface)
  → POST /chat  { persona, messages[] }
    → lib/personas.ts   (system prompt lookup)
    → lib/chat.ts       (trim history to last 20 messages)
    → OpenAI gpt-3.5-turbo (streaming)
  ← text/plain stream → UI renders token-by-token
```

---

## What broke & how I fixed it

### Bug: Personas had amnesia

**Symptom:** Follow-up questions like *"Can you expand on that?"* got generic or wrong answers, even though the chat UI showed full history.

**Cause:** The frontend kept all messages in React state, but `POST /chat` only forwarded the **latest** user string to OpenAI — so every request looked like a brand-new one-turn conversation.

**Fix:**
1. Changed the API to accept a `messages[]` array instead of a single `message` string
2. Updated `ChatInterface` to send the full conversation history on every request
3. Added `trimMessages()` in `lib/chat.ts` to cap history at 20 messages (keeps us within the context window)

**Lesson:** Always trace the full request payload end-to-end. UI state and API input can drift apart silently.

---

## Run locally

```bash
pnpm install
cp env .env        # add your OPENAI_API_KEY
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), pick a coach, and start pitching.

---

## Project structure

```
lib/
  personas.ts     # Single source of truth — UI metadata + system prompts
  chat.ts         # Message trimming + localStorage key helper
app/
  chat/route.ts   # Streaming OpenAI API route
  components/
    ChatInterface.tsx   # Chat UI, history, localStorage
    PersonaSection.tsx  # Landing page persona grid
```
