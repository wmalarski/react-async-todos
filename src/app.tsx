import { Button } from "@/components/ui/button";

import { Suspense, use, useState } from "react";

import { orpc } from "./integrations/orpc/client";
import { rpcSuccessResult } from "./integrations/orpc/rpc";

const getUserQuery = async () => {
  const user = await orpc.auth.getUser();
  return rpcSuccessResult(user);
};

function App() {
  const [userQuery] = useState(() => getUserQuery());

  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");

  return (
    <>
      <Suspense fallback={"Hello from Suspense"}>
        <UserRouting userQuery={userQuery} />
      </Suspense>
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
    </>
  );
}

type UserRoutingProps = {
  userQuery: ReturnType<typeof getUserQuery>;
};

const UserRouting = ({ userQuery }: UserRoutingProps) => {
  const user = use(userQuery);

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
};

export default App;
