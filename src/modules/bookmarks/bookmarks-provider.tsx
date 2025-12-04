import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  selectBookmarksQuery,
  type SelectBookmarksQueryInput,
  type SelectBookmarksQueryOutput,
} from "./services/actions";
import { BOOKMARK_STATUSES } from "./services/constansts";
import type { BookmarkStatus } from "./services/types";

export type BookmarksQueryPage = {
  promise: Promise<SelectBookmarksQueryOutput>;
  args: SelectBookmarksQueryInput;
};

type BookmarksContextValue = {
  status: Record<BookmarkStatus, BookmarksQueryPage[]>;
  invalidate: (statuses: BookmarkStatus[]) => void;
  invalidateAll: (query?: string) => void;
  loadMore: (status: BookmarkStatus) => void;
};

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

const getInitialArray = (
  args: SelectBookmarksQueryInput,
): BookmarksQueryPage[] => {
  return [{ args, promise: selectBookmarksQuery(args) }];
};

const getStatusInitials = (
  statuses: readonly BookmarkStatus[],
  query?: string,
) => {
  return Object.fromEntries(
    statuses.map((status) => [status, getInitialArray({ query, status })]),
  ) as BookmarksContextValue["status"];
};

export const BookmarksProvider = ({ children }: PropsWithChildren) => {
  const [status, setStatus] = useState((): BookmarksContextValue["status"] => {
    return getStatusInitials(BOOKMARK_STATUSES);
  });

  const invalidate = useCallback((statuses: BookmarkStatus[]) => {
    setStatus((current) => ({
      ...current,
      ...getStatusInitials(statuses),
    }));
  }, []);

  const invalidateAll = useCallback((query?: string) => {
    setStatus((current) => ({
      ...current,
      ...getStatusInitials(BOOKMARK_STATUSES, query),
    }));
  }, []);

  const loadMore = useCallback((status: BookmarkStatus) => {
    setStatus((current) => {
      const entry = current[status];
      const lastArgs = entry[entry.length - 1].args;
      const args = { ...lastArgs, page: (lastArgs.page ?? 0) + 1 };
      const newPage = { args, promise: selectBookmarksQuery(args) };
      const copy = [...entry, newPage];
      return { ...current, [status]: copy };
    });
  }, []);

  const value = useMemo(
    () => ({ invalidate, invalidateAll, loadMore, status }),
    [status, invalidate, invalidateAll, loadMore],
  );

  return <BookmarksContext value={value}>{children}</BookmarksContext>;
};

export const useBookmarksContext = () => {
  const context = useContext(BookmarksContext);

  if (!context) {
    throw new Error("BookmarksContext is not defined");
  }

  return context;
};
