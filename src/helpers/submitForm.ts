import { FormNotFoundError } from '@/helpers/errors';
import { useOptimalFormik } from '@/store';
import { FormEvent } from "react";
import { ValidationError } from "yup";
import { ZodError } from "zod";

function getValidPath(path: string) {
  return path.replace(/\[(\d+)\]/g, (_, index) => `.${index}`);
}

export async function submitForm(e: FormEvent, formID: string) {
  e.preventDefault();
  const state = useOptimalFormik.getState();
  const form = state.forms[formID];
  if (!form) throw new Error("Form not found");
  const updateForm = form.updateForm;

  updateForm((s) => {
    s.isValidating = true;
  });

  const formConfig = form.config;
  try {
    if (formConfig.validator) {
      await formConfig.validator.validate(form.data);
    }

    updateForm((s) => {
      s.isValidating = false;
      s.isSubmitting = true;
    });

    await formConfig.onSubmit(form.data);

    try {
      updateForm((s) => {
        s.isSubmitting = false;
      });
    } catch (error) {
      if (!(error instanceof FormNotFoundError)) {
        throw error;
      }
    }
  } catch (error) {
    if (!(error instanceof ValidationError) || !(error instanceof ZodError)) {
      throw error;
    }

    updateForm((form) => {
      error.inner.forEach(({ path, message }) => {
        const validPath = getValidPath(path as string);
        if (!(validPath in form.errors)) {
          form.errors[validPath] = message;
          form.touched[validPath] = true;
        }
      });
    });

    updateForm((s) => {
      s.isValidating = false;
    });
  }
}
