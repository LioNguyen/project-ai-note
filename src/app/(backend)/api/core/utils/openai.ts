import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazy initialization to prevent build-time errors
let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw Error("GEMINI_API_KEY is not set");
    }

    genAI = new GoogleGenerativeAI(apiKey);
  }

  return genAI;
}

export default getGeminiClient;

export async function getEmbedding(text: string) {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "text-embedding-004" });

  const result = await model.embedContent(text);
  const embedding = result.embedding.values;

  if (!embedding) throw Error("Error generating embedding.");

  return embedding;
}
