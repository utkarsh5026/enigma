import * as objects from "../objects";
import { BuiltinObject, BuiltinFunction } from "../objects/builtin";

/**
 * Built-in function: len()
 * Returns the length of arrays, strings, or hash objects.
 *
 * Usage examples:
 * - len([1, 2, 3]) → 3
 * - len("hello") → 5
 * - len({"a": 1, "b": 2}) → 2
 */
const lenFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arg = args[0];

  if (arg instanceof objects.ArrayObject) {
    return new objects.IntegerObject(arg.elements.length);
  }

  if (arg instanceof objects.StringObject) {
    return new objects.IntegerObject(arg.value.length);
  }

  if (arg instanceof objects.HashObject) {
    return new objects.IntegerObject(arg.pairs.size);
  }

  return new objects.ErrorObject(
    `argument to 'len' not supported, got ${arg.type()}`
  );
};

/**
 * Built-in function: print()
 * Prints values to console and returns null.
 * Can accept multiple arguments.
 *
 * Usage examples:
 * - print("Hello, World!")
 * - print(42, "is the answer")
 * - print([1, 2, 3])
 */
const printFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  const values = args.map((arg) => arg.inspect()).join(" ");
  console.log(values);
  return new objects.NullObject();
};

/**
 * Built-in function: type()
 * Returns the type of an object as a string.
 *
 * Usage examples:
 * - type(42) → "INTEGER"
 * - type("hello") → "STRING"
 * - type([1, 2, 3]) → "ARRAY"
 */
const typeFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  return new objects.StringObject(args[0].type());
};

/**
 * Built-in function: first()
 * Returns the first element of an array.
 *
 * Usage examples:
 * - first([1, 2, 3]) → 1
 * - first([]) → null
 */
const firstFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arg = args[0];
  if (!(arg instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `argument to 'first' must be ARRAY, got ${arg.type()}`
    );
  }

  if (arg.elements.length > 0) {
    return arg.elements[0];
  }

  return new objects.NullObject();
};

/**
 * Built-in function: last()
 * Returns the last element of an array.
 *
 * Usage examples:
 * - last([1, 2, 3]) → 3
 * - last([]) → null
 */
const lastFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arg = args[0];
  if (!(arg instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `argument to 'last' must be ARRAY, got ${arg.type()}`
    );
  }

  const length = arg.elements.length;
  if (length > 0) {
    return arg.elements[length - 1];
  }

  return new objects.NullObject();
};

/**
 * Built-in function: rest()
 * Returns a new array with all elements except the first.
 *
 * Usage examples:
 * - rest([1, 2, 3]) → [2, 3]
 * - rest([1]) → []
 * - rest([]) → null
 */
const restFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arg = args[0];
  if (!(arg instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `argument to 'rest' must be ARRAY, got ${arg.type()}`
    );
  }

  const length = arg.elements.length;
  if (length > 0) {
    const newElements = arg.elements.slice(1);
    return new objects.ArrayObject(newElements);
  }

  return new objects.NullObject();
};

/**
 * Built-in function: push()
 * Returns a new array with the element added to the end.
 *
 * Usage examples:
 * - push([1, 2], 3) → [1, 2, 3]
 * - push([], 1) → [1]
 */
const pushFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 2) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2`
    );
  }

  const arr = args[0];
  const element = args[1];

  if (!(arr instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `argument to 'push' must be ARRAY, got ${arr.type()}`
    );
  }

  const newElements = [...arr.elements, element];
  return new objects.ArrayObject(newElements);
};

/**
 * Built-in function: str()
 * Converts any value to its string representation.
 *
 * Usage examples:
 * - str(42) → "42"
 * - str(true) → "true"
 * - str([1, 2, 3]) → "[1, 2, 3]"
 */
const strFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  return new objects.StringObject(args[0].inspect());
};

/**
 * Built-in function: int()
 * Converts a string or number to an integer.
 *
 * Usage examples:
 * - int("42") → 42
 * - int(3.14) → 3
 * - int("hello") → error
 */
const intFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arg = args[0];

  if (arg instanceof objects.IntegerObject) {
    return arg; // Already an integer
  }

  if (arg instanceof objects.StringObject) {
    const parsed = parseInt(arg.value, 10);
    if (isNaN(parsed)) {
      return new objects.ErrorObject(
        `cannot convert "${arg.value}" to integer`
      );
    }
    return new objects.IntegerObject(parsed);
  }

  return new objects.ErrorObject(
    `argument to 'int' not supported, got ${arg.type()}`
  );
};

/**
 * Map of all built-in functions.
 * This is used to populate the global environment.
 */
export const BUILTINS: Map<string, BuiltinObject> = new Map([
  ["len", new BuiltinObject("len", lenFunction)],
  ["print", new BuiltinObject("print", printFunction)],
  ["type", new BuiltinObject("type", typeFunction)],
  ["first", new BuiltinObject("first", firstFunction)],
  ["last", new BuiltinObject("last", lastFunction)],
  ["rest", new BuiltinObject("rest", restFunction)],
  ["push", new BuiltinObject("push", pushFunction)],
  ["str", new BuiltinObject("str", strFunction)],
  ["int", new BuiltinObject("int", intFunction)],
]);

/**
 * Helper function to check if an identifier is a built-in function.
 */
export function isBuiltin(name: string): boolean {
  return BUILTINS.has(name);
}

/**
 * Helper function to get a built-in function by name.
 */
export function getBuiltin(name: string): BuiltinObject | null {
  return BUILTINS.get(name) || null;
}
