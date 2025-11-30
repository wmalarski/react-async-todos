import { FormError } from "@/components/ui/form-error";

import type { RpcResult } from "../rpc";

type RpcFormErrorProps = {
  result?: RpcResult;
};

export const RpcFormError = ({ result }: RpcFormErrorProps) => {
  return <FormError message={result?.success ? undefined : result?.error} />;
};
