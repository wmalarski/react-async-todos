import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { use, useMemo } from "react";

import type { TagOutput } from "../tags/services/actions";
import { useTagsContext } from "../tags/tags-provider";
import {
  type BookmarksQueryPage,
  useBookmarksContext,
} from "./bookmarks-provider";
import type { BookmarkOutput } from "./services/actions";
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
      {pages.map((page, index) => (
        <BookmarkPage
          isLastPage={index === pages.length - 1}
          key={`page-${page.args.page}`}
          page={page}
        />
      ))}
    </div>
  );
};

type BookmarkPageProps = {
  page: BookmarksQueryPage;
  isLastPage: boolean;
};

const BookmarkPage = ({ page }: BookmarkPageProps) => {
  const bookmarks = use(page.promise);

  return (
    <>
      {bookmarks.data.bookmarks.map((bookmark) => (
        <BookmarkCard bookmark={bookmark} key={bookmark.id} />
      ))}
    </>
  );
};

type BookmarkCardProps = {
  bookmark: BookmarkOutput;
};

const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
  return (
    <Card>
      <CardHeader>
        <BookmarkTags bookmark={bookmark} />
        <CardTitle>{bookmark.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <pre>{JSON.stringify(bookmark, null, 2)}</pre>
      </CardContent>
    </Card>
  );
};

type BookmarkTagsProps = {
  bookmark: BookmarkOutput;
};

const BookmarkTags = ({ bookmark }: BookmarkTagsProps) => {
  const tagsContext = useTagsContext();
  const tags = use(tagsContext.promise);

  const matchedTags = useMemo(() => {
    const tagsMap = new Map<string, TagOutput>();

    tags?.forEach((tag) => {
      tagsMap.set(tag.id, tag);
    });

    const matched: TagOutput[] = [];

    bookmark.tags.forEach((tag) => {
      const match = tagsMap.get(tag.tagId);
      if (match) {
        matched.push(match);
      }
    });

    return matched;
  }, [tags?.forEach, bookmark.tags.forEach]);

  return (
    <div className="flex flex-wrap gap-1">
      {matchedTags.map((tag) => (
        <Badge key={tag.id}>{tag.name}</Badge>
      ))}
    </div>
  );
};
