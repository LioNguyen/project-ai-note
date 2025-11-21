import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "@/app/api/core/config";

// Lazy initialization to prevent build-time errors
let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient() {
  if (!genAI) {
    try {
      genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    } catch (error) {
      throw new Error(
        `Failed to initialize Gemini client: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  return genAI;
}

export default getGeminiClient;

export async function getEmbedding(text: string) {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: config.gemini.model });

  const result = await model.embedContent(text);
  const embedding = result.embedding.values;

  if (!embedding) throw Error("Error generating embedding.");

  return embedding;
}
