import { ValidationResult, Validator } from '@/validators/Validator';
import { AnyObject, ObjectSchema, ValidationError } from 'yup';


export class YupValidator<T extends AnyObject> extends Validator {
  constructor(protected schema: Pick<ObjectSchema<T>, 'validate' | 'validateSyncAt'>) {
    super(schema);
  }

  async validate(value: T): Promise<ValidationResult> {
    try {
      await this.schema.validate(value, { abortEarly: false });
      return { success: true };
    } catch (e) {
      if (Object.getPrototypeOf(e) === Error.prototype) throw e;
      return {
        success: false,
        errors: (e as ValidationError).inner.map(err => ({
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
      if (Object.getPrototypeOf(e) === Error.prototype) throw e;

      const err = e as ValidationError

      if (err.inner.length == 0) {
        return {
          success: false,
          errors: [{
            path: err.path?.split('.'),
            message: err.message
          }]
        }
      }

      return {
        success: false,
        errors: err.inner.map(err => ({
          path: err.path?.split('.'),
          message: err.message
        }))
      }
    }
  }
}