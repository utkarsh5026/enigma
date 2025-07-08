// COMPREHENSIVE BUILT-IN FUNCTIONS LIBRARY
// =========================================
// Complete implementation of essential built-in functions for a programming language

import * as objects from "../objects";
import { BuiltinObject, BuiltinFunction } from "../objects/builtin";

// ============================================================================
// 1. CORE DATA OPERATIONS
// ============================================================================

/**
 * len(obj) - Returns the length of arrays, strings, or hash objects
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
 * type(obj) - Returns the type of an object as a string
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
 * str(obj) - Converts any value to its string representation
 */
const strFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arg = args[0];

  // Handle special cases for better string conversion
  if (arg instanceof objects.NullObject) {
    return new objects.StringObject("null");
  }

  if (arg instanceof objects.BooleanObject) {
    return new objects.StringObject(arg.value ? "true" : "false");
  }

  return new objects.StringObject(arg.inspect());
};

/**
 * int(str) - Converts a string or number to an integer
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
 * bool(obj) - Converts any value to boolean
 */
const boolFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arg = args[0];

  // Use the existing truthy function logic
  const isTruthy = (() => {
    if (arg instanceof objects.BooleanObject) return arg.value;
    if (arg instanceof objects.NullObject) return false;
    if (arg instanceof objects.IntegerObject) return arg.value !== 0;
    if (arg instanceof objects.StringObject) return arg.value.length > 0;
    if (arg instanceof objects.ArrayObject) return arg.elements.length > 0;
    if (arg instanceof objects.HashObject) return arg.pairs.size > 0;
    return true;
  })();

  return new objects.BooleanObject(isTruthy);
};

// ============================================================================
// 2. ARRAY OPERATIONS
// ============================================================================

/**
 * first(array) - Returns the first element of an array
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
 * last(array) - Returns the last element of an array
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
 * rest(array) - Returns a new array with all elements except the first
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
 * push(array, element) - Returns a new array with the element added to the end
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
 * pop(array) - Returns a new array with the last element removed
 */
const popFunction: BuiltinFunction = (
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
      `argument to 'pop' must be ARRAY, got ${arg.type()}`
    );
  }

  if (arg.elements.length === 0) {
    return new objects.ErrorObject("cannot pop from empty array");
  }

  const newElements = arg.elements.slice(0, -1);
  return new objects.ArrayObject(newElements);
};

/**
 * slice(array, start, end?) - Returns a portion of the array
 */
const sliceFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length < 2 || args.length > 3) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2 or 3`
    );
  }

  const arr = args[0];
  const startArg = args[1];
  const endArg = args.length === 3 ? args[2] : null;

  if (!(arr instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `first argument to 'slice' must be ARRAY, got ${arr.type()}`
    );
  }

  if (!(startArg instanceof objects.IntegerObject)) {
    return new objects.ErrorObject(
      `second argument to 'slice' must be INTEGER, got ${startArg.type()}`
    );
  }

  let start = startArg.value;
  let end = arr.elements.length;

  if (endArg) {
    if (!(endArg instanceof objects.IntegerObject)) {
      return new objects.ErrorObject(
        `third argument to 'slice' must be INTEGER, got ${endArg.type()}`
      );
    }
    end = endArg.value;
  }

  // Handle negative indices
  if (start < 0) start = Math.max(0, arr.elements.length + start);
  if (end < 0) end = Math.max(0, arr.elements.length + end);

  // Clamp to array bounds
  start = Math.max(0, Math.min(start, arr.elements.length));
  end = Math.max(start, Math.min(end, arr.elements.length));

  const newElements = arr.elements.slice(start, end);
  return new objects.ArrayObject(newElements);
};

/**
 * concat(array1, array2) - Concatenates two arrays
 */
const concatFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 2) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2`
    );
  }

  const arr1 = args[0];
  const arr2 = args[1];

  if (!(arr1 instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `first argument to 'concat' must be ARRAY, got ${arr1.type()}`
    );
  }

  if (!(arr2 instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `second argument to 'concat' must be ARRAY, got ${arr2.type()}`
    );
  }

  const newElements = [...arr1.elements, ...arr2.elements];
  return new objects.ArrayObject(newElements);
};

/**
 * reverse(array) - Returns a new array with elements in reverse order
 */
const reverseFunction: BuiltinFunction = (
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
      `argument to 'reverse' must be ARRAY, got ${arg.type()}`
    );
  }

  const newElements = [...arg.elements].reverse();
  return new objects.ArrayObject(newElements);
};

