import { os } from "@orpc/server";
import type { ResponseHeadersPluginContext } from "@orpc/server/plugins";

import {
  betterAuthRpcMiddleware,
  protectedRpcMiddleware,
} from "../better-auth/middleware";
import { drizzleRpcMiddleware } from "../drizzle/middleware";

export interface ORPCContext extends ResponseHeadersPluginContext {
  headers: Headers;
  env: Env;
}

export const osBase = os
  .$context<ORPCContext>()
  .use(drizzleRpcMiddleware)
  .use(betterAuthRpcMiddleware);

export const osProtectedBase = osBase.use(protectedRpcMiddleware);
