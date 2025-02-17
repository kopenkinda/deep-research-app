import pLimit from "p-limit";
import { v4 } from "uuid";
import type { FollowUpQuestionGenerationResult } from "./generate-followups";
import { generateSerpQueries } from "./generate-serp-queries";
import { processSerpResults } from "./process-serp-results";
import { searchBasedOnQueries } from "./search-serp-query";

const CONCURRENCY_LIMIT = 2;
const limit = pLimit(CONCURRENCY_LIMIT);

export type DeepResearchStep =
  | {
      type: "document:query";
      id: string;
      breadth: number;
      depth: number;
      query: string;
      goal: string;
    }
  | {
      type: "document:visit";
      id: string;
      url: string;
      result: string;
    }
  | {
      type: "document:visit-failed";
      id: string;
    };

export type DeepResearchParameters = {
  breadth: number;
  depth: number;
  query: string;
  followUps: FollowUpQuestionGenerationResult;
  learnings?: string[];
};

export async function* deepResearch(
  params: DeepResearchParameters
): AsyncGenerator<DeepResearchStep, { type: "research:finised" }, void> {
  const serpQueries = await generateSerpQueries({
    query: params.query,
    learnings: params.learnings || [],
    numQueries: params.breadth,
  });
  const queriesWithId = serpQueries.map((query) => ({
    ...query,
    id: v4(),
  }));
  for (const query of queriesWithId) {
    yield {
      type: "document:query",
      breadth: params.breadth,
      depth: params.depth,
      goal: query.researchGoal,
      id: query.id,
      query: query.query,
    };
  }
  const results = await searchBasedOnQueries(queriesWithId);
  for (const result of results) {
    if (result.fail) {
      yield {
        type: "document:visit-failed",
        id: result.id,
      };
    } else {
      yield {
        id: result.id,
        type: "document:visit",
        result: result.results.at(0)?.markdown || "",
        url: result.results.at(0)?.url || "",
      };
    }
  }

  const newBreadth = Math.ceil(params.breadth / 2);
  const newDepth = params.depth - 1;

  if (newDepth <= 0) {
    return { type: "research:finised" };
  }

  const newLearnings = await processSerpResults(
    results.filter((r) => !r.fail),
    3,
    newBreadth
  );
  for (const learnings of newLearnings) {
    yield* deepResearch({
      breadth: newBreadth,
      depth: newDepth,
      followUps: learnings.result.followUpQuestions.map((question) => ({
        question,
        placeholder: "",
      })),
      learnings: learnings.result.learnings,
      query: learnings.query,
    });
  }
  return { type: "research:finised" };
}
