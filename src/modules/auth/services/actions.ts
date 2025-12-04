import { orpc } from "@/integrations/orpc/client";
import { rpcParseIssueResult, rpcSuccessResult } from "@/integrations/orpc/rpc";

import { decode } from "decode-formdata";
import * as v from "valibot";

import { signInSchema, signUpSchema } from "./validation";

export const getUserQuery = async () => {
  const user = await orpc.auth.getUser();
  return rpcSuccessResult(user);
};

export const signInMutation = async (formData: FormData) => {
  const parsed = await v.safeParseAsync(signInSchema, decode(formData));

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const response = await orpc.auth.signIn(parsed.output);

  if (response) {
    return response;
  }

  return null;
};

export const signUpMutation = async (formData: FormData) => {
  const parsed = await v.safeParseAsync(signUpSchema, decode(formData));

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const response = await orpc.auth.signUp(parsed.output);

  if (response) {
    return response;
  }

  return null;
};

export const signOutMutation = async () => {
  await orpc.auth.signOut();
};
