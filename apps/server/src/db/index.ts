import { drizzle } from "drizzle-orm/bun-sqlite";
import { env } from "../utils/env";

const db = drizzle(env.DATABASE_URL);

export default db;
