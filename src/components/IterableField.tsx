import { Label } from "@/components/Label";
import { PathContext } from "@/context";
import { StringRecord, InputCommon, UpdateState, SecureOmit } from "@/helpers.types";
import { Path } from "@/helpers/path";
import { _getValue, _setValue } from "@/helpers/valueFromPath";
import { useForm } from "@/hooks";
import { FormBasicData, Errors, Updater } from "@/store";
import { HTMLAttributes, ReactNode } from "react";
import { ValidationError } from "yup";

type Helpers<
  A extends unknown[] | StringRecord,
  E = A extends unknown[] ? A[number] : A[keyof A]
> = {
  /** Push new item to array */
  push(value: E): void;
  /** Insert new item to object */
  insert(key: string, value: E): void;
  /** Remove item from array or object */
  remove(path: Path<A>): void;
  /** Modify object or array */
  modify(updater: Updater<A>): void;
  /** Set value of object or array */
  setValue(value: A): void;
};

type ArrayProps<A extends unknown[] | StringRecord> = InputCommon &
  SecureOmit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    children(helpers: Helpers<A>): ReactNode;
  };

/** Use for array of objects */
export function IterableField<A extends unknown[] | StringRecord>({
  name,
  label,
  hideLabel,
  containerClass,
  labelClass,
  errorClass,
  children,
}: ArrayProps<A>) {
  const updateForm = useForm((s) => s.updateForm);
  const validator = useForm((s) => s.config.validator);

  const path = name.toString();

  const _validate = (form: FormBasicData<unknown>) => {
    try {
      validator?.validateAt(path, form.data);
      delete form.errors[path];
    } catch (error) {
      const { message, path: _path } = error as ValidationError;
      if (path == _path) {
        form.touched[path] = true;
        form.errors[path] = message;
      }
    }
  };

  const updateObjectField: UpdateState<A> = (updater) => {
    updateForm((form) => {
      updater(_getValue<A>(form.data, path));
      _validate(form);
    });
  };

  const helpers: Helpers<A> = {
    push(value) {
      updateObjectField((object) => {
        if (!Array.isArray(object))
          throw new Error("Use insert in object fields");
        object.push(value);
      });
    },
    insert(key, value) {
      updateObjectField((object) => {
        if (Array.isArray(object))
          throw new Error("Do not use insert for Array object");
        (object as StringRecord)[key] = value as any;
      });
    },
    remove(path) {
      const pathStr = path.toString();
      const pathArray = pathStr.split(".");

      const key = pathArray.at(-1);
      const errorMessage = `"${pathStr}" is not a valid name, please use the name from IterableRenderer`;

      const removeItem = (object: unknown) => {
        if (Array.isArray(object)) {
          const index = Number(key);
          if (Number.isNaN(index)) throw new Error(errorMessage);
          object.splice(index, 1);
        } else {
          if (!key) throw new Error(errorMessage);
          delete (object as StringRecord)[key];
        }
      };

      const removeItemErrors = (errors: Errors) => {
        Object.keys(errors).forEach((errorPath) => {
          if (!errorPath.startsWith(pathStr)) return;

          delete errors[errorPath];
        });
      };

      updateForm((form) => {
        const pathToObject = pathArray.slice(0, -1).join(".");
        removeItem(_getValue<A>(form.data, pathToObject));
        removeItemErrors(form.errors);
        _validate(form);
      });
    },
    modify(updater) {
      updateObjectField((object) => {
        updater(object);
      });
    },
    setValue(value) {
      updateForm((form) => {
        _setValue(form.data, path, value);
        _validate(form);
      });
    },
  };

  return (
    <div className={containerClass}>
      <Label className={labelClass} errorClass={errorClass} name={name} hideLabel={hideLabel}>
        {label}
      </Label>
      <PathContext.Provider value={name}>
        {children(helpers)}
      </PathContext.Provider>
    </div>
  );
}
