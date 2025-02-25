import { Label } from '@/components/Label';
import { InputCommon, SecureOmit } from '@/helpers.types';
import { useField } from '@/hooks';
import { HTMLProps } from 'react';

type SelectInputProps = InputCommon &
  SecureOmit<HTMLProps<HTMLSelectElement>, "name">;
export function Select({
  name,
  label,
  hideLabel,
  containerClass,
  labelClass,
  errorClass,
  ...props
}: SelectInputProps) {
  const [inputProps] = useField<any>(name);

  return (
    <div className={containerClass}>
      <Label className={labelClass} errorClass={errorClass} name={name} hideLabel={hideLabel}>
        {label}
      </Label>
      <select
        {...inputProps}
        {...props}
        id={name.toString()}
      />
    </div>
  );
}