import { drizzle } from "drizzle-orm/bun-sqlite";
import { env } from "../utils/env";
import { schemas } from "./schema";

const db = drizzle(env.DATABASE_URL, { schema: schemas });

export default db;
