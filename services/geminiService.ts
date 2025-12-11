import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FilamentRecommendation, QuestionnaireData } from "../types";
import { APP_KNOWLEDGE_BASE } from "./knowledgeBase";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instructions for the general persona
const SYSTEM_INSTRUCTION = `
You are "Filament Genius", an expert AI assistant for 3D printing enthusiasts.
Your goal is to recommend the perfect 3D printing filament based on user needs.

# KNOWLEDGE BASE
You have access to the following internal knowledge base. Use this information to prioritize your recommendations and answers.
${APP_KNOWLEDGE_BASE}

# GUIDELINES
- You must be knowledgeable about materials like PLA, PETG, ABS, ASA, TPU, Nylon, PC, and CF blends.
- You have a modern, smart, and helpful personality.
- CRITICAL: When recommending specific products, you MUST ensure they are likely available on "3dprintergear.com.au". 
- You should construct valid URLs pointing to that domain if possible, or a search link if unsure.
`;

/**
 * Generates a structured recommendation based on questionnaire data.
 */
export const generateFilamentRecommendations = async (
  data: QuestionnaireData
): Promise<FilamentRecommendation[]> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Based on the following user requirements, recommend 2-3 specific 3D printing filaments available in Australia.
    
    User Profile:
    - Application/Use Case: ${data.application}
    - Printer Configuration: ${data.printerType}
    - Experience Level: ${data.experienceLevel}
    - Desired Aesthetic: ${data.aesthetic}
    - Budget Tier: ${data.budget}

    Instructions:
    1. Select exactly one recommendation as the "Top Pick" (isTopPick: true) that best fits the user's needs.
    2. Provide detailed technical specifications for each (Nozzle Temp, Bed Temp, Nozzle Type).
    3. Ensure product URLs point to 3dprintergear.com.au.

    Provide the output as a JSON array.
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Specific product name (e.g. PolyLite PLA)" },
        brand: { type: Type.STRING, description: "Brand name (e.g. Polymaker, eSun)" },
        material: { type: Type.STRING, description: "Material type (e.g. PLA, PETG)" },
        reason: { type: Type.STRING, description: "Why this is a good fit for the user based on the Knowledge Base" },
        priceEstimate: { type: Type.STRING, description: "Estimated price in AUD" },
        productUrl: { type: Type.STRING, description: "URL to buy on 3dprintergear.com.au" },
        isTopPick: { type: Type.BOOLEAN, description: "Set to true for the single best recommendation." },
        technicalSpecs: {
          type: Type.OBJECT,
          properties: {
            nozzleTemp: { type: Type.STRING, description: "e.g. 200-220°C" },
            bedTemp: { type: Type.STRING, description: "e.g. 60°C or 'Not Required'" },
            nozzleType: { type: Type.STRING, description: "e.g. Brass, Hardened Steel" },
            notes: { type: Type.STRING, description: "Any special reqs like 'Enclosure needed' or 'Dry box'" },
          },
          required: ["nozzleTemp", "bedTemp", "nozzleType"],
        },
      },
      required: ["name", "brand", "material", "reason", "priceEstimate", "productUrl", "isTopPick", "technicalSpecs"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) return [];
    
    return JSON.parse(jsonStr) as FilamentRecommendation[];
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [];
  }
};

/**
 * Chat service using a transient chat session.
 * In a real app, you would maintain the `Chat` object in a context or store.
 */
export const sendChatMessage = async (
  history: { role: 'user' | 'model'; text: string }[],
  newMessage: string
): Promise<string> => {
  const model = "gemini-2.5-flash";

  try {
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + " In chat mode, keep answers concise and conversational. If listing products, format them nicely with Markdown.",
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I'm having trouble connecting to the filament database right now. Please try again.";
  } catch (error) {
    console.error("Chat error:", error);
    return "An error occurred while communicating with the AI. Please check your connection.";
  }
};