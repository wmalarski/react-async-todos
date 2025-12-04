import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

import { useUserContext } from "../auth/user-context";
import {
  selectTagsQuery,
  type SelectTagsQueryOutput,
} from "./services/actions";

type TagsContextValue = {
  promise: Promise<SelectTagsQueryOutput>;
  invalidate: () => void;
};

const TagsContext = createContext<TagsContextValue | null>(null);

export const TagsProvider = ({ children }: PropsWithChildren) => {
  const userContext = useUserContext();

  const [tagsQuery, setTagsQuery] = useState(() =>
    userContext.user.then(() => selectTagsQuery()),
  );

  const value = useMemo(() => {
    const invalidate = () => {
      setTagsQuery(selectTagsQuery());
    };

    return { invalidate, promise: tagsQuery };
  }, [tagsQuery]);

  return <TagsContext value={value}>{children}</TagsContext>;
};

export const useTagsContext = () => {
  const context = useContext(TagsContext);

  if (!context) {
    throw new Error("TagsContext is not defined");
  }

  return context;
};
