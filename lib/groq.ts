import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

export const groq = new Groq({
    apiKey: apiKey || "dummy_key",
});

export const GROQ_CONFIG = {
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 1024,
};