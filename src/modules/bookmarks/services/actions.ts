import { orpc } from "@/integrations/orpc/client";
import { rpcParseIssueResult } from "@/integrations/orpc/rpc";

import { decode } from "decode-formdata";
import * as v from "valibot";

import { insertBookmarkSchema } from "./validation";

export const insertBookmarkMutation = async (formData: FormData) => {
  const parsed = v.safeParse(
    insertBookmarkSchema,
    decode(formData, { arrays: ["tags"] }),
  );

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  return orpc.bookmarks.insertBookmark(parsed.output);
};
