import { Suspense } from "react";

import { ProtectedLayout } from "./modules/auth/protected-layout";
import { SignOutButton } from "./modules/auth/sign-out-button";
import { InsertBookmarkDialog } from "./modules/bookmarks/insert-bookmark-dialog";
import { TagsList } from "./modules/tags/tags-list";

export default function App() {
  return (
    <ProtectedLayout>
      <main className="grid gap-1 p-2">
        <header className="flex gap-1">
          <InsertBookmarkDialog
            successAction={() => {
              console.log("[successAction]");
            }}
          />
          <SignOutButton />
        </header>
        <Suspense>
          <TagsList />
        </Suspense>
      </main>
    </ProtectedLayout>
  );
}