/**
 * join(array, separator?) - Joins array elements into a string
 */
const joinFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length < 1 || args.length > 2) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1 or 2`
    );
  }

  const arr = args[0];
  if (!(arr instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `first argument to 'join' must be ARRAY, got ${arr.type()}`
    );
  }

  let separator = ",";
  if (args.length === 2) {
    const sepArg = args[1];
    if (!(sepArg instanceof objects.StringObject)) {
      return new objects.ErrorObject(
        `second argument to 'join' must be STRING, got ${sepArg.type()}`
      );
    }
    separator = sepArg.value;
  }

  const stringElements = arr.elements.map((element) => element.inspect());
  return new objects.StringObject(stringElements.join(separator));
};

// ============================================================================
// 3. STRING OPERATIONS
// ============================================================================

/**
 * split(string, delimiter) - Splits a string by delimiter
 */
const splitFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 2) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2`
    );
  }

  const str = args[0];
  const delimiter = args[1];

  if (!(str instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `first argument to 'split' must be STRING, got ${str.type()}`
    );
  }

  if (!(delimiter instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `second argument to 'split' must be STRING, got ${delimiter.type()}`
    );
  }

  const parts = str.value.split(delimiter.value);
  const elements = parts.map((part) => new objects.StringObject(part));

  return new objects.ArrayObject(elements);
};

/**
 * replace(string, search, replace) - Replace occurrences in string
 */
const replaceFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 3) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=3`
    );
  }

  const str = args[0];
  const search = args[1];
  const replace = args[2];

  if (!(str instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `first argument to 'replace' must be STRING, got ${str.type()}`
    );
  }

  if (!(search instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `second argument to 'replace' must be STRING, got ${search.type()}`
    );
  }

  if (!(replace instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `third argument to 'replace' must be STRING, got ${replace.type()}`
    );
  }

  const result = str.value.replace(
    new RegExp(search.value, "g"),
    replace.value
  );
  return new objects.StringObject(result);
};

/**
 * trim(string) - Remove whitespace from both ends
 */
const trimFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const str = args[0];
  if (!(str instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `argument to 'trim' must be STRING, got ${str.type()}`
    );
  }

  return new objects.StringObject(str.value.trim());
};

/**
 * upper(string) - Convert to uppercase
 */
const upperFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const str = args[0];
  if (!(str instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `argument to 'upper' must be STRING, got ${str.type()}`
    );
  }

  return new objects.StringObject(str.value.toUpperCase());
};

/**
 * lower(string) - Convert to lowercase
 */
const lowerFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const str = args[0];
  if (!(str instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `argument to 'lower' must be STRING, got ${str.type()}`
    );
  }

  return new objects.StringObject(str.value.toLowerCase());
};

/**
 * substr(string, start, length?) - Extract substring
 */
const substrFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length < 2 || args.length > 3) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2 or 3`
    );
  }

  const str = args[0];
  const startArg = args[1];
  const lengthArg = args.length === 3 ? args[2] : null;

  if (!(str instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `first argument to 'substr' must be STRING, got ${str.type()}`
    );
  }

  if (!(startArg instanceof objects.IntegerObject)) {
    return new objects.ErrorObject(
      `second argument to 'substr' must be INTEGER, got ${startArg.type()}`
    );
  }

  let start = startArg.value;
  let length = str.value.length - start;

  if (lengthArg) {
    if (!(lengthArg instanceof objects.IntegerObject)) {
      return new objects.ErrorObject(
        `third argument to 'substr' must be INTEGER, got ${lengthArg.type()}`
      );
    }
    length = lengthArg.value;
  }

  if (start < 0) start = Math.max(0, str.value.length + start);
  start = Math.max(0, Math.min(start, str.value.length));

  const result = str.value.substr(start, length);
  return new objects.StringObject(result);
};

/**
 * indexOf(string, substring) - Find index of substring
 */
const indexOfFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 2) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2`
    );
  }

  const str = args[0];
  const substring = args[1];

  if (!(str instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `first argument to 'indexOf' must be STRING, got ${str.type()}`
    );
  }

  if (!(substring instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `second argument to 'indexOf' must be STRING, got ${substring.type()}`
    );
  }

  const index = str.value.indexOf(substring.value);
  return new objects.IntegerObject(index);
};

/**
 * contains(string, substring) - Check if string contains substring
 */
const containsFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 2) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2`
    );
  }

  const str = args[0];
  const substring = args[1];

  if (!(str instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `first argument to 'contains' must be STRING, got ${str.type()}`
    );
  }

  if (!(substring instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `second argument to 'contains' must be STRING, got ${substring.type()}`
    );
  }

  const contains = str.value.includes(substring.value);
  return new objects.BooleanObject(contains);
};

// ============================================================================
// 4. MATHEMATICAL OPERATIONS
// ============================================================================

/**
 * abs(number) - Absolute value
 */
const absFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arg = args[0];
  if (!(arg instanceof objects.IntegerObject)) {
    return new objects.ErrorObject(
      `argument to 'abs' must be INTEGER, got ${arg.type()}`
    );
  }

  return new objects.IntegerObject(Math.abs(arg.value));
};

/**
 * max(...numbers) - Maximum value
 */
const maxFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length === 0) {
    return new objects.ErrorObject("max() expected at least 1 argument, got 0");
  }

  let maxVal = Number.NEGATIVE_INFINITY;

  for (const arg of args) {
    if (!(arg instanceof objects.IntegerObject)) {
      return new objects.ErrorObject(
        `all arguments to 'max' must be INTEGER, got ${arg.type()}`
      );
    }

    if (arg.value > maxVal) {
      maxVal = arg.value;
    }
  }

  return new objects.IntegerObject(maxVal);
};

/**
 * min(...numbers) - Minimum value
 */
const minFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length === 0) {
    return new objects.ErrorObject("min() expected at least 1 argument, got 0");
  }

  let minVal = Number.POSITIVE_INFINITY;

  for (const arg of args) {
    if (!(arg instanceof objects.IntegerObject)) {
      return new objects.ErrorObject(
        `all arguments to 'min' must be INTEGER, got ${arg.type()}`
      );
    }

    if (arg.value < minVal) {
      minVal = arg.value;
    }
  }

  return new objects.IntegerObject(minVal);
};

/**
 * round(number) - Round to nearest integer
 */
const roundFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arg = args[0];
  if (!(arg instanceof objects.IntegerObject)) {
    return new objects.ErrorObject(
      `argument to 'round' must be INTEGER, got ${arg.type()}`
    );
  }

  return new objects.IntegerObject(Math.round(arg.value));
};

/**
 * floor(number) - Round down to integer
 */
const floorFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arg = args[0];
  if (!(arg instanceof objects.IntegerObject)) {
    return new objects.ErrorObject(
      `argument to 'floor' must be INTEGER, got ${arg.type()}`
    );
  }

  return new objects.IntegerObject(Math.floor(arg.value));
};

/**
 * ceil(number) - Round up to integer
 */
const ceilFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arg = args[0];
  if (!(arg instanceof objects.IntegerObject)) {
    return new objects.ErrorObject(
      `argument to 'ceil' must be INTEGER, got ${arg.type()}`
    );
  }

  return new objects.IntegerObject(Math.ceil(arg.value));
};

/**
 * pow(base, exponent) - Power function
 */
const powFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 2) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2`
    );
  }

  const base = args[0];
  const exponent = args[1];

  if (!(base instanceof objects.IntegerObject)) {
    return new objects.ErrorObject(
      `first argument to 'pow' must be INTEGER, got ${base.type()}`
    );
  }

  if (!(exponent instanceof objects.IntegerObject)) {
    return new objects.ErrorObject(
      `second argument to 'pow' must be INTEGER, got ${exponent.type()}`
    );
  }

  const result = Math.pow(base.value, exponent.value);
  return new objects.IntegerObject(Math.floor(result));
};

/**
 * sqrt(number) - Square root
 */
const sqrtFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arg = args[0];
  if (!(arg instanceof objects.IntegerObject)) {
    return new objects.ErrorObject(
      `argument to 'sqrt' must be INTEGER, got ${arg.type()}`
    );
  }

  if (arg.value < 0) {
    return new objects.ErrorObject(
      "cannot take square root of negative number"
    );
  }

  const result = Math.sqrt(arg.value);
  return new objects.IntegerObject(Math.floor(result));
};

/**
 * random(max?) - Random number
 */
const randomFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length > 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=0 or 1`
    );
  }

  if (args.length === 0) {
    // Return random float between 0 and 1 (as integer 0 or 1)
    return new objects.IntegerObject(Math.floor(Math.random() * 2));
  }

  const maxArg = args[0];
  if (!(maxArg instanceof objects.IntegerObject)) {
    return new objects.ErrorObject(
      `argument to 'random' must be INTEGER, got ${maxArg.type()}`
    );
  }

  if (maxArg.value <= 0) {
    return new objects.ErrorObject("argument to 'random' must be positive");
  }

  const randomValue = Math.floor(Math.random() * maxArg.value);
  return new objects.IntegerObject(randomValue);
};

