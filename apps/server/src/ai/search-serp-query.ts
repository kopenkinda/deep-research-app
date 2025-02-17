import type { FirecrawlDocument } from "@mendable/firecrawl-js";
import { firecrawlClient } from "./firecrawl-client";

export type SERPQuerySuccessSearchResult = {
  fail: false;
  results: FirecrawlDocument[];
  id: string;
  query: string;
};

export type SERPQueryFailSearchResult = {
  fail: true;
  id: string;
};

let limit = 6;

export async function searchBasedOnQueries(
  queries: Array<{ query: string; researchGoal: string; id: string }>
): Promise<Array<SERPQuerySuccessSearchResult | SERPQueryFailSearchResult>> {
  const promises = queries.map(async (query) => {
    try {
      const searchResult = await firecrawlClient.search(query.query, {
        timeout: 15000,
        limit: 5,
        scrapeOptions: { formats: ["markdown"] },
      });

      if (limit === 0) {
        await new Promise((res) => {
          const iv = setInterval(() => {
            if (limit > 0) {
              clearInterval(iv);
              res(null);
            }
          }, 1000);
        });
      }

      limit--;
      setTimeout(() => {
        limit++;
      }, 60_000);

      if (!searchResult.success) {
        return {
          id: query.id,
          fail: true,
        } as const;
      }

      return {
        id: query.id,
        query: query.query,
        fail: false,
        results: searchResult.data,
      } as const;
    } catch (e) {
      return {
        id: query.id,
        fail: true,
      } as const;
    }
  });

  return await Promise.all(promises);
}
