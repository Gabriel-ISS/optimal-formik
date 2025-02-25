import { Label } from "@/components/Label";
import { InputCommon, SecureOmit } from "@/helpers.types";
import { useField } from "@/hooks";
import { InputHTMLAttributes } from "react";

export type InputProps = InputCommon &
  SecureOmit<InputHTMLAttributes<HTMLInputElement>, "id" | "name">;

export function Input({
  name,
  label,
  hideLabel,
  containerClass,
  labelClass,
  errorClass,
  ...props
}: InputProps) {
  const [inputProps] = useField<any>(
    name,
    ["number", "tel"].includes(props.type || "") ? "number" : "string"
  );

  if (inputProps.value === undefined) inputProps.value = "";

  return (
    <div className={containerClass}>
      <Label
        className={labelClass}
        errorClass={errorClass}
        name={name}
        hideLabel={hideLabel}
      >
        {label}
      </Label>
      <input
        autoComplete="off"
        {...inputProps}
        {...props}
        id={name.toString()}
      />
    </div>
  );
}
