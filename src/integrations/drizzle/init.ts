import { drizzle } from "drizzle-orm/d1";

import { schema } from "./schema";

export const initDrizzleConnect = (env: Env) => {
  return drizzle(env.prod, { schema });
};

export type Db = ReturnType<typeof initDrizzleConnect>;
