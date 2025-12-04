import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from "react";

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
  const [_counter, rerender] = useReducer((current) => current + 1, 0);

  //   const [tagsQuery, setTagsQuery] = useState(() => selectTagsQuery());

  const promise = useRef<Promise<SelectTagsQueryOutput> | null>(null);

  const getPromise = useCallback(() => {
    if (!promise.current) {
      promise.current = selectTagsQuery();
    }
    return promise.current;
  }, []);

  const invalidate = useCallback(() => {
    promise.current = selectTagsQuery();
    rerender();
  }, []);

  const value = useMemo(() => {
    return {
      invalidate,
      get promise() {
        return getPromise();
      },
    };
  }, [getPromise, invalidate]);

  return <TagsContext value={value}>{children}</TagsContext>;
};

export const useTagsContext = () => {
  const context = useContext(TagsContext);

  if (!context) {
    throw new Error("TagsContext is not defined");
  }

  return context;
};
