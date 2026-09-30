import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY is not configured");
}

const groq = new Groq({
  apiKey,
});

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class AIProviderTimeoutError extends Error {
  constructor(message = "AI provider request timed out") {
    super(message);
    this.name = "AIProviderTimeoutError";
  }
}

// Maximum number of retries after the initial request
const MAX_RETRIES = 2;

// Maximum time allowed for one request to Groq
const REQUEST_TIMEOUT_MS = 15_000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTimeoutError(error: any) {
  return (
    error?.name === "TimeoutError" ||
    error?.code === "ETIMEDOUT" ||
    error?.code === "ECONNABORTED"
  );
}

function isRetryableError(error: any) {
  const status = error?.status;

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    isTimeoutError(error)
  );
}

export async function generateChatCompletion(
  messages: ChatMessage[]
) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `AI request attempt ${attempt + 1}/${MAX_RETRIES + 1}`
      );

      const completion = await groq.chat.completions.create(
        {
          model: "openai/gpt-oss-120b",
          messages,
        },
        {
          timeout: REQUEST_TIMEOUT_MS,
        }
      );

      return {
        content: completion.choices[0]?.message?.content ?? "",
        model: completion.model,
        usage: completion.usage,
      };
    } catch (error) {
      lastError = error;

      console.error(
        `AI provider attempt ${attempt + 1} failed:`,
        error
      );

      // If the provider request timed out,
      // convert it to our custom timeout error.
      if (isTimeoutError(error)) {
        if (attempt === MAX_RETRIES) {
          throw new AIProviderTimeoutError();
        }
      }

      // Do not retry permanent errors such as 401 or 404
      if (!isRetryableError(error)) {
        throw error;
      }

      // No more retries remaining
      if (attempt === MAX_RETRIES) {
        break;
      }

      // Exponential backoff:
      // 500ms → 1000ms
      const delay = 500 * Math.pow(2, attempt);

      console.log(
        `Retrying AI request in ${delay}ms...`
      );

      await sleep(delay);
    }
  }

  throw lastError;
}

export interface StructuredAIResponse {
  answer: string;
  summary: string;
  keyPoints: string[];
}

export async function generateStructuredCompletion(
  messages: ChatMessage[]
): Promise<StructuredAIResponse> {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages,
    response_format: {
      type: "json_object",
    },
  });

  const content =
    completion.choices[0]?.message?.content ?? "";

  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(
      "AI provider returned invalid JSON"
    );
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as any).answer !== "string" ||
    typeof (parsed as any).summary !== "string" ||
    !Array.isArray((parsed as any).keyPoints) ||
    !(parsed as any).keyPoints.every(
      (item: unknown) => typeof item === "string"
    )
  ) {
    throw new Error(
      "AI provider returned invalid structured output"
    );
  }

  return parsed as StructuredAIResponse;
}