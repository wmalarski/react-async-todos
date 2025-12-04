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
import { RpcFormError } from "@/integrations/orpc/components/rpc-form-error";
import type { RpcFailure, RpcResult } from "@/integrations/orpc/rpc";

import { PlusIcon } from "lucide-react";
import {
  type ComponentProps,
  startTransition,
  Suspense,
  use,
  useId,
  useState,
  useTransition,
} from "react";
import { useFormStatus } from "react-dom";

import {
  deleteTagMutation,
  insertTagMutation,
  type SelectTagsOutput,
  selectTagsQuery,
  type TagOutput,
  updateTagMutation,
} from "./services/actions";

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
  const [isUpdatePending, startUpdateTransition] = useTransition();

  const onSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startUpdateTransition(async () => {
      const result = await updateTagMutation(formData);

      startUpdateTransition(async () => {
        setResult(result);
        if (result.success) {
          onSuccess();
        }
      });
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
            pending={isUpdatePending}
          />
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button disabled={isUpdatePending} form={updateFormId} type="submit">
            {isUpdatePending ? <Spinner /> : null}
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
  const deleteAction = async (formData: FormData) => {
    const result = await deleteTagMutation(formData);

    startTransition(async () => {
      if (result.success) {
        onSuccess();
      }
    });
  };

  return (
    <form action={deleteAction}>
      <input name="tagId" type="hidden" value={tag.id} />
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

  const insertTagAction = async (formData: FormData) => {
    const result = await insertTagMutation(formData);

    startTransition(async () => {
      setResult(result);

      if (result.success) {
        setIsOpen(false);
        onSuccess();
      }
    });
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
      <TagFieldSet error={error} pending={pending} />
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
  pending: boolean;
};

const TagFieldSet = ({ error, initialData, pending }: TagFieldSetProps) => {
  const nameId = useId();

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
