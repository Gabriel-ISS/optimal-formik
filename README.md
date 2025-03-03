# Optimal Formik

A formik alternative that optimizes for performance.

# Installation

```bash
npm install optimal-formik
```

# Usage

```tsx
import {
  OptimalFormik,
  Input,
  IterableField,
  IterableRenderer,
  ZodValidator,
} from "optimal-formik";
import { z } from "zod";

const validationSchema = z.object({
  name: z.string().min(3),
  age: z.number().min(18),
  friends: z.array(
    z.object({
      name: z.string().min(3),
      age: z.number().min(18).optional(),
    })
  ),
});

const formValidator = new ZodValidator(validationSchema);

type Data = z.infer<typeof validationSchema>;

const initialValues: Data = {
  name: "John",
  age: 30,
  friends: [
    {
      name: "Jane",
    },
    {
      name: "Bob",
    },
  ],
};

function App() {
  return (
    <>
      <OptimalFormik<Data>
        formID={"test"}
        initialValues={initialValues}
        zodValidationSchema={formValidator}
        onSubmit={(data) => {
          console.log(data);
        }}
      >
        <Input name="name" label="Name" />
        <Input type="number" name="age" label="Age" />
        <IterableField<Data["friends"]> name="friends" label="Friends">
          {({ push, remove, modify, setValue }) => (
            <>
              <IterableRenderer<Data["friends"]>>
                {(path, key) => (
                  <>
                    <Input name={path.concat("name")} label="Name" />
                    <Input
                      type="number"
                      name={path.concat("age")}
                      label="Age"
                    />
                    <button onClick={() => remove(path)}>Remove</button>
                  </>
                )}
              </IterableRenderer>
              <button
                onClick={() =>
                  push({
                    name: "",
                    age: undefined,
                  })
                }
              >
                Add Friend
              </button>
              <button onClick={() => setValue(initialValues.friends)}>
                Reset
              </button>
            </>
          )}
        </IterableField>
      </OptimalFormik>
    </>
  );
}

export default App;
```

# Components and helpers

### `<OptimalFormik> (form root)`

#### Props

