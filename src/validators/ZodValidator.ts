import { AnyObject } from "@/helpers.types";
import { _getValue } from "@/helpers/valueFromPath";
import { ValidationResult, Validator } from "@/validators/Validator";
import { z } from "zod";

export class ZodValidator<T extends AnyObject> extends Validator {
  constructor(protected schema: z.ZodObject<T>) {
    super(schema);
  }

  async validate(value: T): Promise<ValidationResult> {
    try {
      await this.schema.parseAsync(value);
      return { success: true };
    } catch (e) {
      if (!(e instanceof z.ZodError)) throw e;
      return {
        success: false,
        errors: e.errors.map((err) => ({
          path: err.path,
          message: err.message,
        })),
      };
    }
  }

  validateAt(path: string, value: AnyObject): ValidationResult {
    type ValidSchema =
      | z.AnyZodObject
      | z.ZodEffects<z.AnyZodObject>
      | z.ZodOptional<z.AnyZodObject>
      | z.ZodEffects<z.ZodOptional<z.AnyZodObject>>;

    const getShape = (
      schema: z.ZodTypeAny
    ): z.ZodRawShape | z.ZodRawShape[] | null => {
      if (schema instanceof z.ZodObject) {
        return schema._def.shape();
      } else if (schema instanceof z.ZodEffects) {
        return getShape(schema._def.schema);
      } else if (schema instanceof z.ZodOptional) {
        return getShape(schema._def.innerType);
      } else if (schema instanceof z.ZodArray) {
        return getShape(schema._def.type);
      } else if (schema instanceof z.ZodUnion) {
        return schema._def.options.map(getShape).filter((s: unknown) => s !== null);
      } else {
        return null;
      }
    };

    const getSchemaFromPath = (
      path: string[],
      schema: ValidSchema
    ): z.ZodTypeAny => {
      if (!path.length) return schema;

      const shape = getShape(schema);

      if (!shape || Array.isArray(shape)) {
        console.log("Invalid schema:", schema);
        throw new Error("Invalid schema");
      }

      let key = path.shift() as string;

      const isANumber = (str: string) => /^\d+$/.test(str)

      if (isANumber(key)) {
        key = path.shift() as string;
      }

      if (!shape[key]) throw new Error("Invalid path");

      const currentSchema = shape[key];

      return getSchemaFromPath(path, currentSchema as ValidSchema);
    };

    const fieldSchema = getSchemaFromPath(path.split("."), this.schema);
    const fieldValue = _getValue(value, path);
    const result = fieldSchema.safeParse(fieldValue);

    if (result.success) {
      return { success: true };
    } else {
      return {
        success: false,
        errors: result.error.errors.map((err) => ({
          path: err.path,
          message: err.message,
        })),
      };
    }
  }
}
