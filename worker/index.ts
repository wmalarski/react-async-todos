import { handler } from "../src/integrations/orpc/handler";

export default {
  async fetch(request, env) {
    const rpcResult = await handler.handle(request, {
      context: { env, headers: request.headers },
      prefix: "/rpc",
    });

    if (rpcResult.matched) {
      return rpcResult.response;
    }

    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
