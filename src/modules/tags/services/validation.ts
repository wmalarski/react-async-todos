import * as v from "valibot";

export const selectTagsSchema = v.object({
  page: v.optional(v.number(), 0),
});

export const insertTagSchema = v.object({
  name: v.string(),
});

export const deleteTagSchema = v.object({
  tagId: v.string(),
});

export const updateTagSchema = v.object({
  name: v.string(),
  tagId: v.string(),
});
