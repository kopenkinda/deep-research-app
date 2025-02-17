import { z } from "zod";
import { systemPrompt } from "./prompts/system-prompt";
import { openaiModel } from "./provider";
import { trimPrompt } from "./utils/trim";
import { generateObject } from "ai";

export async function writeFinalReport({
  prompt,
  learnings,
}: {
  prompt: string;
  learnings: string[];
}) {
  const learningsString = await trimPrompt(
    learnings
      .map((learning) => `<learning>\n${learning}\n</learning>`)
      .join("\n"),
    150_000
  );

  const res = await generateObject({
    model: openaiModel,
    system: systemPrompt(),
    prompt: `Given the following prompt from the user, write a final report on the topic using the learnings from research. Make it as as detailed as possible, aim for 3 or more pages, include ALL the learnings from research:\n\n<prompt>${prompt}</prompt>\n\nHere are all the learnings from previous research:\n\n<learnings>\n${learningsString}\n</learnings>`,
    schema: z.object({
      reportMarkdown: z
        .string()
        .describe("Final report on the topic in Markdown"),
    }),
  });

  return res.object.reportMarkdown;
}
