import type { Db } from "@/integrations/drizzle/init";
import { bookmark, bookmarkTag } from "@/integrations/drizzle/schema";
import { osProtectedBase } from "@/integrations/orpc/base";
import { rpcErrorResult, rpcSuccessResult } from "@/integrations/orpc/rpc";

import { and, count, eq, inArray, like, or, sql } from "drizzle-orm";

import { STATUS_NEW } from "./constansts";
import type { BookmarkStatus } from "./types";
import {
  completeBookmarkSchema,
  deleteBookmarkSchema,
  insertBookmarkSchema,
  selectBookmarksSchema,
  updateBookmarkSchema,
} from "./validation";

type TagEntry = {
  tagId: string;
  id: string;
};

type DeleteBookmarkTagsArgs = {
  existingTags: TagEntry[];
  formTags: string[];
  db: Db;
  userId: string;
};

const deleteBookmarkTags = async ({
  existingTags,
  formTags,
  db,
  userId,
}: DeleteBookmarkTagsArgs) => {
  const formTagsSet = new Set(formTags);

  const toRemove = existingTags
    .filter((tag) => !formTagsSet.has(tag.tagId))
    .map((tag) => tag.id);

  if (toRemove.length === 0) {
    return;
  }

  return db
    .delete(bookmarkTag)
    .where(
      and(inArray(bookmarkTag.id, toRemove), eq(bookmarkTag.userId, userId)),
    );
};

type InsertBookmarkTagsArgs = {
  bookmarkId: string;
  existingTags: TagEntry[];
  formTags: string[];
  db: Db;
  userId: string;
};

const insertBookmarkTags = async ({
  bookmarkId,
  existingTags,
  formTags,
  db,
  userId,
}: InsertBookmarkTagsArgs) => {
  const existingTagsSet = new Set(existingTags.map((tag) => tag.tagId));

  const toAdd = formTags.filter((tag) => !existingTagsSet.has(tag));

  if (toAdd.length === 0) {
    return;
  }

  return db.insert(bookmarkTag).values(
    toAdd.map((tagId) => ({
      bookmarkId,
      id: crypto.randomUUID(),
      tagId,
      userId,
    })),
  );
};

type UpdateBookmarkTagsArgs = {
  bookmarkId: string;
  existingTags: TagEntry[];
  formTags: string[];
  db: Db;
  userId: string;
};

const updateBookmarkTags = async ({
  bookmarkId,
  existingTags,
  formTags,
  db,
  userId,
}: UpdateBookmarkTagsArgs) => {
  return Promise.all([
    deleteBookmarkTags({
      db,
      existingTags,
      formTags,
      userId,
    }),
    insertBookmarkTags({
      bookmarkId,
      db,
      existingTags,
      formTags,
      userId,
    }),
  ]);
};

export const SELECT_BOOKMARKS_DEFAULT_LIMIT = 5;

const selectBookmarks = osProtectedBase
  .input(selectBookmarksSchema)
  .handler(async ({ context, input }) => {
    const condition = and(
      eq(bookmark.userId, context.user.id),
      eq(bookmark.status, input.status),
      input.query
        ? or(
            like(bookmark.text, `%${input.query}%`),
            like(bookmark.title, `%${input.query}%`),
            like(bookmark.note, `%${input.query}%`),
          )
        : undefined,
    );

    const offset = SELECT_BOOKMARKS_DEFAULT_LIMIT * input.page;

    const [response, countResponse] = await Promise.all([
      context.db
        .select()
        .from(bookmark)
        .innerJoin(bookmarkTag, eq(bookmark.id, bookmarkTag.bookmarkId))
        .where(condition)
        .limit(SELECT_BOOKMARKS_DEFAULT_LIMIT)
        .offset(offset)
        .orderBy(sql`RANDOM()`),
      context.db.select({ count: count() }).from(bookmark).where(condition),
    ]);

    type SelectBookmarkReturn = (typeof response)[0];
    type BookmarkModel = SelectBookmarkReturn["bookmark"];
    type BookmarkTagModel = SelectBookmarkReturn["bookmark_tag"];

    const groups = new Map<string, BookmarkTagModel[]>();
    const uniqueBookmarks: BookmarkModel[] = [];

    response.forEach((pair) => {
      const group = groups.get(pair.bookmark.id);
      if (!group) {
        uniqueBookmarks.push(pair.bookmark);
        groups.set(pair.bookmark.id, [pair.bookmark_tag]);
        return;
      }
      group.push(pair.bookmark_tag);
    });

    const bookmarksWithTags = uniqueBookmarks.map((bookmark) => ({
      ...bookmark,
      status: bookmark.status as BookmarkStatus,
      tags: groups.get(bookmark.id) ?? [],
    }));

    const totalCount = countResponse[0]?.count ?? bookmarksWithTags.length;

    return rpcSuccessResult({
      bookmarks: bookmarksWithTags,
      count: totalCount,
      hasMore: totalCount > offset + SELECT_BOOKMARKS_DEFAULT_LIMIT,
    });
  });

