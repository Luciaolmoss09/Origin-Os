import { Anthropic } from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { getProjectContext } from "./context";
import { cookies } from "next/headers";

// AI Complexity Level
export type AIComplexity = "STRATEGIC" | "OPERATIONAL";

interface AIResponse {
  content: string;
  provider: "anthropic" | "openai";
  usage?: any;
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Origin Dual-AI Orchestrator with Context Awareness
 */
export async function generateAIResponse(
  prompt: string,
  complexity: AIComplexity = "STRATEGIC",
  projectId?: string,
  systemPrompt: string = "Eres el Agente Maestro de Origin OS, experto en lanzamientos digitales y metodología Origin.",
  providerOverride?: "anthropic" | "openai"
): Promise<AIResponse> {
  try {
    // 1. Fetch Project Context (Total Memory)
    const context = projectId ? await getProjectContext(projectId) : "";
    const finalPrompt = context ? `${context}\n\nTAREA:\n${prompt}` : prompt;

    // 2. Fetch User Preference from Cookies (if available)
    let cookiePreference: string | undefined;
    try {
      const cookieStore = await cookies();
      cookiePreference = cookieStore.get("ai_provider")?.value;
    } catch (e) {
      // Cookies not available (e.g. background job)
    }

    // 3. Determine Provider
    const effectiveOverride = providerOverride || (cookiePreference === "dual" ? undefined : cookiePreference as any);
    const provider = effectiveOverride || (complexity === "STRATEGIC" ? "anthropic" : "openai");

    if (provider === "anthropic") {
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: finalPrompt }],
      });

      return {
        content: message.content[0].type === "text" ? message.content[0].text : "",
        provider: "anthropic",
      };
    } else {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: finalPrompt },
        ],
      });

      return {
        content: response.choices[0].message.content || "",
        provider: "openai",
      };
    }
  } catch (error) {
    console.error("AI Orchestrator Error:", error);
    throw new Error("Failed to generate AI response");
  }
}
