import "./App.css";
import {
  OptimalFormik,
  Input,
  IterableField,
  IterableRenderer,
} from "@/main.ts";
import { ZodValidator } from '@/validators/ZodValidator';
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

const formValidator = new ZodValidator(validationSchema)

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
        validator={formValidator}
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
              <button onClick={() => setValue(initialValues.friends)}>Reset</button>
            </>
          )}
        </IterableField>
      </OptimalFormik>
    </>
  );
}

export default App;
