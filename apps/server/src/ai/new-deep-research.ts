import { v4 } from "uuid";
import type { FollowUpQuestionGenerationResult } from "./generate-followups";
import { generateSerpQueries } from "./generate-serp-queries";
import { processSerpResults } from "./process-serp-results";
import { searchBasedOnQueries } from "./search-serp-query";
import { nextQuery } from "./prompts/next-query-prompt";

export type DeepResearchStep =
  | {
      type: "document:query";
      tempId: string;
      breadth: number;
      depth: number;
      query: string;
      goal: string;
    }
  | {
      type: "document:visit";
      tempId: string;
      url: string;
      result: string;
    }
  | {
      type: "document:visit-failed";
      tempId: string;
    }
  | {
      type: "document:learnt";
      tempId: string;
      learnings: string[];
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
): AsyncGenerator<DeepResearchStep, void, void> {
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
      tempId: query.id,
      query: query.query,
    };
  }
  const results = await searchBasedOnQueries(queriesWithId);

  for (const result of results) {
    if (result.fail) {
      yield {
        type: "document:visit-failed",
        tempId: result.tempId,
      };
    } else {
      yield {
        tempId: result.tempId,
        type: "document:visit",
        result: result.results.at(0)?.markdown || "",
        url: result.results.at(0)?.url || "",
      };
    }
  }

  const newBreadth = Math.ceil(params.breadth / 2);
  const newDepth = params.depth - 1;

  if (newDepth <= 0) {
    return;
  }

  const newLearnings = await processSerpResults(
    results.filter((r) => !r.fail),
    3,
    newBreadth
  );

  for (const learnings of newLearnings) {
    yield {
      tempId: learnings.tempId,
      type: "document:learnt",
      learnings: learnings.result.learnings,
    };
    yield* deepResearch({
      breadth: newBreadth,
      depth: newDepth,
      followUps: learnings.result.followUpQuestions.map((question) => ({
        question,
        placeholder: "",
      })),
      learnings: learnings.result.learnings,
      query: nextQuery({
        researchGoal: learnings.goal,
        followUpQuestions: learnings.result.followUpQuestions,
      }),
    });
  }
}
