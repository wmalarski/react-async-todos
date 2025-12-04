import { use } from "react";

import { useBookmarksContext } from "./bookmarks-provider";

export const BookmarkList = () => {
  const bookmarksContext = useBookmarksContext();

  const bookmarks = use(bookmarksContext.promise);

  return <pre>{JSON.stringify(bookmarks, null, 2)}</pre>;
};
