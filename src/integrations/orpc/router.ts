import { authRpcRouter } from "@/modules/auth/services/router";
import { bookmarksRpcRouter } from "@/modules/bookmarks/services/router";
import { tagsRpcRouter } from "@/modules/tags/services/router";

export const router = {
  auth: authRpcRouter,
  bookmarks: bookmarksRpcRouter,
  tags: tagsRpcRouter,
};
