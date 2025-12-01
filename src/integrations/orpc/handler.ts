import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import {
  BatchHandlerPlugin,
  ResponseHeadersPlugin,
} from "@orpc/server/plugins";

import { router } from "./router";

export const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
  plugins: [new BatchHandlerPlugin(), new ResponseHeadersPlugin()],
});
