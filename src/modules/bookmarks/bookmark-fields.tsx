import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { OrpcOutputs } from "@/integrations/orpc/client";
import { RpcFormError } from "@/integrations/orpc/components/rpc-form-error";
import type { RpcResult } from "@/integrations/orpc/rpc";

import { useFormStatus } from "react-dom";

import { TagsCombobox } from "../tags/tags-combobox";

type SelectBookmarksOutput = OrpcOutputs["bookmarks"]["selectBookmarks"];
type BookmarkOutput = SelectBookmarksOutput["bookmarks"][0];

type BookmarkFieldsProps = {
  initialData?: Partial<BookmarkOutput>;
  result?: RpcResult;
  pending: boolean;
};

export const BookmarkFields = ({
  initialData,
  result,
}: BookmarkFieldsProps) => {
  const { pending } = useFormStatus();

  const rpcFailure = result?.success ? undefined : result;

  return (
    <FieldSet>
      <RpcFormError result={rpcFailure} />

      <FieldGroup>
        <RpcFormError result={rpcFailure} />

        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input
            aria-invalid={!!rpcFailure?.errors?.title}
            defaultValue={initialData?.title}
            disabled={pending}
            name="title"
            placeholder="Title"
            required
            type="text"
            width="full"
          />
          <FieldError>{rpcFailure?.errors?.title}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Text</FieldLabel>
          <Input
            aria-invalid={!!rpcFailure?.errors?.text}
            defaultValue={initialData?.text ?? ""}
            disabled={pending}
            name="text"
            placeholder="Text"
            required
            type="text"
            width="full"
          />
          <FieldError>{rpcFailure?.errors?.text}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Url</FieldLabel>
          <Input
            aria-invalid={!!rpcFailure?.errors?.url}
            defaultValue={initialData?.url ?? ""}
            disabled={pending}
            name="url"
            placeholder="Url"
            required
            type="url"
            width="full"
          />
          <FieldError>{rpcFailure?.errors?.url}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Preview</FieldLabel>
          <Input
            aria-invalid={!!rpcFailure?.errors?.preview}
            defaultValue={initialData?.preview ?? ""}
            disabled={pending}
            name="preview"
            placeholder="Preview"
            required
            type="text"
            width="full"
          />
          <FieldError>{rpcFailure?.errors?.preview}</FieldError>
        </Field>

        <TagsCombobox
          disabled={pending}
          initialTagIds={initialData?.tags?.map((tag) => tag.id)}
          name="tags"
        />
      </FieldGroup>
    </FieldSet>
  );
};
