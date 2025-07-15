import { BaseObject, ObjectType } from "./base";

/**
 * Represents an integer object in the Mutant programming language.
 */
export class IntegerObject implements BaseObject {
  /** The numeric value of the integer. */
  value: number;

  /**
   * Creates a new IntegerObject.
   * @param {number} value - The numeric value of the integer.
   */
  constructor(value: number) {
    this.value = value;
  }

  inspect(): string {
    return this.value.toString();
  }

  type(): ObjectType {
    return ObjectType.INTEGER;
  }

  isTruthy(): boolean {
    return this.value !== 0;
  }
}

/**
 * Represents a boolean object in the Mutant programming language.
 */
export class BooleanObject implements BaseObject {
  /** The boolean value. */
  value: boolean;

  /**
   * Creates a new BooleanObject.
   * @param {boolean} value - The boolean value.
   */
  constructor(value: boolean) {
    this.value = value;
  }

  inspect(): string {
    return this.value.toString();
  }

  type(): ObjectType {
    return ObjectType.BOOLEAN;
  }

  isTruthy(): boolean {
    return this.value;
  }
}

/**
 * Represents a null object in the Mutant programming language.
 */
export class NullObject implements BaseObject {
  static readonly INSTANCE = new NullObject();

  inspect(): string {
    return "null";
  }

  type(): ObjectType {
    return ObjectType.NULL;
  }

  isTruthy(): boolean {
    return false;
  }
}

/**
 * Represents a string object in the Mutant programming language.
 */
export class StringObject implements BaseObject {
  value: string;

  /**
   * Creates a new StringObject.
   * @param {string} value - The string value.
   */
  constructor(value: string) {
    this.value = value;
  }

  inspect(): string {
    return this.value;
  }

  type(): ObjectType {
    return ObjectType.STRING;
  }

  isTruthy(): boolean {
    return this.value.length > 0;
  }
}
