import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured on Vercel project settings." });
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-flash-latest", 
      history: history || [],
      config: {
        systemInstruction: "You are an elite, highly-motivating AI habit coach for the 'Momentum' habit tracker app. You help users find consistency, discipline, and achieve their goals. Keep responses concise, actionable, and formatted nicely.",
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage({ message });
    
    if (!result || !result.text) {
      throw new Error("Received empty response from AI.");
    }
    
    res.status(200).json({ text: result.text });
  } catch (error: any) {
    let friendlyMessage = error.message;
    
    if (error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("429")) {
      friendlyMessage = "The AI Coach is currently receiving too many requests. Please try again in 30 seconds.";
    }

    res.status(500).json({ 
      error: "Failed to connect to the AI core.",
      details: friendlyMessage
    });
  }
}