// ============================================================================
// 5. I/O OPERATIONS
// ============================================================================

/**
 * print(...args) - Print values to console
 */
const printFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  const values = args.map((arg) => arg.inspect()).join(" ");
  console.log(values);
  return new objects.NullObject();
};

/**
 * println(...args) - Print values with newline
 */
const printlnFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  const values = args.map((arg) => arg.inspect()).join(" ");
  console.log(values + "\n");
  return new objects.NullObject();
};

// ============================================================================
// 6. UTILITY FUNCTIONS
// ============================================================================

/**
 * range(start, end?, step?) - Generate range of numbers
 */
const rangeFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length < 1 || args.length > 3) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1, 2, or 3`
    );
  }

  let start = 0;
  let end: number;
  let step = 1;

  if (args.length === 1) {
    // range(end)
    const endArg = args[0];
    if (!(endArg instanceof objects.IntegerObject)) {
      return new objects.ErrorObject(
        `argument to 'range' must be INTEGER, got ${endArg.type()}`
      );
    }
    end = endArg.value;
  } else {
    // range(start, end, step?)
    const startArg = args[0];
    const endArg = args[1];

    if (!(startArg instanceof objects.IntegerObject)) {
      return new objects.ErrorObject(
        `first argument to 'range' must be INTEGER, got ${startArg.type()}`
      );
    }

    if (!(endArg instanceof objects.IntegerObject)) {
      return new objects.ErrorObject(
        `second argument to 'range' must be INTEGER, got ${endArg.type()}`
      );
    }

    start = startArg.value;
    end = endArg.value;

    if (args.length === 3) {
      const stepArg = args[2];
      if (!(stepArg instanceof objects.IntegerObject)) {
        return new objects.ErrorObject(
          `third argument to 'range' must be INTEGER, got ${stepArg.type()}`
        );
      }
      step = stepArg.value;

      if (step === 0) {
        return new objects.ErrorObject("step cannot be zero");
      }
    }
  }

  const elements: objects.BaseObject[] = [];

  if (step > 0) {
    for (let i = start; i < end; i += step) {
      elements.push(new objects.IntegerObject(i));
    }
  } else {
    for (let i = start; i > end; i += step) {
      elements.push(new objects.IntegerObject(i));
    }
  }

  return new objects.ArrayObject(elements);
};

/**
 * keys(hash) - Get all keys from hash object
 */
const keysFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arg = args[0];
  if (!(arg instanceof objects.HashObject)) {
    return new objects.ErrorObject(
      `argument to 'keys' must be HASH, got ${arg.type()}`
    );
  }

  const keyElements = Array.from(arg.pairs.keys()).map(
    (key) => new objects.StringObject(key)
  );
  return new objects.ArrayObject(keyElements);
};

/**
 * values(hash) - Get all values from hash object
 */
const valuesFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arg = args[0];
  if (!(arg instanceof objects.HashObject)) {
    return new objects.ErrorObject(
      `argument to 'values' must be HASH, got ${arg.type()}`
    );
  }

  const valueElements = Array.from(arg.pairs.values());
  return new objects.ArrayObject(valueElements);
};

// ============================================================================
// 7. ERROR HANDLING
// ============================================================================

/**
 * error(message) - Create an error object
 */
const errorFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const message = args[0];
  if (!(message instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `argument to 'error' must be STRING, got ${message.type()}`
    );
  }

  return new objects.ErrorObject(message.value);
};

/**
 * assert(condition, message?) - Assert condition is true
 */
const assertFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length < 1 || args.length > 2) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1 or 2`
    );
  }

  const condition = args[0];

  // Check if condition is truthy
  const isTruthy = (() => {
    if (condition instanceof objects.BooleanObject) return condition.value;
    if (condition instanceof objects.NullObject) return false;
    if (condition instanceof objects.IntegerObject)
      return condition.value !== 0;
    if (condition instanceof objects.StringObject)
      return condition.value.length > 0;
    if (condition instanceof objects.ArrayObject)
      return condition.elements.length > 0;
    if (condition instanceof objects.HashObject)
      return condition.pairs.size > 0;
    return true;
  })();

  if (!isTruthy) {
    let message = "Assertion failed";
    if (args.length === 2) {
      const messageArg = args[1];
      if (messageArg instanceof objects.StringObject) {
        message = messageArg.value;
      }
    }
    return new objects.ErrorObject(message);
  }

  return new objects.NullObject();
};

