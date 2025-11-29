import { RPCHandler } from "@orpc/server/fetch";
import {
  BatchHandlerPlugin,
  ResponseHeadersPlugin,
} from "@orpc/server/plugins";

import { router } from "./router";

export const handler = new RPCHandler(router, {
  plugins: [new BatchHandlerPlugin(), new ResponseHeadersPlugin()],
});
