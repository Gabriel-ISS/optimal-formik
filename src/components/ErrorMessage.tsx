import { InputCommon, SecureOmit } from "@/helpers.types";
import { useFieldErrorData } from "@/hooks";
import { HTMLProps } from "react";

type ErrorMessageProps = Pick<InputCommon, "name"> &
  SecureOmit<HTMLProps<HTMLDivElement>, "name">;

/** Shows the error message for a field if exist */
export function ErrorMessage({ name, ...props }: ErrorMessageProps) {
  const { touched, error } = useFieldErrorData(name);

  if (!touched || !error) return null;
  return <div {...props}>{error}</div>;
}
