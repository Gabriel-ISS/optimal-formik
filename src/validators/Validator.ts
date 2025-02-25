export type ValidationResult = {
  success: true;
} | {
  success: false;
  errors: {
    path?: (string | number)[];
    message: string;
  }[];
}

export abstract class Validator {
  constructor(protected schema: any) {}

  abstract validate(value: unknown): Promise<ValidationResult>;

  abstract validateAt(path: string, value: unknown): ValidationResult;
}