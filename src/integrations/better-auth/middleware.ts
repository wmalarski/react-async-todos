import { ORPCError, os } from "@orpc/server";
import type { Session, User } from "better-auth";

import type { Db } from "../drizzle/init";
import { initBetterAuth } from "./init";

export const betterAuthRpcMiddleware = os
  .$context<{ db: Db; headers: Headers; env: Env }>()
  .middleware(async ({ next, context }) => {
    const auth = initBetterAuth(context);

    try {
      const response = await auth.api.getSession({ headers: context.headers });

      const session = response?.session ?? null;
      const user = response?.user ?? null;

      return next({ context: { auth, session, user } });
    } catch {
      return next({ context: { auth, session: null, user: null } });
    }
  });

export const protectedRpcMiddleware = os
  .$context<{ session: Session | null; user: User | null }>()
  .middleware(async ({ next, context }) => {
    if (!context.session || !context.user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    return next({ context: { session: context.session, user: context.user } });
  });
