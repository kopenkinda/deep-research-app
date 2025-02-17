import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    OPENAI_API_KEY: z.string(),
    OPENAI_MODEL: z.string().default("o3-mini"),
    FIRECRAWL_KEY: z.string(),
    FIRECRAWL_BASE_URL: z.string().url().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
