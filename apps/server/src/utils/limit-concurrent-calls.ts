import pLimit from "p-limit";

export const limitCalls = pLimit(2);
