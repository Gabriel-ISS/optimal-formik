export class FormNotFoundError extends Error {
  constructor(formID: string) {
    super(`Can't find form with id "${formID}"`)
  }
}