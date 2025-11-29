import { tag } from "@/integrations/drizzle/schema";
import { osProtectedBase } from "@/integrations/orpc/base";
import { rpcErrorResult, rpcSuccessResult } from "@/integrations/orpc/rpc";

import { and, eq } from "drizzle-orm";

import {
  deleteTagSchema,
  insertTagSchema,
  selectTagsSchema,
  updateTagSchema,
} from "./validation";

export const SELECT_TAGS_DEFAULT_LIMIT = 50;

const selectTags = osProtectedBase
  .input(selectTagsSchema)
  .handler(async ({ input, context }) => {
    return context.db
      .select()
      .from(tag)
      .where(eq(tag.userId, context.user.id))
      .limit(SELECT_TAGS_DEFAULT_LIMIT)
      .offset(SELECT_TAGS_DEFAULT_LIMIT * input.page);
  });

const insertTag = osProtectedBase
  .input(insertTagSchema)
  .handler(async ({ input, context }) => {
    const id = crypto.randomUUID();
    const response = await context.db.insert(tag).values({
      id,
      name: input.name,
      userId: context.user.id,
    });

    if (response.error) {
      return rpcErrorResult(response.error);
    }

    return rpcSuccessResult({ id });
  });

const deleteTag = osProtectedBase
  .input(deleteTagSchema)
  .handler(async ({ input, context }) => {
    const response = await context.db
      .delete(tag)
      .where(and(eq(tag.userId, context.user.id), eq(tag.id, input.tagId)));

    if (response.error) {
      return rpcErrorResult(response.error);
    }

    return rpcSuccessResult({ id: input.tagId });
  });

const updateTag = osProtectedBase
  .input(updateTagSchema)
  .handler(async ({ input, context }) => {
    const { tagId, ...values } = input;

    const response = await context.db
      .update(tag)
      .set(values)
      .where(and(eq(tag.userId, context.user.id), eq(tag.id, tagId)));

    if (response.error) {
      return rpcErrorResult(response.error);
    }

    return rpcSuccessResult({ id: tagId });
  });

export const tagsRpcRouter = {
  deleteTag,
  insertTag,
  selectTags,
  updateTag,
};
