
import { GoogleGenAI } from "@google/genai";

// Use a factory function to always get a fresh instance with the current API key.
// The key is assumed to be valid and available via process.env.API_KEY.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateImage = async (prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "16:9") => {
  try {
    const ai = getAI();
    // Image generation with nano banana series models must use generateContent.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio,
        },
      },
    });

    let imageUrl = '';
    // Iterate through all parts to find the image part, as it might not be the first part.
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }
    
    return imageUrl || null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};

export const chatWithWally = async (message: string) => {
  try {
    const ai = getAI();
    // For standard text generation, call generateContent with both model name and prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: "You are 'Wally AI', a helpful creative assistant for a design studio app. You help users generate wallpapers, icons, and fonts. Keep your responses concise and creative.",
      }
    });
    // Extract text using the .text property directly from the response object.
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Chat failed:", error);
    return "Error connecting to AI service.";
  }
};
