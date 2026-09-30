import { prisma } from "../lib/prisma.js";

export async function getUserConversations(userId: number) {
  return prisma.conversation.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function getConversationById(
  userId: number,
  conversationId: number
) {
  return prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}