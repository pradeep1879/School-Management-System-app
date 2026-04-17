import dotenv from "dotenv";
dotenv.config();

const config = {
  JWT_SECRET: process.env.JWT_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  GEMINI_FALLBACK_MODELS:
    process.env.GEMINI_FALLBACK_MODELS ||
    "gemini-2.5-flash-lite,gemini-2.0-flash-lite",
} as const;

export default config;
