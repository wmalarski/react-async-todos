import { Button } from "@/components/ui/button";

import { Suspense, useState } from "react";

import { ProtectedLayout } from "./modules/auth/protected-layout";
import { SignOutButton } from "./modules/auth/sign-out-button";
import { TagsList } from "./modules/tags/tags-list";

export default function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");

  return (
    <ProtectedLayout>
      <Suspense>
        <TagsList />
      </Suspense>
      <SignOutButton />
      <div>
        <Button
          aria-label="increment"
          onClick={() => setCount((count) => count + 1)}
          type="button"
        >
          count is {count}
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div>
        <Button
          aria-label="get name"
          onClick={() => {
            fetch("/api/")
              .then((res) => res.json() as Promise<{ name: string }>)
              .then((data) => setName(data.name));
          }}
          type="button"
        >
          Name from API is: {name}
        </Button>
      </div>
    </ProtectedLayout>
  );
}
