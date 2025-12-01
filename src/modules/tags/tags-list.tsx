import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { type OrpcOutputs, orpc } from "@/integrations/orpc/client";
import { RpcFormError } from "@/integrations/orpc/components/rpc-form-error";
import {
  type RpcFailure,
  type RpcResult,
  rpcParseIssueResult,
} from "@/integrations/orpc/rpc";

import { decode } from "decode-formdata";
import { PlusIcon } from "lucide-react";
import { Suspense, use, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import * as v from "valibot";

import { insertTagSchema } from "./services/validation";

export const TagsList = () => {
  const [tagsQuery, setTagsQuery] = useState(() => selectTagsQuery());

  const onInvalidate = () => {
    setTagsQuery(selectTagsQuery());
  };

  return (
    <Suspense fallback={<Spinner />}>
      <TagsListContent onInvalidate={onInvalidate} tagsQuery={tagsQuery} />
    </Suspense>
  );
};

const selectTagsQuery = async () => {
  return orpc.tags.selectTags({ page: 0 });
};

type SelectTagsOutput = OrpcOutputs["tags"]["selectTags"];
type TagOutput = SelectTagsOutput[0];

type TagsListContentProps = {
  tagsQuery: Promise<SelectTagsOutput>;
  onInvalidate: () => void;
};

const TagsListContent = ({ tagsQuery, onInvalidate }: TagsListContentProps) => {
  const tags = use(tagsQuery);

  return (
    <ul className="flex gap-1">
      {tags.map((tag) => (
        <li key={tag.id}>
          <TagDialog tag={tag} />
        </li>
      ))}
      <li>
        <InsertTagDialog onSuccess={onInvalidate} />
      </li>
    </ul>
  );
};

type TagDialogProps = {
  tag: TagOutput;
};

const TagDialog = ({ tag }: TagDialogProps) => {
  const nameId = useId();
  const userNameId = useId();

  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button variant="outline" />}>
          {tag.name}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor={nameId}>Name</Label>
              <Input defaultValue="Pedro Duarte" id={nameId} name="name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor={userNameId}>Username</Label>
              <Input defaultValue="@peduarte" id={userNameId} name="username" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

type InsertTagDialogProps = {
  onSuccess: () => void;
};

const InsertTagDialog = ({ onSuccess }: InsertTagDialogProps) => {
  const [result, setResult] = useState<RpcResult>();

  const [isOpen, setIsOpen] = useState(false);

  const insertTagAction = async (form: FormData) => {
    const parsed = await v.safeParseAsync(insertTagSchema, decode(form));

    if (!parsed.success) {
      setResult(rpcParseIssueResult(parsed.issues));
      return;
    }

    const result = await orpc.tags.insertTag(parsed.output);
    setResult(result);

    if (result.success) {
      setIsOpen(false);
      onSuccess();
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger
        aria-label="Insert new tag"
        render={<Button variant="outline" />}
      >
        <PlusIcon />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={insertTagAction}>
          <InsertTagDialogContent
            error={result?.success ? undefined : result}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

type InsertTagDialogContentProps = {
  error?: RpcFailure;
};

const InsertTagDialogContent = ({ error }: InsertTagDialogContentProps) => {
  const nameId = useId();

  const { pending } = useFormStatus();

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create new tag</DialogTitle>
        <DialogDescription>
          Create new tag here. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>

      <FieldSet>
        <RpcFormError result={error} />

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={nameId}>Name</FieldLabel>
            <Input
              aria-invalid={!!error?.errors?.name}
              disabled={pending}
              id={nameId}
              name="name"
              required
            />
            <FieldError errors={[{ message: error?.errors?.name }]} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
        <Button disabled={pending} type="submit">
          {pending ? <Spinner /> : null}
          Save changes
        </Button>
      </DialogFooter>
    </>
  );
};
