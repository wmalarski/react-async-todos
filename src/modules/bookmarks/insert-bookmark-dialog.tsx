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
import { useId, useState } from "react";

import { BookmarkFields } from "./bookmark-fields";

export const InsertBookmarkControlledDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const formId = useId();

  // const submission = useSubmission(insertBookmarkAction);

  // const onSubmit = useActionOnSubmi({
  //   action: insertBookmarkAction,
  //   onSuccess() {
  //     props.onOpenChange({ open: false });
  //   },
  // });

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
          <DialogTitle>{"bookmarks.dialogs.create"}</DialogTitle>
          <DialogDescription>{"bookmarks.dialogs.create"}</DialogDescription>
        </DialogHeader>
        <form id={formId}>
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
            {"common.save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
