import {
  createORPCClient,
  type InferClientInputs,
  type InferClientOutputs,
} from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { BatchLinkPlugin } from "@orpc/client/plugins";
import type { RouterClient } from "@orpc/server";

import type { router } from "./router";

const devEndpoint = "localhost:3000";

const hrefToApi = () => {
  if (typeof location === "undefined") {
    return `http://${devEndpoint}/rpc`;
  }

  const host = import.meta.env.DEV ? devEndpoint : location.host;

  const result = `${location.protocol}//${host}/rpc`;

  return result;
};

const makeOrpcClient = (): RouterClient<typeof router> => {
  const link = new RPCLink({
    plugins: [
      new BatchLinkPlugin({
        exclude: ({ path }) => path[0] === "auth",
        groups: [{ condition: () => true, context: {} }],
        mode: "buffered",
      }),
    ],
    url: hrefToApi(),
  });

  return createORPCClient(link);
};

export const orpc = makeOrpcClient();

export type OrpcInputs = InferClientInputs<typeof orpc>;

export type OrpcOutputs = InferClientOutputs<typeof orpc>;
