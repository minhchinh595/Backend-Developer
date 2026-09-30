import {
  generateStructuredCompletion,
  ChatMessage,
} from "../providers/groq.provider.js";

import { prisma } from "../lib/prisma.js";

export async function analyzeWithAI(
  userId: number,
  message: string
) {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `
You are an AI assistant.

Return your response as JSON with exactly this structure:

{
  "answer": "string",
  "summary": "string",
  "keyPoints": ["string"]
}

Do not return markdown.
Do not include any text outside the JSON object.
      `.trim(),
    },
    {
      role: "user",
      content: message,
    },
  ];

  const startTime = Date.now();

  try {
    const result = await generateStructuredCompletion(messages);

    const latencyMs = Date.now() - startTime;

    await prisma.aIRequest.create({
      data: {
        userId,
        model: "openai/gpt-oss-120b",
        provider: "groq",
        timestamp: new Date(),
        latencyMs,
        status: "SUCCESS",
      },
    });

    return result;
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    await prisma.aIRequest.create({
      data: {
        userId,
        model: "openai/gpt-oss-120b",
        provider: "groq",
        timestamp: new Date(),
        latencyMs,
        status: "FAILED",
        errorMessage:
          error instanceof Error
            ? error.message
            : "Unknown AI provider error",
      },
    });

    throw error;
  }
}