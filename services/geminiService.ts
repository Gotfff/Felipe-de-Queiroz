import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is available in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

export const getStyleSuggestionStream = async (
  prompt: string,
  onUpdate: (chunk: string) => void
): Promise<void> => {
  if (!API_KEY) {
    throw new Error("API Key not configured.");
  }

  try {
    const systemInstruction = `Você é 'Aether', um consultor de estilo de IA futurista para a marca de roupas de alta tecnologia FuturoWear.
    Suas recomendações devem ser concisas, estilosas e incorporar uma estética cyberpunk/techwear.
    Descreva um look completo com base na solicitação do usuário, referenciando produtos da FuturoWear quando apropriado.
    Formate sua resposta em Markdown simples com títulos e listas. Comece com um título temático para o look. Responda em Português do Brasil.`;
    
    const responseStream = await ai.models.generateContentStream({
        model: model,
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.8,
            topP: 0.9,
        }
    });

    for await (const chunk of responseStream) {
      onUpdate(chunk.text);
    }
    
  } catch (error) {
    console.error("Error fetching style suggestion from Gemini:", error);
    throw new Error("Failed to generate style suggestion.");
  }
};