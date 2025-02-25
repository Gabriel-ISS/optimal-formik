import { Label } from '@/components/Label';
import { InputCommon, SecureOmit } from '@/helpers.types';
import { useField } from '@/hooks';
import { HTMLProps } from 'react';

type TextAreaProps = InputCommon &
  SecureOmit<HTMLProps<HTMLTextAreaElement>, "name">;

export function TextArea({
  name,
  label,
  hideLabel,
  containerClass,
  labelClass,
  errorClass,
  ...props
}: TextAreaProps) {
  const [inputProps] = useField<any>(name);

  return (
    <div className={containerClass}>
      <Label className={labelClass} errorClass={errorClass} name={name} hideLabel={hideLabel}>
        {label}
      </Label>
      <textarea
        {...inputProps}
        {...props}
        id={name.toString()}
      />
    </div>
  );
}