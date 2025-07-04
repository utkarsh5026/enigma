import { BaseObject, ObjectType } from "./base";

/**
 * Represents an error object in the Mutant programming language.
 */
export class ErrorObject implements BaseObject {
  /** The error message. */
  message: string;

  /**
   * Creates a new ErrorObject.
   * @param {string} message - The error message.
   */
  constructor(message: string) {
    this.message = message;
  }

  inspect(): string {
    return `ERROR: ${this.message}`;
  }

  type(): ObjectType {
    return ObjectType.ERROR;
  }
}
