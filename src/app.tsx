import { Button } from "@/components/ui/button";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");

  return (
    <>
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

export default App;
