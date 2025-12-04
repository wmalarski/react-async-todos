import { Suspense } from "react";

import { ProtectedLayout } from "./modules/auth/protected-layout";
import { SignOutButton } from "./modules/auth/sign-out-button";
import { BookmarkList } from "./modules/bookmarks/bookmark-list";
import { BookmarksProvider } from "./modules/bookmarks/bookmarks-provider";
import { InsertBookmarkDialog } from "./modules/bookmarks/insert-bookmark-dialog";
import type { SelectBookmarksQueryInput } from "./modules/bookmarks/services/actions";
import { TagsList } from "./modules/tags/tags-list";

const initialArgs: SelectBookmarksQueryInput = {
  page: 0,
  status: "new",
};

export default function App() {
  return (
    <ProtectedLayout>
      <BookmarksProvider initialArgs={initialArgs}>
        <main className="grid gap-1 p-2">
          <header className="flex gap-1">
            <InsertBookmarkDialog />
            <SignOutButton />
          </header>
          <Suspense>
            <TagsList />
            <BookmarkList />
          </Suspense>
        </main>
      </BookmarksProvider>
    </ProtectedLayout>
  );
}
