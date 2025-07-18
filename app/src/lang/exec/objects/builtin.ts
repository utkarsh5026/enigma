// app/src/lang/exec/objects/builtin.ts
import { BaseObject, ObjectType } from "../core/base";

/**
 * Represents a built-in function in the programming language.
 * Built-in functions are implemented in TypeScript and provide
 * core functionality like len(), print(), etc.
 */
export class BuiltinObject implements BaseObject {
  /** The native function implementation */
  fn: BuiltinFunction;
  /** The name of the built-in function */
  name: string;

  /**
   * Creates a new BuiltinObject.
   * @param name - The name of the built-in function
   * @param fn - The native function implementation
   */
  constructor(name: string, fn: BuiltinFunction) {
    this.name = name;
    this.fn = fn;
  }

  inspect(): string {
    return `<built-in function ${this.name}>`;
  }

  type(): ObjectType {
    return ObjectType.BUILTIN;
  }

  isTruthy(): boolean {
    return true;
  }
}

/**
 * Type definition for built-in function implementations.
 * Takes an array of arguments and returns a result object.
 */
export type BuiltinFunction = (args: BaseObject[]) => BaseObject;
