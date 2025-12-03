import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PlusIcon } from "lucide-react";
import { type ComponentProps, useId, useState } from "react";

import { BookmarkFields } from "./bookmark-fields";

export const InsertBookmarkDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const formId = useId();

  // const submission = useSubmission(insertBookmarkAction);

  // const onSubmit = useActionOnSubmi({
  //   action: insertBookmarkAction,
  //   onSuccess() {
  //     props.onOpenChange({ open: false });
  //   },
  // });

  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    console.log(
      "[onSubmit]",
      Object.fromEntries(new FormData(event.currentTarget).entries()),
    );
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
        <DialogHeader>
          <DialogTitle>Create new bookmark</DialogTitle>
          <DialogDescription>
            Create new bookmark here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form id={formId} onSubmit={onSubmit}>
          <BookmarkFields
          // pending={submission.pending}
          // result={submission.result}
          />
        </form>
        <DialogFooter>
          <Button
            // disabled={submission.pending}
            form={formId}
            // isLoading={submission.pending}
            type="submit"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
