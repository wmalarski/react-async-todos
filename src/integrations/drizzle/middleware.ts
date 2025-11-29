import { os } from "@orpc/server";

import { initDrizzleConnect } from "./init";

export const drizzleRpcMiddleware = os
  .$context<{ env: Env }>()
  .middleware(async ({ next, context }) => {
    return next({
      context: {
        db: initDrizzleConnect(context.env),
      },
    });
  });
