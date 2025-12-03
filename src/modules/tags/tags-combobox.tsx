import {
  Combobox,
  ComboboxClear,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxPopup,
  ComboboxPositioner,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

import { ChevronDownIcon } from "lucide-react";
import { Suspense, use, useId, useState } from "react";

import { type SelectTagsOutput, selectTagsQuery } from "./services/actions";

type TagsComboboxProps = {
  initialTags?: string[];
  name: string;
  disabled?: boolean;
};

export const TagsCombobox = ({
  name,
  disabled,
  initialTags,
}: TagsComboboxProps) => {
  const [tagsQuery] = useState(() => selectTagsQuery());

  return (
    <Suspense fallback={<Spinner />}>
      <TagsComboboxInternal2
        disabled={disabled}
        initialTags={initialTags}
        name={name}
        tagsQuery={tagsQuery}
      />
    </Suspense>
  );
};

type TagsComboboxInternal2 = {
  tagsQuery: Promise<SelectTagsOutput>;
  initialTags?: string[];
  name: string;
  disabled?: boolean;
};

const TagsComboboxInternal2 = ({ tagsQuery }: TagsComboboxInternal2) => {
  const tags = use(tagsQuery);

  const id = useId();

  return (
    <div className="w-full max-w-3xs">
      <Combobox items={fruits}>
        <div className="relative flex flex-col gap-2">
          <Label htmlFor={id}>Choose a fruit</Label>
          <ComboboxInput id={id} placeholder="e.g. Apple" />
          <div className="absolute right-2 bottom-0 flex h-9 items-center justify-center text-muted-foreground">
            <ComboboxClear />
            <ComboboxTrigger
              aria-label="Open popup"
              className="h-9 w-6 border-none bg-transparent text-muted-foreground shadow-none hover:bg-transparent"
            >
              <ChevronDownIcon className="size-4" />
            </ComboboxTrigger>
          </div>
        </div>
        <ComboboxPositioner sideOffset={6}>
          <ComboboxPopup>
            <ComboboxEmpty>No fruits found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  <ComboboxItemIndicator />
                  <div className="col-start-2">{item}</div>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxPositioner>
      </Combobox>
    </div>
  );
};
const fruits = [
  "Apple",
  "Banana",
  "Orange",
  "Pineapple",
  "Grape",
  "Mango",
  "Strawberry",
  "Blueberry",
  "Raspberry",
  "Blackberry",
  "Cherry",
  "Peach",
  "Pear",
  "Plum",
  "Kiwi",
  "Watermelon",
  "Cantaloupe",
  "Honeydew",
  "Papaya",
  "Guava",
  "Lychee",
  "Pomegranate",
  "Apricot",
  "Grapefruit",
  "Passionfruit",
];

/*
type TagsComboboxInternalProps = {
  tags: TagModel[];
  initialTags?: string[];
  name: string;
  disabled?: boolean;
};

const TagsComboboxInternal: Component<TagsComboboxInternalProps> = (props) => {
  const { t } = useI18n();

  const values = createMemo(() => {
    const [get, set] = createSignal(initialTags);
    return { get, set };
  });

  const items = createMemo(() => {
    const [get, set] = createSignal(tags);
    return { get, set };
  });

  const collection = createMemo(() =>
    createListCollection({
      items: tags,
      itemToString: (item) => item.name,
      itemToValue: (item) => item.id,
    }),
  );

  const [input, setInput] = createSignal("");

  const onInputChange = (event: Combobox.InputValueChangeDetails) => {
    setInput(event.inputValue);

    const input = event.inputValue.toLowerCase();
    const filtered = tags.filter((item) =>
      item.name.toLowerCase().includes(input),
    );
    items().set(filtered.length > 0 ? filtered : tags);
  };

  const onValueChange: ComboboxRootProps<TagModel>["onValueChange"] = (
    event,
  ) => {
    values().set(event.value);
  };

  const tagsMap = createMemo(() => {
    return new Map(tags.map((tag) => [tag.id, tag]));
  });

  const selectedTags = createMemo(() => {
    const ids = values().get() ?? [];
    const map = tagsMap();

    const selectedTags: TagModel[] = [];
    ids.forEach((id) => {
      const tag = map.get(id);
      if (tag) {
        selectedTags.push(tag);
      }
    });

    return selectedTags;
  });

  const onTagRemoveFactory = (tag: TagModel) => () => {
    values().set((previous) => previous?.filter((entry) => entry !== tag.id));
  };

  return (
    <>
      <For each={values().get()}>
        {(value, index) => (
          <input name={`${name}[${index()}]`} type="hidden" value={value} />
        )}
      </For>
      <Combobox.Root
        class={css({
          display: "flex",
          flexDir: "column",
          gap: "1.5",
          w: "full",
        })}
        collection={collection()}
        disabled={disabled}
        inputValue={input()}
        multiple
        onInputValueChange={onInputChange}
        onValueChange={onValueChange}
        value={values().get()}
      >
        <Combobox.Label>{t("tags.combobox.label")}</Combobox.Label>
        <Show when={selectedTags().length > 0}>
          <Flex gap="1.5">
            <For each={selectedTags()}>
              {(value) => (
                <Badge variant="outline">
                  {value.name}
                  <IconButton
                    onClick={onTagRemoveFactory(value)}
                    size="xs"
                    type="button"
                    variant="link"
                  >
                    <XIcon />
                  </IconButton>
                </Badge>
              )}
            </For>
          </Flex>
        </Show>
        <Combobox.Control>
          <Combobox.Input
            asChild={(inputProps) => <Input {...inputProps()} />}
            placeholder={t("tags.combobox.placeholder")}
          />
          <Combobox.Trigger
            asChild={(triggerProps) => (
              <IconButton
                aria-label="open"
                size="xs"
                variant="link"
                {...triggerProps()}
              >
                <ChevronsUpDown />
              </IconButton>
            )}
          />
        </Combobox.Control>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.ItemGroup>
              <Combobox.ItemGroupLabel>
                {t("tags.combobox.label")}
              </Combobox.ItemGroupLabel>
              <For each={items().get()}>
                {(item) => (
                  <Combobox.Item item={item}>
                    <Combobox.ItemText>{item.name}</Combobox.ItemText>
                    <Combobox.ItemIndicator>
                      <Check />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                )}
              </For>
            </Combobox.ItemGroup>
          </Combobox.Content>
        </Combobox.Positioner>
      </Combobox.Root>
    </>
  );
};
*/
