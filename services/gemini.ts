
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

export const generateAssistantResponse = async (userMessage: string): Promise<string> => {
  try {
    // Re-initialize for every call to ensure the latest API key is used and follow best practices
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.1,
        topP: 0.95,
        topK: 64,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently experiencing technical difficulties. Please try again in a few moments.";
  }
};
