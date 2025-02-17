import FirecrawlApp from "@mendable/firecrawl-js";
import { env } from "../utils/env";

export const firecrawlClient = new FirecrawlApp({
  apiKey: env.FIRECRAWL_KEY,
  apiUrl: env.FIRECRAWL_BASE_URL,
});