// ============================================================================
// COMPLETE BUILTINS REGISTRY
// ============================================================================

export const BUILTINS: Map<string, BuiltinObject> = new Map([
  // Core data operations
  ["len", new BuiltinObject("len", lenFunction)],
  ["type", new BuiltinObject("type", typeFunction)],
  ["str", new BuiltinObject("str", strFunction)],
  ["int", new BuiltinObject("int", intFunction)],
  ["bool", new BuiltinObject("bool", boolFunction)],

  // Array operations
  ["first", new BuiltinObject("first", firstFunction)],
  ["last", new BuiltinObject("last", lastFunction)],
  ["rest", new BuiltinObject("rest", restFunction)],
  ["push", new BuiltinObject("push", pushFunction)],
  ["pop", new BuiltinObject("pop", popFunction)],
  ["slice", new BuiltinObject("slice", sliceFunction)],
  ["concat", new BuiltinObject("concat", concatFunction)],
  ["reverse", new BuiltinObject("reverse", reverseFunction)],
  ["join", new BuiltinObject("join", joinFunction)],

  // String operations
  ["split", new BuiltinObject("split", splitFunction)],
  ["replace", new BuiltinObject("replace", replaceFunction)],
  ["trim", new BuiltinObject("trim", trimFunction)],
  ["upper", new BuiltinObject("upper", upperFunction)],
  ["lower", new BuiltinObject("lower", lowerFunction)],
  ["substr", new BuiltinObject("substr", substrFunction)],
  ["indexOf", new BuiltinObject("indexOf", indexOfFunction)],
  ["contains", new BuiltinObject("contains", containsFunction)],

  // Mathematical operations
  ["abs", new BuiltinObject("abs", absFunction)],
  ["max", new BuiltinObject("max", maxFunction)],
  ["min", new BuiltinObject("min", minFunction)],
  ["round", new BuiltinObject("round", roundFunction)],
  ["floor", new BuiltinObject("floor", floorFunction)],
  ["ceil", new BuiltinObject("ceil", ceilFunction)],
  ["pow", new BuiltinObject("pow", powFunction)],
  ["sqrt", new BuiltinObject("sqrt", sqrtFunction)],
  ["random", new BuiltinObject("random", randomFunction)],

  // I/O operations
  ["print", new BuiltinObject("print", printFunction)],
  ["println", new BuiltinObject("println", printlnFunction)],

  // Utility functions
  ["range", new BuiltinObject("range", rangeFunction)],
  ["keys", new BuiltinObject("keys", keysFunction)],
  ["values", new BuiltinObject("values", valuesFunction)],

  // Error handling
  ["error", new BuiltinObject("error", errorFunction)],
  ["assert", new BuiltinObject("assert", assertFunction)],
]);

/**
 * Helper functions for built-in management
 */
export function isBuiltin(name: string): boolean {
  return BUILTINS.has(name);
}

export function getBuiltin(name: string): BuiltinObject | null {
  return BUILTINS.get(name) || null;
}

export function getAllBuiltinNames(): string[] {
  return Array.from(BUILTINS.keys()).sort();
}

export function getBuiltinsByCategory(): Record<string, string[]> {
  return {
    "Core Data": ["len", "type", "str", "int", "bool"],
    "Array Operations": [
      "first",
      "last",
      "rest",
      "push",
      "pop",
      "slice",
      "concat",
      "reverse",
      "join",
    ],
    "String Operations": [
      "split",
      "replace",
      "trim",
      "upper",
      "lower",
      "substr",
      "indexOf",
      "contains",
    ],
    "Math Operations": [
      "abs",
      "max",
      "min",
      "round",
      "floor",
      "ceil",
      "pow",
      "sqrt",
      "random",
    ],
    "I/O Operations": ["print", "println"],
    Utilities: ["range", "keys", "values"],
    "Error Handling": ["error", "assert"],
  };
}
