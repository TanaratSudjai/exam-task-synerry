import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY in environment variables");
}

export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const GROQ_CONFIG = {
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 1024,
};