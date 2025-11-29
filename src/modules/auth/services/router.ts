import { type ORPCContext, osBase } from "@/integrations/orpc/base";
import { APIError } from "better-auth";
import { signInSchema, signUpSchema } from "./validation";

const getUser = osBase.handler(async ({ context }) => {
  return context.user;
});

const setResHeaders = (context: ORPCContext, headers: Headers) => {
  headers.forEach((value, key) => {
    context.resHeaders?.set(key, value);
  });
};

const handleApiError = (context: ORPCContext, error: unknown) => {
  if (error instanceof APIError) {
    const headers = new Headers(error.headers);
    setResHeaders(context, headers);
    return error.body;
  }
  throw error;
};

export type APIErrorBody = APIError["body"];

const signUp = osBase
  .input(signUpSchema)
  .handler(async ({ context, input }) => {
    try {
      const response = await context.auth.api.signUpEmail({
        body: { name: input.email, ...input },
        returnHeaders: true,
      });

      setResHeaders(context, response.headers);
    } catch (error) {
      return handleApiError(context, error);
    }

    return null;
  });

const signIn = osBase
  .input(signInSchema)
  .handler(async ({ context, input }) => {
    try {
      const response = await context.auth.api.signInEmail({
        body: input,
        returnHeaders: true,
      });

      setResHeaders(context, response.headers);
    } catch (error) {
      return handleApiError(context, error);
    }

    return null;
  });

const signOut = osBase.handler(async ({ context }) => {
  try {
    const response = await context.auth.api.signOut({
      headers: context.headers,
      returnHeaders: true,
    });

    setResHeaders(context, response.headers);
  } catch (error) {
    return handleApiError(context, error);
  }
  return null;
});

export const authRpcRouter = {
  getUser,
  signIn,
  signOut,
  signUp,
};
