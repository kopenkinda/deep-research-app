import type { SearchResponse } from "@mendable/firecrawl-js";
import { generateObject } from "ai";
import { compact } from "lodash-es";
import { z } from "zod";
import { systemPrompt } from "./prompts/system-prompt";
import { openaiModel } from "./provider";
import type { SERPQuerySuccessSearchResult } from "./search-serp-query";
import { trimPrompt } from "./utils/trim";

export async function processSerpResults(
  results: SERPQuerySuccessSearchResult[],
  numLearnings = 3,
  numFollowUpQuestions = 3
) {
  return await Promise.all(
    results.map((result) =>
      processSerpResult({
        query: result.query,
        result: {
          success: true,
          data: result.results,
        },
        numLearnings,
        numFollowUpQuestions,
      })
    )
  );
}

export async function processSerpResult({
  query,
  result,
  numLearnings = 3,
  numFollowUpQuestions = 3,
}: {
  query: string;
  result: SearchResponse;
  numLearnings?: number;
  numFollowUpQuestions?: number;
}) {
  const contents = compact(result.data.map((item) => item.markdown)).map(
    (content) => trimPrompt(content, 25_000)
  );

  const res = await generateObject({
    model: openaiModel,
    abortSignal: AbortSignal.timeout(60_000),
    system: systemPrompt(),
    prompt: `Given the following contents from a SERP search for the query <query>${query}</query>, generate a list of learnings from the contents. Return a maximum of ${numLearnings} learnings, but feel free to return less if the contents are clear. Make sure each learning is unique and not similar to each other. The learnings should be concise and to the point, as detailed and information dense as possible. Make sure to include any entities like people, places, companies, products, things, etc in the learnings, as well as any exact metrics, numbers, or dates. The learnings will be used to research the topic further.\n\n<contents>${contents
      .map((content) => `<content>\n${content}\n</content>`)
      .join("\n")}</contents>`,
    schema: z.object({
      learnings: z
        .array(z.string())
        .describe(`List of learnings, max of ${numLearnings}`),
      followUpQuestions: z
        .array(z.string())
        .describe(
          `List of follow-up questions to research the topic further, max of ${numFollowUpQuestions}`
        ),
    }),
  });

  return { result: res.object, query };
}
