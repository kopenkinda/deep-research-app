import { openai } from "@ai-sdk/openai";
import { env } from "../utils/env";

const model = env.OPENAI_MODEL;

export const openaiModel = openai(model, {
  reasoningEffort: model.startsWith("o") ? "medium" : undefined,
  structuredOutputs: true,
});
