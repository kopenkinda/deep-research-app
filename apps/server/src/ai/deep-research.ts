import { compact } from "lodash-es";
import pLimit from "p-limit";
import { firecrawlClient } from "./firecrawl-client";
import { generateSerpQueries } from "./generate-serp-queries";
import { processSerpResult } from "./process-serp-results";

export const CONCURRENCY_LIMIT = 2;

export type ResearchProgress = {
  currentDepth: number;
  totalDepth: number;
  currentBreadth: number;
  totalBreadth: number;
  currentQuery?: string;
  totalQueries: number;
  completedQueries: number;
};

export type ResearchResult = {
  learnings: string[];
  visitedUrls: string[];
};

export async function deepResearch({
  query,
  breadth,
  depth,
  learnings = [],
  visitedUrls = [],
  onProgress,
}: {
  query: string;
  breadth: number;
  depth: number;
  learnings?: string[];
  visitedUrls?: string[];
  onProgress?: (progress: ResearchProgress) => void | Promise<void>;
}): Promise<ResearchResult> {
  const progress: ResearchProgress = {
    currentDepth: depth,
    totalDepth: depth,
    currentBreadth: breadth,
    totalBreadth: breadth,
    totalQueries: 0,
    completedQueries: 0,
  };

  const reportProgress = async (update: Partial<ResearchProgress>) => {
    Object.assign(progress, update);
    await onProgress?.(progress);
  };

  const serpQueries = await generateSerpQueries({
    query,
    learnings,
    numQueries: breadth,
  });

  await reportProgress({
    totalQueries: serpQueries.length,
    currentQuery: serpQueries[0]?.query,
  });

  const limit = pLimit(CONCURRENCY_LIMIT);

  const results = await Promise.all(
    serpQueries.map((serpQuery) =>
      limit(async () => {
        try {
          const result = await firecrawlClient.search(serpQuery.query, {
            timeout: 15000,
            limit: 5,
            scrapeOptions: { formats: ["markdown"] },
          });

          // Collect URLs from this search
          const newUrls = compact(result.data.map((item) => item.url));
          const newBreadth = Math.ceil(breadth / 2);
          const newDepth = depth - 1;

          const newLearnings = await processSerpResult({
            query: serpQuery.query,
            result,
            numFollowUpQuestions: newBreadth,
          });
          const allLearnings = [...learnings, ...newLearnings.learnings];
          const allUrls = [...visitedUrls, ...newUrls];

          if (newDepth > 0) {
            await reportProgress({
              currentDepth: newDepth,
              currentBreadth: newBreadth,
              completedQueries: progress.completedQueries + 1,
              currentQuery: serpQuery.query,
            });

            const nextQuery = `
            Previous research goal: ${serpQuery.researchGoal}
            Follow-up research directions: ${newLearnings.followUpQuestions
              .map((q) => `\n${q}`)
              .join("")}
          `.trim();

            return deepResearch({
              query: nextQuery,
              breadth: newBreadth,
              depth: newDepth,
              learnings: allLearnings,
              visitedUrls: allUrls,
              onProgress,
            });
          }
          await reportProgress({
            currentDepth: 0,
            completedQueries: progress.completedQueries + 1,
            currentQuery: serpQuery.query,
          });
          return {
            learnings: allLearnings,
            visitedUrls: allUrls,
          };
        } catch (e) {
          if (
            e instanceof Error &&
            e.message &&
            e.message.includes("Timeout")
          ) {
            console.error(
              `Timeout error running query: ${serpQuery.query}: `,
              e
            );
          } else {
            console.error(`Error running query: ${serpQuery.query}: `, e);
          }
          return {
            learnings: [],
            visitedUrls: [],
          };
        }
      })
    )
  );

  return {
    learnings: [...new Set(results.flatMap((r) => r.learnings))],
    visitedUrls: [...new Set(results.flatMap((r) => r.visitedUrls))],
  };
}
