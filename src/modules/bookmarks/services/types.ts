import type * as v from "valibot";
import type { bookmarkStatusSchema } from "./validation";

export type BookmarkStatus = v.InferOutput<typeof bookmarkStatusSchema>;
