import {
  generateChatCompletion,
  ChatMessage,
} from "../providers/groq.provider.js";

import { prisma } from "../lib/prisma.js";

export async function chatWithAI(
  userId: number,
  message: string
) {
  // 1. Tạo conversation mới
  const conversation = await prisma.conversation.create({
    data: {
      userId,
    },
  });

  // 2. Lưu message của user
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "USER",
      content: message,
    },
  });

  // 3. Chuẩn bị messages gửi cho AI
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

  // 4. Đo thời gian gọi AI
  const startTime = Date.now();

  try {
    // 5. Gọi Groq
    const result = await generateChatCompletion(messages);

    const latencyMs = Date.now() - startTime;

    // 6. Lưu câu trả lời của AI
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "ASSISTANT",
        content: result.content,
      },
    });

    // 7. Lấy token usage
    const inputTokens = result.usage?.prompt_tokens ?? 0;
    const outputTokens = result.usage?.completion_tokens ?? 0;
    const totalTokens = result.usage?.total_tokens ?? 0;

    // 8. Lưu thông tin request
    await prisma.aIRequest.create({
      data: {
        userId,
        conversationId: conversation.id,
        model: result.model,
        provider: "groq",
        latencyMs,
        inputTokens,
        outputTokens,
        totalTokens,
        status: "SUCCESS",
      },
    });

    // 9. Trả kết quả về controller
    return {
      conversationId: conversation.id,
      content: result.content,
      model: result.model,
      usage: result.usage,
      latencyMs,
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    // Lưu request bị lỗi
    await prisma.aIRequest.create({
      data: {
        userId,
        conversationId: conversation.id,
        model: "openai/gpt-oss-120b",
        provider: "groq",
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