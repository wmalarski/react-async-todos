import { Suspense } from "react";

import { Spinner } from "./components/ui/spinner";
import { ProtectedLayout } from "./modules/auth/protected-layout";
import { SignOutButton } from "./modules/auth/sign-out-button";
import { UserContextProvider } from "./modules/auth/user-context";
import { BookmarkList } from "./modules/bookmarks/bookmark-list";
import { BookmarksProvider } from "./modules/bookmarks/bookmarks-provider";
import { InsertBookmarkDialog } from "./modules/bookmarks/insert-bookmark-dialog";
import { TagsList } from "./modules/tags/tags-list";
import { TagsProvider } from "./modules/tags/tags-provider";

export default function App() {
  return (
    <UserContextProvider>
      <Suspense fallback={<Spinner />}>
        <ProtectedLayout>
          <BookmarksProvider>
            <TagsProvider>
              <Suspense fallback={<Spinner />}>
                <main className="grid gap-1 p-2">
                  <header className="flex gap-1">
                    <InsertBookmarkDialog />
                    <SignOutButton />
                  </header>
                  <TagsList />
                  <BookmarkList />
                </main>
              </Suspense>
            </TagsProvider>
          </BookmarksProvider>
        </ProtectedLayout>
      </Suspense>
    </UserContextProvider>
  );
}
