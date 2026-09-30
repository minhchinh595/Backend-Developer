import {
  generateStructuredCompletion,
  ChatMessage,
} from "../providers/groq.provider.js";

export async function analyzeWithAI(
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

  return generateStructuredCompletion(messages);
}