import { handler } from "../src/integrations/orpc/handler";

export default {
  async fetch(request, env) {
    console.log("[FETCH]", request.url);

    const rpcResult = await handler.handle(request, {
      context: { env, headers: request.headers },
      prefix: "/rpc",
    });

    console.log("[FETCH]", rpcResult);

    if (rpcResult.matched) {
      return rpcResult.response;
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
