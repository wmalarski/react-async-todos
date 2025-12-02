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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import {
  type ComponentProps,
  Suspense,
  use,
  useId,
  useState,
  useTransition,
} from "react";
import { useFormStatus } from "react-dom";
import * as v from "valibot";

import { insertTagSchema, updateTagSchema } from "./services/validation";

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
    <ScrollArea className="w-[calc(100vw-1rem)]">
      <ul className="flex gap-1">
        {tags.map((tag) => (
          <li key={tag.id}>
            <TagDialog onInvalidate={onInvalidate} tag={tag} />
          </li>
        ))}
        <li>
          <InsertTagDialog onSuccess={onInvalidate} />
        </li>
      </ul>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

type TagDialogProps = {
  tag: TagOutput;
  onInvalidate: () => void;
};

const TagDialog = ({ tag, onInvalidate }: TagDialogProps) => {
  const updateFormId = useId();

  const [isOpen, setIsOpen] = useState(false);

  const [result, setResult] = useState<RpcResult>();
  const [isPendingUpdate, startUpdateTransition] = useTransition();

  const onSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startUpdateTransition(async () => {
      const parsed = await v.safeParseAsync(updateTagSchema, decode(formData));

      if (!parsed.success) {
        setResult(rpcParseIssueResult(parsed.issues));
        return;
      }

      const result = await orpc.tags.updateTag(parsed.output);
      setResult(result);

      if (result.success) {
        onSuccess();
      }
    });
  };

  const onSuccess = () => {
    setIsOpen(false);
    onInvalidate();
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        {tag.name}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit tag</DialogTitle>
          <DialogDescription>
            Make changes to tag here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form id={updateFormId} onSubmit={onSubmit}>
          <input name="tagId" type="hidden" value={tag.id} />
          <TagFieldSet
            error={result?.success ? undefined : result}
            initialData={tag}
          />
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button disabled={isPendingUpdate} form={updateFormId} type="submit">
            {isPendingUpdate ? <Spinner /> : null}
            Save changes
          </Button>
          <DeleteTagForm onSuccess={onSuccess} tag={tag} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type DeleteTagFormProps = {
  tag: TagOutput;
  onSuccess: () => void;
};

const DeleteTagForm = ({ tag, onSuccess }: DeleteTagFormProps) => {
  const deleteAction = async () => {
    const result = await orpc.tags.deleteTag({ tagId: tag.id });

    if (result.success) {
      onSuccess();
    }
  };

  return (
    <form action={deleteAction}>
      <DeleteTagFormContent />
    </form>
  );
};

const DeleteTagFormContent = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? <Spinner /> : null}
      Delete tag
    </Button>
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
  const { pending } = useFormStatus();

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create new tag</DialogTitle>
        <DialogDescription>
          Create new tag here. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      <TagFieldSet error={error} />
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

type TagFieldSetProps = {
  error?: RpcFailure;
  initialData?: Partial<TagOutput>;
};

const TagFieldSet = ({ error, initialData }: TagFieldSetProps) => {
  const nameId = useId();

  const { pending } = useFormStatus();

  return (
    <FieldSet>
      <RpcFormError result={error} />

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={nameId}>Name</FieldLabel>
          <Input
            aria-invalid={!!error?.errors?.name}
            defaultValue={initialData?.name}
            disabled={pending}
            id={nameId}
            name="name"
            required
          />
          <FieldError errors={[{ message: error?.errors?.name }]} />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
};
