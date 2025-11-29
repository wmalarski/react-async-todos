import { Button } from "@/components/ui/button";

import { useState } from "react";

import { ProtectedLayout } from "./modules/auth/protected-layout";

export default function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");

  return (
    <ProtectedLayout>
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
