import { SecureOmit } from '@/helpers.types';
import { submitForm } from "@/helpers/submitForm";
import { useForm } from "@/hooks";
import { HTMLProps, MouseEventHandler } from "react";

export function SubmitButton(props: SecureOmit<HTMLProps<HTMLButtonElement>, 'type'>) {
  const { formID, isValidating, isSubmitting } = useForm((s) => ({
    formID: s.config.formID,
    isValidating: s.isValidating,
    isSubmitting: s.isSubmitting,
  }));

  const submit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    await submitForm(e, formID);
    if (props.onClick) await props.onClick(e);
  }

  return (
    <button
      type="submit"
      disabled={isSubmitting || isValidating}

      {...props}
      
      onClick={submit}
    />
  );
}