const insertBookmark = osProtectedBase
  .input(insertBookmarkSchema)
  .handler(async ({ context, input }) => {
    const bookmarkId = crypto.randomUUID();
    const { tags, ...values } = input;

    const response = await context.db.insert(bookmark).values({
      id: bookmarkId,
      status: STATUS_NEW,
      userId: context.user.id,
      ...values,
    });

    if (response.error) {
      return rpcErrorResult(response.error);
    }

    const tagsResponse = await context.db.insert(bookmarkTag).values(
      tags.map((tagId) => ({
        bookmarkId,
        id: crypto.randomUUID(),
        tagId,
        userId: context.user.id,
      })),
    );

    if (tagsResponse.error) {
      return rpcErrorResult(tagsResponse.error);
    }

    return rpcSuccessResult({ id: bookmarkId });
  });

const deleteBookmark = osProtectedBase
  .input(deleteBookmarkSchema)
  .handler(async ({ context, input }) => {
    const response = await context.db
      .delete(bookmark)
      .where(
        and(
          eq(bookmark.id, input.bookmarkId),
          eq(bookmark.userId, context.user.id),
        ),
      );

    if (response.error) {
      return rpcErrorResult(response.error);
    }

    return rpcSuccessResult({});
  });

const updateBookmark = osProtectedBase
  .input(updateBookmarkSchema)
  .handler(async ({ context, input }) => {
    const { bookmarkId, tags, ...values } = input;

    const response = await context.db
      .update(bookmark)
      .set(values)
      .where(
        and(eq(bookmark.id, bookmarkId), eq(bookmark.userId, context.user.id)),
      );

    if (response.error) {
      return rpcErrorResult(response.error);
    }

    const bookmarkTags = await context.db
      .select()
      .from(bookmarkTag)
      .where(
        and(
          eq(bookmarkTag.bookmarkId, bookmarkId),
          eq(bookmarkTag.userId, context.user.id),
        ),
      );

    const [deleteResponse, insertResponse] = await updateBookmarkTags({
      bookmarkId,
      db: context.db,
      existingTags: bookmarkTags,
      formTags: tags,
      userId: context.user.id,
    });

    if (deleteResponse?.error) {
      return rpcErrorResult(deleteResponse.error);
    }

    if (insertResponse?.error) {
      return rpcErrorResult(insertResponse.error);
    }

    return rpcSuccessResult({});
  });

const completeBookmark = osProtectedBase
  .input(completeBookmarkSchema)
  .handler(async ({ context, input }) => {
    const { bookmarkId, ...values } = input;

    const response = await context.db
      .update(bookmark)
      .set({ ...values, doneAt: new Date() })
      .where(
        and(eq(bookmark.id, bookmarkId), eq(bookmark.userId, context.user.id)),
      );

    if (response.error) {
      return rpcErrorResult(response.error);
    }

    return rpcSuccessResult({});
  });

export const bookmarksRpcRouter = {
  completeBookmark,
  deleteBookmark,
  insertBookmark,
  selectBookmarks,
  updateBookmark,
};
