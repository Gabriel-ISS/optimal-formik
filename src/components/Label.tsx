import { ErrorMessage } from "@/components/ErrorMessage";
import { Rename, InputCommon, SecureOmit } from "@/helpers.types";
import { HTMLProps } from "react";

type LabelProps = SecureOmit<
  Rename<InputCommon, "label", "children">,
  "containerClass" | "labelClass"
> &
  SecureOmit<HTMLProps<HTMLLabelElement>, "name">;

export function Label({ name, children, hideLabel, errorClass, ...props }: LabelProps) {
  const path = name.toString();
  return (
    <>
      <label htmlFor={path} hidden={hideLabel} {...props}>
        {children}
      </label>
      <ErrorMessage className={errorClass} name={name} />
    </>
  );
}
