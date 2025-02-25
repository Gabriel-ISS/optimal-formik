import { ValidationResult, Validator } from '@/validators/Validator';
import { AnyObject, ObjectSchema, ValidationError } from 'yup';


export class YupValidator<T extends AnyObject> extends Validator {
  constructor(protected schema: ObjectSchema<T>) {
    super(schema);
  }

  async validate(value: T): Promise<ValidationResult> {
    try {
      await this.schema.validate(value, { abortEarly: false });
      return { success: true };
    } catch (e) {
      if (!(e instanceof ValidationError)) throw e;
      return {
        success: false,
        errors: e.inner.map(err => ({
          path: err.path?.split('.'),
          message: err.message
        }))
      }
    }
  }

  validateAt(path: string, value: unknown): ValidationResult {
    try {
      this.schema.validateSyncAt(path, value);
      return { success: true };
    } catch (e) {
      if (!(e instanceof ValidationError)) throw e;

      return {
        success: false,
        errors: e.inner.map(err => ({
          path: err.path?.split('.'),
          message: err.message
        }))
      }
    }
  }
}