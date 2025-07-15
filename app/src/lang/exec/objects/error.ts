import { BaseObject, ObjectType } from "./base";
import type { Position } from "@/lang/token/token";

/**
 * Represents an error object in the Mutant programming language.
 */
export class ErrorObject implements BaseObject {
  /** The error message. */
  message: string;

  /** The position of the error. */
  position?: Position;

  /**
   * Creates a new ErrorObject.
   * @param {string} message - The error message.
   */
  constructor(message: string, position?: Position) {
    this.message = message;
    this.position = position;
  }

  inspect(): string {
    const positionString = this.position
      ? ` at line ${this.position.line}, column ${this.position.column}`
      : "";
    return `ERROR: ${this.message}${positionString}`;
  }

  type(): ObjectType {
    return ObjectType.ERROR;
  }

  isTruthy(): boolean {
    return false;
  }
}
