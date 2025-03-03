import { OptimalFormikContext } from "@/context";
import { Path } from "@/helpers/path";
import { _getValue, _setValue } from "@/helpers/valueFromPath";
import { Errors, Form, FormBasicData, useOptimalFormik } from "@/store";
import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEventHandler,
  useContext,
} from "react";
import { AnyObject } from "yup";
import { useShallow } from "zustand/shallow";

/**
 * Retrieves the current form ID from the OptimalFormik context.
 * This ID is defined in the parent OptimalFormik and is used to identify the form.
 * @returns The form ID from the context.
 */
export function useFormID() {
  const formID = useContext(OptimalFormikContext);

  if (!formID) throw new Error("OptimalFormik Context not found");

  return formID;
}

type Getter<T, R> = (data: T) => R;
/**
 * @param getter function that receives the form and returns the desired value
 * @returns the same value returned by the getter function
 */
export function useForm<T extends AnyObject = AnyObject, R = unknown>(
  getter: Getter<Form<T>, R>
) {
  const formID = useFormID();
  return useOptimalFormik(
    useShallow((s) => getter(s.forms[formID] as Form<T>))
  );
}

export enum FieldDataType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
}

export type FieldDataTypeU = "string" | "number" | "boolean";

/**
 * Used to obtain data and functions related to a specified field
 * @param path path to the field, can use a simple string, but if it is an embedded value, you must use the Path class
 * @param type field type. By default string. You can import FieldDataType and use here as a good practice
 * @returns [fieldProps, meta, helpers] where fieldProps is an object with the HTML element properties, meta contains data related to the field (data, error, touched, initialValue), and helpers is an object with functions to manipulate the field (setValue, setError, setTouched, validate).
 */
export function useField<T>(
  path: Path<AnyObject> | string,
  type: FieldDataTypeU = FieldDataType.STRING
) {
  const pathStr = path.toString();

  const metaData = useForm((s) => _getValue<T>(s.data, pathStr));
  const metaError = useForm((s) => s.errors[pathStr]);
  const metaTouched = useForm((s) => s.touched[pathStr]);
  const metaInitialValue = useForm((s) =>
    _getValue<T | null>(s.config.initialValues, pathStr, true)
  );
  const validator = useForm((s) => s.config.validator);
  const updateForm = useForm((s) => s.updateForm);

  const meta = {
    data: metaData,
    error: metaError,
    touched: metaTouched,
    initialValue: metaInitialValue,
  };

  const _validate = (form: FormBasicData<unknown>) => {
    if (!validator) return;
    const result = validator.validateAt(pathStr, form.data);

    if (result.success) {
      form.errors[pathStr] = undefined;
    } else {
      form.errors[pathStr] = result.errors[0].message;
    }
  };

  const _setTouched = (form: FormBasicData<unknown>, touched: boolean) => {
    form.touched[pathStr] = touched;
  };

  const setValue = (value: T) => {
    updateForm((form) => {
      _setValue(form.data, pathStr, value);
      _setTouched(form, true);
      _validate(form);
    });
  };

  const setError = (error: string | undefined) => {
    updateForm((form) => {
      form.errors[pathStr] = error;
    });
  };

  const setTouched = (touched: boolean) => {
    updateForm((form) => {
      _setTouched(form, touched);
    });
  };

  const validate = () => {
    updateForm(_validate);
  };

  const helpers = { setValue, setError, setTouched, validate };

  const onChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    let value: unknown = e.target.value;
    if (type == "number") value = Number(value);
    if (type == "boolean")
      value = (e as ChangeEvent<HTMLInputElement>).target.checked;
    setValue(value as T);
  };

  const onBlur: FocusEventHandler = () => {
    updateForm((form) => {
      _validate(form);
      _setTouched(form, true);
    });
  };

  type Value = T extends boolean ? undefined : T;
  type Checked = T extends boolean ? boolean : undefined;

  const fieldProps = {
    value: (type != "boolean" ? meta.data : undefined) as Value,
    checked: (type == "boolean" ? meta.data : undefined) as Checked,
    onChange,
    onBlur,
  };

  return [fieldProps, meta, helpers] as const;
}

/**
 * Useful to make custom component for error message
 * @param path path to the field, can use a simple string, but if it is an embedded value, you must use the Path class
 * @returns \{ error, touched \} where error is the error message and touched is a boolean indicating if the field has been touched
 */
export function useFieldErrorData(path: Path<AnyObject> | string) {
  const pathStr = path.toString();
  const error = useForm((s) => s.errors[pathStr]);
  const touched = useForm((s) => s.touched[pathStr]);
  return { error, touched };
}

/**
 * Check if there is an error in an embedded field of the indicated path
 * @param path path to the field, can use a simple string, but if it is an embedded value, you must use the Path class
 * @returns boolean indicating if there is an error in the field
 */
export function useEmbedErrorsCheck(path: Path<AnyObject> | string) {
  const pathStr = path.toString();

  const checkIfHiddenError = (errors: Errors) => {
    return Object.keys(errors).some(
      (currentPath) => currentPath.startsWith(pathStr) && errors[currentPath]
    );
  };

  return useForm((s) => checkIfHiddenError(s.errors || {}));
}
