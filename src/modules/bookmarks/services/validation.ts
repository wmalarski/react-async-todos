import * as v from "valibot";

import {
  STATUS_IN_PROGRESS,
  STATUS_NEW,
  STATUS_REVIEWED,
  STATUS_REWATCH,
} from "./constansts";

export const bookmarkStatusSchema = v.union([
  v.literal(STATUS_NEW),
  v.literal(STATUS_IN_PROGRESS),
  v.literal(STATUS_REVIEWED),
  v.literal(STATUS_REWATCH),
]);

export const selectBookmarksSchema = v.object({
  page: v.optional(v.number(), 0),
  query: v.optional(v.string()),
  status: bookmarkStatusSchema,
});

export const insertBookmarkSchema = v.object({
  preview: v.optional(v.string()),
  tags: v.optional(v.array(v.string()), []),
  text: v.optional(v.string()),
  title: v.string(),
  url: v.optional(v.string()),
});

export const deleteBookmarkSchema = v.object({
  bookmarkId: v.string(),
});

export const updateBookmarkSchema = v.object({
  bookmarkId: v.string(),
  preview: v.optional(v.string()),
  tags: v.optional(v.array(v.string()), []),
  text: v.optional(v.string()),
  title: v.optional(v.string()),
  url: v.optional(v.string()),
});

export const completeBookmarkSchema = v.object({
  bookmarkId: v.string(),
  note: v.optional(v.string()),
  rate: v.optional(v.number()),
  status: bookmarkStatusSchema,
});
