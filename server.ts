import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/coach", async (req, res) => {
    const { message, history } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on server." });
    }

    try {
      if (!ai) {
        throw new Error("AI client not initialized.");
      }
      
      const chat = ai.chats.create({
        model: "gemini-2.0-flash", // Using gemini-2.0-flash for high compatibility
        history: history || [],
        config: {
          systemInstruction: "You are an elite, highly-motivating AI habit coach for the 'Momentum' habit tracker app. You help users find consistency, discipline, and achieve their goals. Keep responses concise, actionable, and formatted nicely.",
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });

      const result = await chat.sendMessage({ message });
      
      if (!result || !result.text) {
        throw new Error("Received empty response from AI.");
      }
      
      res.json({ text: result.text });
    } catch (error: any) {
      console.error("Gemini Error Context:", {
        message: error.message,
        stack: error.stack,
        historyLength: history?.length
      });
      res.status(500).json({ 
        error: "Failed to connect to the AI core.",
        details: error.message 
      });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
