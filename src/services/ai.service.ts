import {
  generateChatCompletion,
  ChatMessage,
  AIProviderTimeoutError,
} from "../providers/groq.provider.js";

import { prisma } from "../lib/prisma.js";

export async function chatWithAI(
  userId: number,
  message: string
) {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You are a helpful AI assistant. Answer clearly and accurately.",
    },
    {
      role: "user",
      content: message,
    },
  ];

  const startTime = Date.now();

  try {
    const result = await generateChatCompletion(messages);

    const latencyMs = Date.now() - startTime;

    await prisma.aIRequest.create({
      data: {
        userId,
        model: result.model,
        provider: "groq",
        latencyMs,
        inputTokens: result.usage?.prompt_tokens ?? null,
        outputTokens: result.usage?.completion_tokens ?? null,
        status: "SUCCESS",
      },
    });

    return result;
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    const isTimeout = error instanceof AIProviderTimeoutError;

    await prisma.aIRequest.create({
      data: {
        userId,
        model: "openai/gpt-oss-120b",
        provider: "groq",
        latencyMs,
        status: isTimeout ? "TIMEOUT" : "FAILED",
        errorMessage:
          error instanceof Error
            ? error.message
            : "Unknown AI provider error",
      },
    });

    throw error;
  }
}