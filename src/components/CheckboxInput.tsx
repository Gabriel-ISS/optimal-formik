import { ErrorMessage } from '@/components/ErrorMessage';
import { InputProps } from '@/components/Input';
import { SecureOmit } from '@/helpers.types';
import { useField } from '@/hooks';

/** Individual checkbox input */
export function CheckboxInput({
  name,
  label,
  containerClass,
  labelClass,
  errorClass,
  ...props
}: SecureOmit<InputProps, "hideLabel" | "type">) {
  const [inputProps] = useField<boolean>(name, "boolean");
  const path = name.toString();

  return (
    <div className={containerClass}>
      <ErrorMessage className={errorClass} name={name} />
      <label className={labelClass} htmlFor={path}>
        <input
          {...inputProps}
          {...props}
          id={path}
          type="checkbox"
          checked={inputProps.value}
        />{" "}
        {label}
      </label>
    </div>
  );
}