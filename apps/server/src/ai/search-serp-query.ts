import type { FirecrawlDocument } from "@mendable/firecrawl-js";
import { firecrawlSearch } from "./firecrawl-client";

export type SERPQuerySuccessSearchResult = {
  fail: false;
  results: FirecrawlDocument[];
  tempId: string;
  query: string;
  goal: string;
};

export type SERPQueryFailSearchResult = {
  fail: true;
  tempId: string;
};

export async function searchBasedOnQueries(
  queries: Array<{ query: string; researchGoal: string; id: string }>
): Promise<Array<SERPQuerySuccessSearchResult | SERPQueryFailSearchResult>> {
  const promises = queries.map(async (query) => {
    try {
      const searchResult = await firecrawlSearch(query.query, {
        timeout: 15000,
        limit: 5,
        scrapeOptions: { formats: ["markdown"] },
      });

      if (!searchResult.success) {
        return {
          tempId: query.id,
          fail: true,
        } as const;
      }

      return {
        tempId: query.id,
        query: query.query,
        fail: false,
        goal: query.researchGoal,
        results: searchResult.data,
      } as const;
    } catch (e) {
      return {
        tempId: query.id,
        fail: true,
      } as const;
    }
  });

  return await Promise.all(promises);
}
