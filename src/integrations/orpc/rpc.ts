import type * as v from "valibot";

export type RpcFailure = {
  error?: string;
  errors?: Record<string, string>;
  success: false;
};

// biome-ignore lint/suspicious/noExplicitAny: needed
export type RpcSuccess<T = any> = {
  data: T;
  success: true;
};

// biome-ignore lint/suspicious/noExplicitAny: needed
export type RpcResult<T = any> = RpcFailure | RpcSuccess<T>;

// biome-ignore lint/suspicious/noExplicitAny: needed
export const rpcSuccessResult = <T = any>(data: T): RpcSuccess<T> => {
  return { data, success: true };
};

export const rpcErrorResult = <T extends { message: string }>(
  error: T,
): RpcFailure => {
  return { error: error.message, success: false };
};

export const rpcParseIssueResult = (
  issues: v.BaseIssue<unknown>[],
): RpcFailure => {
  return {
    errors: Object.fromEntries(
      issues.map((issue) => [
        issue.path?.map((item) => item.key).join(".") || "global",
        issue.message,
      ]),
    ),
    success: false,
  };
};
