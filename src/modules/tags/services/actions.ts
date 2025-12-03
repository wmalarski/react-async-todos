import { type OrpcOutputs, orpc } from "@/integrations/orpc/client";

export const selectTagsQuery = async () => {
  return orpc.tags.selectTags({ page: 0 });
};

export type SelectTagsOutput = OrpcOutputs["tags"]["selectTags"];
export type TagOutput = SelectTagsOutput[0];
