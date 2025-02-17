import FirecrawlApp from "@mendable/firecrawl-js";
import { env } from "../utils/env";
import { rateLimit } from "../utils/rate-limit";

export const firecrawlClient = new FirecrawlApp({
  apiKey: env.FIRECRAWL_KEY,
  apiUrl: env.FIRECRAWL_BASE_URL,
});

const rateLimitedSearch = rateLimit(
  firecrawlClient.search.bind(firecrawlClient),
  6,
  60_000
);

export const firecrawlSearch = rateLimitedSearch;