| Prop                       | Type                                  | Description                                                                                         |
| -------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `formID (required)`        | `string`                              | Unique ID of the form.                                                                              |
| `initialValues (required)` | `Record<string, any>`                 | Initial values of the form.                                                                         |
| `onSubmit (required)`      | `(data: Record<string, any>) => void` | function that is executed when the submit button is pressed                                         |
| `validator`                | `Validator`                           | Can be `ZodValidator`, `YupValidator` or a custom child of [`Validator`](#validator-abstract-class) |
| `preventSubmitOnEnter`     | `boolean`                             | Prevent submit on Enter pressed                                                                     |
| `className`                | `string`                              | ...                                                                                                 |

## Primary components (with `Label` and `ErrorMessage`)

Every element with `Label` has these props available:

| Prop               | Type                          | Description                     |
| ------------------ | ----------------------------- | ------------------------------- |
| `name (required)`  | `string \| Path`              | Path to the field               |
| `label (required)` | `string \| React.JSX.Element` | Label of the field              |
| `hideLabel`        | `boolean`                     | Hides the fields label          |
| `containerClass`   | `string`                      | Class name of input's container |
| `labelClass`       | `string`                      | Class name of input's label     |
| `errorClass`       | `string`                      | Class name of `ErrorMessage`    |

### `<Input>`

#### Props

| Prop          | Type             | Description                                                                         |
| ------------- | ---------------- | ----------------------------------------------------------------------------------- |
| Common props  | ...              | See in the [start of this section](#primary-components-with-label-and-errormessage) |
| Element props | `HTMLInputProps` | ...                                                                                 |

### `<Select>`

#### Props

| Prop          | Type              | Description                                                                         |
| ------------- | ----------------- | ----------------------------------------------------------------------------------- |
| Common props  | ...               | See in the [start of this section](#primary-components-with-label-and-errormessage) |
| Element props | `HTMLSelectProps` | ...                                                                                 |

### `<TextArea>`

#### Props

| Prop          | Type                | Description                                                                         |
| ------------- | ------------------- | ----------------------------------------------------------------------------------- |
| Common props  | ...                 | See in the [start of this section](#primary-components-with-label-and-errormessage) |
| Element props | `HTMLTextAreaProps` | ...                                                                                 |

### `<CheckboxInput>`

#### Props

`hideLabel` is not available here

| Prop          | Type               | Description                                                                         |
| ------------- | ------------------ | ----------------------------------------------------------------------------------- |
| Common props  | ...                | See in the [start of this section](#primary-components-with-label-and-errormessage) |
| Element props | `HTMLInputElement` | ...                                                                                 |

### `<IterableField>`

#### Props

| Prop                  | Type                                     | Description                                                                                      |
| --------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Common props          | ...                                      | See in the [start of this section](#primary-components-with-label-and-errormessage)              |
| `children (required)` | `(...helpers: ...) => React.JSX.Element` | The children is a function providing useful functions `helpers` to manipulate array and objects. |
| Element props         | `HTMLDivProps`                           | ...                                                                                              |

##### Children Helpers

Where `E` is an element of `A`, `A` is the iterable itself, and `Path` is a class for strict path management.

`Updater<A>` is a callback like this `(value: A) => void`. This provides flexibility, but if you need to overwrite the hole object you need to use `setValue`.

```tsx
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
```

## Primary components

### `<IterableRenderer>`

This component don't have `Label` and `ErrorMessage` but alway is a child of `IterableField`. This component works like `Array.map`.

#### Props

| Prop                  | Type                                                          | Description                                                                                                                                         |
| --------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `as (default: div)`   | `keyof React.JSX.IntrinsicElements`                           | Tag name of this component                                                                                                                          |
| `className`           | `string`                                                      | Class of this component                                                                                                                             |
| `children (required)` | `(path: Path<E>, key: string \| number) => React.JSX.Element` | The children is a function providing the `path` of the array or object and the `key`. The `key` can be the index of the array or key of the object. |

### `<SubmitButton>`

Use this component to fire `onSubmit` form callback.

Props: `HTMLButtonElementProps`

## Complementary components

Useful to make your own OptimalFormik components

### `<Label>`

Label with `ErrorMessage`

#### Props

| Prop                  | Type                          | Description            |
| --------------------- | ----------------------------- | ---------------------- |
| `name (required)`     | `string \| Path`              | Path to the field      |
| `children (required)` | `string \| React.JSX.Element` | Label of the field     |
| `hideLabel`           | `boolean`                     | Hides the fields label |
| `...`                 | `HTMLLabelProps`              | ...                    |

### `<ErrorMessage>`

Show an error if exist

#### Props

| Prop              | Type             | Description       |
| ----------------- | ---------------- | ----------------- |
| `name (required)` | `string \| Path` | Path to the field |
| Element props     | `HTMLDivProps`   | ...               |

### `<RedDot>`

Returns null if no errors were detected embed in the field, else returns the div element.
Useful to show if there are errors in hidden sub-fields.

#### Props

| Prop              | Type             | Description       |
| ----------------- | ---------------- | ----------------- |
| `name (required)` | `string \| Path` | Path to the field |
| Element props     | `HTMLDivProps`   | ...               |

## Helpers

### Path

```ts
class Path {
  constructor(key: string | number, path = "") {}

  concat(key: string | number): Path;

  toString(): string;
}
```

### Validator (abstract class)

Useful if you don't use `yup` or `zod` as validation schema.

Obs: In both cases `value` will be the form current data

```ts
type ValidationResult =
  | {
      success: true;
    }
  | {
      success: false;
      errors: {
        path?: (string | number)[];
        message: string;
      }[];
    };

abstract class Validator {
  constructor(protected schema: any) {}

  abstract validate(value: unknown): Promise<ValidationResult>;

  abstract validateAt(path: string, value: unknown): ValidationResult;
}
```

#### Use

```ts
class CustomValidator extends Validator {
  constructor(protected schema) {
    // ...
  }

  async validate(value: unknown) {
    // return the validation result
  }

  async validateAt(path: string, value: unknown) {
    // return the validation result
  }
}
```

### React Context

- If you want to get FormID without `useFormID` or `useForm`, you can use `OptimalFormikContext`.
- If you want to get the current path generated by IterableField you can use `PathContext`.

# Hooks

## useFormID

Retrieves the current form ID from the `OptimalFormikContext`.
This ID is defined in the parent OptimalFormik and is used to identify the form.

## useForm

```ts
type FormConfig<T extends AnyObject> = {
  formID: string;
  initialValues: T;
  onSubmit(values: T): void;
  validator?: Validator;
  preventSubmitOnEnter?: boolean;
};

type FormBasicData<T> = {
  data: T;
  touched: Record<string, boolean | undefined>;
  errors: Record<string, string | undefined>;
  isValidating?: boolean;
  isSubmitting?: boolean;
};

type Form<T extends AnyObject> = FormBasicData<T> & {
  config: FormConfig<T>;
  updateForm(updater: Updater<FormBasicData<T>>): void;
};
```

### Example

```ts
type MyForm = {
  title: string
  description: string
  counters: {
    counter1: number
    counter2: number
  }
}

const updateForm = useForm((s: Form<MyForm>) => s.updateForm)
const { data, error, touched } = useForm((s: Form<MyForm>) => ({
  data: s.data.counter1
  error: s.errors['counters.counter1']
  touched: s.touched['counters.counter1']
}))
```

## useField

Like `useField` from `Formik`.

```ts
// you can import this
enum FieldDataType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
}

type InputProps<T> = {
  value: T | undefined;
  checked: T | undefined;
  onChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  onBlur: FocusEventHandler;
};

type Meta<T> = {
  data: T;
  error: string | undefined;
  touched: boolean | undefined;
  initialValue: T | null;
};

type Helpers<T> = {
  setValue: (value: T) => void;
  setError: (error: string | undefined) => void;
  setTouched: (touched: boolean) => void;
  validate: () => void;
};

// T is the type of the data and F the type of the form
type useField<T, F> = (
  path: Path<F> | string,
  type?: FieldDataType
) => [InputProps<T>, Meta<T>, Helpers<T>];
```

## useFieldErrorData

```ts
type useFieldErrorData = (path: Path<AnyObject> | string) => {
  error?: string;
  touched?: boolean;
};
```

## useEmbedErrorsCheck

Returns true if some error is inside the selected path.

```ts
type useEmbedErrorsCheck = (path: Path<AnyObject> | string) => boolean;
```
