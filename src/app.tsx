import { Suspense } from "react";

import { ProtectedLayout } from "./modules/auth/protected-layout";
import { SignOutButton } from "./modules/auth/sign-out-button";
import { TagsList } from "./modules/tags/tags-list";

export default function App() {
  return (
    <ProtectedLayout>
      <SignOutButton />
      <Suspense>
        <TagsList />
      </Suspense>
    </ProtectedLayout>
  );
}
