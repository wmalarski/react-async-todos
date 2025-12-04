import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  selectBookmarksQuery,
  type SelectBookmarksQueryInput,
  type SelectBookmarksQueryOutput,
} from "./services/actions";

type BookmarksContextValue = {
  promise: Promise<SelectBookmarksQueryOutput>;
  args: SelectBookmarksQueryInput;
  invalidate: () => void;
  update: (args: SelectBookmarksQueryInput) => void;
};

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

type BookmarksProviderProps = PropsWithChildren<{
  initialArgs: SelectBookmarksQueryInput;
}>;

export const BookmarksProvider = ({
  children,
  initialArgs,
}: BookmarksProviderProps) => {
  const [bookmarksQuery, setBookmarksQuery] = useState(() => ({
    args: initialArgs,
    promise: selectBookmarksQuery(initialArgs),
  }));

  const value = useMemo(() => {
    const invalidate = () => {
      setBookmarksQuery((current) => ({
        args: current.args,
        promise: selectBookmarksQuery(current.args),
      }));
    };

    const update = (args: SelectBookmarksQueryInput) => {
      setBookmarksQuery({
        args,
        promise: selectBookmarksQuery(args),
      });
    };

    return { ...bookmarksQuery, invalidate, update };
  }, [bookmarksQuery]);

  return <BookmarksContext value={value}>{children}</BookmarksContext>;
};

export const useBookmarksContext = () => {
  const context = useContext(BookmarksContext);

  if (!context) {
    throw new Error("BookmarksContext is not defined");
  }

  return context;
};
