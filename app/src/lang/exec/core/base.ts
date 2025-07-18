export enum ObjectType {
  INTEGER = "INTEGER",
  BOOLEAN = "BOOLEAN",
  FLOAT = "FLOAT",
  STRING = "STRING",
  NULL = "NULL",
  RETURN_VALUE = "RETURN_VALUE",
  ERROR = "ERROR",
  FUNCTION = "FUNCTION",
  ARRAY = "ARRAY",
  HASH = "HASH",
  BREAK = "BREAK",
  CONTINUE = "CONTINUE",
  CLASS = "CLASS",
  INSTANCE = "INSTANCE",
  BUILTIN = "BUILTIN",
}

/**
 * Represents an object in the Mutant programming language.
 */
export interface BaseObject {
  /** The type of the object. */
  type(): ObjectType;

  /**
   * Returns a string representation of the object.
   * @returns {string} A string representation of the object.
   */
  inspect(): string;

  /**
   * Returns true if the object is truthy.
   * @returns {boolean} True if the object is truthy.
   */
  isTruthy(): boolean;
}
