import { Suspense } from "react";

import { ProtectedLayout } from "./modules/auth/protected-layout";
import { SignOutButton } from "./modules/auth/sign-out-button";
import { TagsList } from "./modules/tags/tags-list";

export default function App() {
  return (
    <ProtectedLayout>
      <main className="grid gap-1 p-2">
        <SignOutButton />
        <Suspense>
          <TagsList />
        </Suspense>
      </main>
    </ProtectedLayout>
  );
}
