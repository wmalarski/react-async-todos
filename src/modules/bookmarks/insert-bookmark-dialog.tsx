import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/integrations/orpc/client";
import { type RpcResult, rpcParseIssueResult } from "@/integrations/orpc/rpc";

import { decode } from "decode-formdata";
import { PlusIcon } from "lucide-react";
import { startTransition, useState } from "react";
import { useFormStatus } from "react-dom";
import * as v from "valibot";

import { BookmarkFields } from "./bookmark-fields";
import { insertBookmarkSchema } from "./services/validation";

type InsertBookmarkDialogProps = {
  successAction: () => void;
};

export const InsertBookmarkDialog = ({
  successAction,
}: InsertBookmarkDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger
        aria-label="Insert new tag"
        render={<Button variant="outline" />}
      >
        <PlusIcon />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new bookmark</DialogTitle>
          <DialogDescription>
            Create new bookmark here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <InsertBookmarkForm
          onOpenChange={setIsOpen}
          successAction={successAction}
        />
      </DialogContent>
    </Dialog>
  );
};

type InsertBookmarkFormProps = {
  onOpenChange: (isOpen: boolean) => void;
  successAction: () => void;
};

const InsertBookmarkForm = ({
  onOpenChange,
  successAction,
}: InsertBookmarkFormProps) => {
  const [result, setResult] = useState<RpcResult>();

  const insertBookmarkAction = async (form: FormData) => {
    const parsed = v.safeParse(
      insertBookmarkSchema,
      decode(form, { arrays: ["tags"] }),
    );

    console.log("[parsed]", parsed);

    if (!parsed.success) {
      setResult(rpcParseIssueResult(parsed.issues));
      return;
    }

    const result = await orpc.bookmarks.insertBookmark(parsed.output);

    startTransition(() => {
      setResult(result);

      if (result.success) {
        onOpenChange(false);
        successAction();
      }
    });
  };

  return (
    <form action={insertBookmarkAction} className="flex flex-col gap-4">
      <InsertBookmarkFormContent result={result} />
    </form>
  );
};

type InsertBookmarkFormContentProps = {
  result?: RpcResult;
};

const InsertBookmarkFormContent = ({
  result,
}: InsertBookmarkFormContentProps) => {
  const { pending } = useFormStatus();

  return (
    <>
      <BookmarkFields pending={pending} result={result} />
      <Button disabled={pending} type="submit">
        {pending ? <Spinner /> : null}
        Save changes
      </Button>
    </>
  );
};
