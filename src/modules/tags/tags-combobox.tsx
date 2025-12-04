import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxPopup,
  ComboboxPositioner,
  ComboboxValue,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";

import { Fragment, use, useId, useMemo, useRef } from "react";

import type { TagOutput } from "./services/actions";
import { useTagsContext } from "./tags-provider";

type TagsComboboxProps = {
  initialTagIds?: string[];
  name: string;
  disabled?: boolean;
};

export const TagsCombobox = ({
  name,
  disabled,
  initialTagIds,
}: TagsComboboxProps) => {
  const tagsContext = useTagsContext();

  const tags = use(tagsContext.promise);

  const id = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const defaultValues = useMemo(() => {
    if (!initialTagIds || initialTagIds?.length === 0) {
      return [];
    }

    const map = new Map(tags.map((tag) => [tag.id, tag]));
    const defaultValues: TagOutput[] = [];

    initialTagIds.forEach((tagId) => {
      const tag = map.get(tagId);
      if (tag) {
        defaultValues.push(tag);
      }
    });

    return defaultValues;
  }, [initialTagIds, tags.map]);

  return (
    <Combobox
      defaultValue={defaultValues}
      disabled={disabled}
      items={tags}
      multiple
    >
      <div className="flex w-full flex-col gap-3">
        <Label htmlFor={id}>Tags</Label>
        <ComboboxChips ref={containerRef}>
          <ComboboxValue>
            {(value: TagOutput[]) => (
              <Fragment>
                {value.map((tag, index) => (
                  <ComboboxChip aria-label={tag.name} key={tag.id}>
                    <input
                      name={`${name}[${index}]`}
                      type="hidden"
                      value={tag.id}
                    />
                    {tag.name}
                    <ComboboxChipRemove />
                  </ComboboxChip>
                ))}
                <ComboboxInput
                  className="h-6 flex-1 border-0 bg-transparent pl-2 text-base shadow-none outline-none focus-visible:ring-0"
                  id={id}
                  placeholder="Tag"
                />
              </Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
      </div>
      <ComboboxPositioner
        anchor={containerRef}
        className="z-50 outline-none"
        sideOffset={6}
      >
        <ComboboxPopup>
          <ComboboxEmpty>No tags found.</ComboboxEmpty>
          <ComboboxList>
            {(tag: TagOutput) => (
              <ComboboxItem key={tag.id} value={tag}>
                <ComboboxItemIndicator />
                <div className="col-start-2">{tag.name}</div>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </ComboboxPositioner>
    </Combobox>
  );
};
