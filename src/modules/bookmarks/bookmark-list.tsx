import { use } from "react";

import {
  type BookmarksQueryPage,
  useBookmarksContext,
} from "./bookmarks-provider";
import { BOOKMARK_STATUSES } from "./services/constansts";
import type { BookmarkStatus } from "./services/types";

export const BookmarkList = () => {
  return (
    <div className="grid grid-cols-4">
      {BOOKMARK_STATUSES.map((status) => (
        <BookmarkColumn key={status} status={status} />
      ))}
    </div>
  );
};

type BookmarkColumnProps = {
  status: BookmarkStatus;
};

const BookmarkColumn = ({ status }: BookmarkColumnProps) => {
  const bookmarksContext = useBookmarksContext();

  const pages = bookmarksContext.status[status];

  return (
    <div>
      {pages.map((page) => (
        <BookmarkPage key={`page-${page.args.page}`} page={page} />
      ))}
    </div>
  );
};

type BookmarkPageProps = {
  page: BookmarksQueryPage;
};

const BookmarkPage = ({ page }: BookmarkPageProps) => {
  const bookmarks = use(page.promise);

  return <pre>{JSON.stringify(bookmarks, null, 2)}</pre>;
};
