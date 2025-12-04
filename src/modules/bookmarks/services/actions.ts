import {
  type OrpcInputs,
  type OrpcOutputs,
  orpc,
} from "@/integrations/orpc/client";
import { rpcParseIssueResult } from "@/integrations/orpc/rpc";

import { decode } from "decode-formdata";
import * as v from "valibot";

import { insertBookmarkSchema } from "./validation";

export type SelectBookmarksQueryInput =
  OrpcInputs["bookmarks"]["selectBookmarks"];
export type SelectBookmarksQueryOutput =
  OrpcOutputs["bookmarks"]["selectBookmarks"];
export type BookmarkOutput = SelectBookmarksQueryOutput["data"]["bookmarks"][0];

export const selectBookmarksQuery = async (args: SelectBookmarksQueryInput) => {
  return orpc.bookmarks.selectBookmarks(args);
};

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
