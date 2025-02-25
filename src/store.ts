import { AnyObject, SecureOmit } from "@/helpers.types";
import { FormNotFoundError } from "@/helpers/errors";
import { Validator } from "@/validators/Validator";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type Updater<S> = (draft: S) => void;

export type Touched = Record<string, boolean | undefined>;
export type Errors = Record<string, string | undefined>;

export type FormConfig<T extends AnyObject = AnyObject> = {
  formID: string;
  initialValues: T;
  onSubmit(values: T): void;
  validator?: Validator;
  preventSubmitOnEnter?: boolean;
};

export type FormBasicData<T> = {
  data: T;
  touched: Touched;
  errors: Errors;
  isValidating?: boolean;
  isSubmitting?: boolean;
};

export type Form<T extends AnyObject = AnyObject> = FormBasicData<T> & {
  config: FormConfig<T>;
  updateForm(updater: Updater<FormBasicData<T>>): void;
};

type State = {
  forms: { [formID: string]: Form | undefined };
};

type Actions = {
  createForm<T extends AnyObject>(
    config: SecureOmit<FormConfig<T>, "validator">
  ): void;
  removeForm(formID: string): void;
};

type Set = (updater: Updater<State & Actions>) => void;
// type Get = () => State & Actions;

/** ⚠️ Can't return computed values without re-render error */
export const useOptimalFormik = create<State & Actions>()(
  devtools(
    immer((set: Set, /* get: Get */) => ({
      forms: {},
      createForm(config) {
        const formID = config.formID;

        set((s) => {
          s.forms[formID] = {
            data: config.initialValues,
            errors: {},
            touched: {},
            config: config,
            updateForm(updater: Updater<FormBasicData<AnyObject>>) {
              set((s) => {
                const form = s.forms[formID];
                if (!form) throw new FormNotFoundError(formID);
                updater(form);
              });
            },
          };
        });
      },
      removeForm(formID) {
        set((s) => {
          delete s.forms[formID];
        });
      },
    }))
  )
);
