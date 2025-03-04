import { FormNotFoundError } from "@/helpers/errors";
import { Validator } from "@/main";
import { useOptimalFormik } from "@/store";
import { FormEvent } from "react";

function getValidPath(path: (string | number)[]) {
  return path.join(".");
  //return path.replace(/\[(\d+)\]/g, (_, index) => `.${index}`);
}

export async function submitForm(e: FormEvent, formID: string) {
  e.preventDefault();
  const state = useOptimalFormik.getState();
  const form = state.forms[formID];
  if (!form) throw new FormNotFoundError(formID);
  const updateForm = form.updateForm;

  const { validator, onSubmit: submit } = form.config;

  /** valida y actualiza los errores
   * @returns true si no hay errores
   */
  const validate = async (validator: Validator) => {
    const validationResult = await validator.validate(form.data);

    if (!validationResult.success) {
      updateForm((form) => {
        validationResult.errors.forEach(({ path, message }) => {
          if (!path) return;

          const validPath = getValidPath(path);
          if (!(validPath in form.errors)) {
            form.errors[validPath] = message;
            form.touched[validPath] = true;
          }
        });
      });
    }

    return validationResult.success;
  };

  if (validator) {
    updateForm((s) => {
      s.isValidating = true;
    });

    const success = await validate(validator);
    if (!success) {
      updateForm((s) => {
        s.isValidating = false;
      });
      return;
    };
  }

  updateForm((s) => {
    s.isValidating = false;
    s.isSubmitting = true;
  });

  await submit(form.data);

  updateForm((s) => {
    s.isSubmitting = false;
  });
}
