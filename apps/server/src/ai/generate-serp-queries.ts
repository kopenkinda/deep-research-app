import { generateObject } from "ai";
import { z } from "zod";
import { systemPrompt } from "./prompts/system-prompt";
import { openaiModel } from "./provider";

const serpQueriesSchema = (numQueries: number) =>
  z.object({
    queries: z
      .array(
        z.object({
          query: z.string().describe("The SERP query"),
          researchGoal: z
            .string()
            .describe(
              "First talk about the goal of the research that this query is meant to accomplish, then go deeper into how to advance the research once the results are found, mention additional research directions. Be as specific as possible, especially for additional research directions."
            ),
        })
      )
      .describe(`List of SERP queries, max of ${numQueries}`),
  });

// take en user query, return a list of SERP queries
export async function generateSerpQueries({
  query,
  numQueries = 3,
  learnings,
}: {
  query: string;
  numQueries?: number;

  // optional, if provided, the research will continue from the last learning
  learnings?: string[];
}) {
  const res = await generateObject({
    model: openaiModel,
    system: systemPrompt(),
    prompt: `Given the following prompt from the user, generate a list of SERP queries to research the topic. Return a maximum of ${numQueries} queries, but feel free to return less if the original prompt is clear. Make sure each query is unique and not similar to each other: <prompt>${query}</prompt>\n\n${
      learnings
        ? `Here are some learnings from previous research, use them to generate more specific queries: ${learnings.join(
            "\n"
          )}`
        : ""
    }`,
    schema: serpQueriesSchema(numQueries),
  });

  return res.object.queries.slice(0, numQueries);
}

export type SerpQueries = Awaited<ReturnType<typeof generateSerpQueries>>;
