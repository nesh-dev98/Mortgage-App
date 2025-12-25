
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getFinancialInsight(type: string, data: any) {
  try {
    const prompt = `Act as a senior mortgage advisor. Analyze the following ${type} mortgage data and provide 3 concise, high-value bullet points of professional advice. Be specific about the numbers provided.
    Data: ${JSON.stringify(data)}
    Return the advice in a clean text format suitable for a user dashboard.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching financial insights:", error);
    return "Keep an eye on current market trends and consult with a licensed professional before making major financial decisions.";
  }
}
