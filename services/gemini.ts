// Add ImportMetaEnv type declaration for Vite
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants.js";

export const generateAssistantResponse = async (
  userMessage: string
): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Gemini API Error: API key missing");
    return "Technical difficulty: API Key is missing.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
      },
    });

    return response.text ?? "No response from AI.";
  } catch (error) {
    console.error("Gemini error:", error);
    return "Temporary AI issue. Try again later.";
  }
};
