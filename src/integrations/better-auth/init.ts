import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import type { Db } from "../drizzle/init";
import { schema } from "../drizzle/schema";

type InitBetterAuthArgs = {
  db: Db;
  env: Env;
};

export const initBetterAuth = ({ db, env }: InitBetterAuthArgs) => {
  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, { provider: "sqlite", schema }),
    emailAndPassword: { enabled: true },
    secret: env.BETTER_AUTH_SECRET,
  });
};

export type Auth = ReturnType<typeof initBetterAuth>;
