import { prisma } from "../lib/prisma.js";

export async function getUserUsage(userId: number) {
  const requests = await prisma.aIRequest.findMany({
    where: {
      userId,
    },
    select: {
      inputTokens: true,
      outputTokens: true,
      latencyMs: true,
      status: true,
    },
  });

  const totalRequests = requests.length;

  const totalTokens = requests.reduce((total, request) => {
    return (
      total +
      (request.inputTokens ?? 0) +
      (request.outputTokens ?? 0)
    );
  }, 0);

  const latencyValues = requests
    .map((request) => request.latencyMs)
    .filter((latency): latency is number => latency !== null);

  const averageLatency =
    latencyValues.length > 0
      ? latencyValues.reduce((sum, latency) => sum + latency, 0) /
        latencyValues.length
      : 0;

  const failedRequests = requests.filter(
    (request) => request.status === "FAILED"
  ).length;

  const errorRate =
    totalRequests > 0
      ? failedRequests / totalRequests
      : 0;

  return {
    requests: totalRequests,
    tokens: totalTokens,
    average_latency_ms: Math.round(averageLatency),
    error_rate: Number(errorRate.toFixed(4)),
  };
}