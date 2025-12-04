import { type OrpcOutputs, orpc } from "@/integrations/orpc/client";
import { rpcParseIssueResult } from "@/integrations/orpc/rpc";

import { decode } from "decode-formdata";
import * as v from "valibot";

import {
  deleteTagSchema,
  insertTagSchema,
  updateTagSchema,
} from "./validation";

export const selectTagsQuery = async () => {
  return orpc.tags.selectTags({ page: 0 });
};

export type SelectTagsOutput = OrpcOutputs["tags"]["selectTags"];
export type TagOutput = SelectTagsOutput[0];

export const updateTagMutation = async (formData: FormData) => {
  const parsed = v.safeParse(updateTagSchema, decode(formData));

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  return orpc.tags.updateTag(parsed.output);
};

export const deleteTagMutation = async (formData: FormData) => {
  const parsed = v.safeParse(deleteTagSchema, decode(formData));

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  return orpc.tags.deleteTag(parsed.output);
};

export const insertTagMutation = async (formData: FormData) => {
  const parsed = v.safeParse(insertTagSchema, decode(formData));

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  return orpc.tags.insertTag(parsed.output);
};
