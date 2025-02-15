import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    OPENAI_API_KEY: z.string(),
    OPENAI_MODEL: z.string().default("o3-mini"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
