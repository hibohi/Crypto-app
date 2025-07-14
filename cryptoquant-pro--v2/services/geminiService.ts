
import { GoogleGenAI } from "@google/genai";
import { GroundingChunk } from '../types';

if (!process.env.API_KEY) {
  // In a real app, this would be a fatal error.
  // For this environment, we provide a mock key if it's not set.
  // The user of the generated code should replace this with a real key
  // in their environment variables.
  process.env.API_KEY = "MOCK_API_KEY_REPLACE_IN_YOUR_ENV";
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface InsightResponse {
  text: string;
  sources: GroundingChunk[] | null;
}

export const fetchMarketInsights = async (prompt: string): Promise<InsightResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // systemInstruction is not recommended with googleSearch but can be used.
        // For this general purpose query, we omit it for better grounding.
      },
    });

    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks || null;

    if (!text) {
        throw new Error("Received an empty response from the AI. The model may be configured incorrectly or the prompt could not be answered.");
    }
    
    // The type assertion is safe here because we requested grounding.
    return { text, sources: sources as GroundingChunk[] | null };

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    if (error instanceof Error) {
        if(error.message.includes('API key not valid')) {
            throw new Error('The API key is invalid. Please check your environment configuration.');
        }
        throw new Error(`API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while fetching insights.");
  }
};
