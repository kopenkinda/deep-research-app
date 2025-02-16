import { generateObject } from "ai";
import { z } from "zod";
import { systemPrompt } from "./prompts/system-prompt";
import { openaiModel } from "./provider";

const folloupSchema = (numQuestions: number) =>
  z.object({
    questions: z
      .array(
        z.object({
          question: z
            .string()
            .describe(
              "The follow up question to clarify the research direction"
            ),
          placeholder: z
            .string()
            .describe("A placeholder for the answer to the follow up question"),
        })
      )
      .describe(
        `Follow up questions to clarify the research direction, max of ${numQuestions}`
      ),
  });

export async function generateFeedback({
  query,
  numQuestions = 3,
}: {
  query: string;
  numQuestions?: number;
}) {
  const userFeedback = await generateObject({
    model: openaiModel,
    system: systemPrompt(),
    prompt: `Given the following query from the user, ask some follow up questions to clarify the research direction. Return a maximum of ${numQuestions} questions, but feel free to return less if the original query is clear: <query>${query}</query>`,
    schema: folloupSchema(numQuestions),
  });

  return userFeedback.object.questions.slice(0, numQuestions);
}

export type FollowUpQuestionGenerationResult = Awaited<
  ReturnType<typeof generateFeedback>
>;
