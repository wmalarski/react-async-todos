import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/integrations/orpc/client";
import { rpcParseIssueResult } from "@/integrations/orpc/rpc";

import { decode } from "decode-formdata";
import { type ComponentProps, useState, useTransition } from "react";
import * as v from "valibot";

import { AuthFields } from "./auth-fields";
import type { APIErrorBody } from "./services/router";
import { signUpSchema } from "./services/validation";

type SignUpFormProps = {
  onSignInClick: () => void;
  onSignUp: () => void;
};

export const SignUpForm = ({ onSignInClick, onSignUp }: SignUpFormProps) => {
  const [isPending, startTransition] = useTransition();

  const [result, setResult] = useState<APIErrorBody>();

  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await signUpAction(new FormData(event.currentTarget));
      setResult(result ?? undefined);
      if (!result) {
        onSignUp();
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form method="post" onSubmit={onSubmit}>
          <AuthFields pending={isPending} result={result} />
          <Button disabled={isPending} type="submit">
            {isPending ? <Spinner /> : null}
            Sign Up
          </Button>
          <Button onClick={onSignInClick} type="button" variant="link">
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const signUpAction = async (form: FormData) => {
  const parsed = await v.safeParseAsync(signUpSchema, decode(form));

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const response = await orpc.auth.signUp(parsed.output);

  if (response) {
    return response;
  }

  return null;
};
