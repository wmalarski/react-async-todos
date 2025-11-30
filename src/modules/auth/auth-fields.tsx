import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";

import type { APIErrorBody } from "./services/router";

type AuthFieldsProps = {
  pending?: boolean;
  result?: APIErrorBody;
};

export const AuthFields = ({ pending, result }: AuthFieldsProps) => {
  return (
    <FieldSet>
      <FormError message={result?.message} />

      <Field data-invalid={!!result?.errors?.email}>
        <FieldLabel>Email</FieldLabel>
        <Input
          disabled={pending}
          inputMode="email"
          name="email"
          placeholder="Email"
          required
          type="email"
          width="full"
        />
        <FieldError errors={[{ message: result?.errors?.email }]} />
      </Field>

      <Field data-invalid={!!result?.errors?.password}>
        <FieldLabel>Password</FieldLabel>
        <Input
          disabled={pending}
          name="password"
          placeholder="Password"
          required
          type="password"
          width="full"
        />
        <FieldError errors={[{ message: result?.errors?.password }]} />
      </Field>
    </FieldSet>
  );
};
