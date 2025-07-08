import * as objects from "../objects";
import { BuiltinObject, BuiltinFunction } from "../objects/builtin";

// ============================================================================
// 1. FUNCTIONAL PROGRAMMING OPERATIONS
// ============================================================================

/**
 * map(array, function) - Apply function to each element
 *
 * Usage: map([1, 2, 3], fn(x) { return x * 2; })
 * Result: [2, 4, 6]
 */
const mapFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 2) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2`
    );
  }

  const arr = args[0];
  const func = args[1];

  if (!(arr instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `first argument to 'map' must be ARRAY, got ${arr.type()}`
    );
  }

  if (!(func instanceof objects.FunctionObject)) {
    return new objects.ErrorObject(
      `second argument to 'map' must be FUNCTION, got ${func.type()}`
    );
  }

  // Note: This requires access to the evaluator to call the function
  // For now, we'll return an error indicating this needs evaluator integration
  return new objects.ErrorObject(
    "map() requires evaluator integration - implement in evaluator class"
  );
};

/**
 * filter(array, function) - Filter elements based on predicate
 *
 * Usage: filter([1, 2, 3, 4], fn(x) { return x % 2 == 0; })
 * Result: [2, 4]
 */
const filterFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 2) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2`
    );
  }

  const arr = args[0];
  const func = args[1];

  if (!(arr instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `first argument to 'filter' must be ARRAY, got ${arr.type()}`
    );
  }

  if (!(func instanceof objects.FunctionObject)) {
    return new objects.ErrorObject(
      `second argument to 'filter' must be FUNCTION, got ${func.type()}`
    );
  }

  return new objects.ErrorObject(
    "filter() requires evaluator integration - implement in evaluator class"
  );
};

/**
 * reduce(array, function, initial?) - Reduce array to single value
 *
 * Usage: reduce([1, 2, 3, 4], fn(acc, x) { return acc + x; }, 0)
 * Result: 10
 */
const reduceFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length < 2 || args.length > 3) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2 or 3`
    );
  }

  const arr = args[0];
  const func = args[1];

  if (!(arr instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `first argument to 'reduce' must be ARRAY, got ${arr.type()}`
    );
  }

  if (!(func instanceof objects.FunctionObject)) {
    return new objects.ErrorObject(
      `second argument to 'reduce' must be FUNCTION, got ${func.type()}`
    );
  }

  return new objects.ErrorObject(
    "reduce() requires evaluator integration - implement in evaluator class"
  );
};

/**
 * forEach(array, function) - Execute function for each element
 *
 * Usage: forEach([1, 2, 3], fn(x) { print(x); })
 * Side effect: prints each element
 */
const forEachFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 2) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2`
    );
  }

  const arr = args[0];
  const func = args[1];

  if (!(arr instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `first argument to 'forEach' must be ARRAY, got ${arr.type()}`
    );
  }

  if (!(func instanceof objects.FunctionObject)) {
    return new objects.ErrorObject(
      `second argument to 'forEach' must be FUNCTION, got ${func.type()}`
    );
  }

  return new objects.ErrorObject(
    "forEach() requires evaluator integration - implement in evaluator class"
  );
};

// ============================================================================
// 2. ADVANCED ARRAY OPERATIONS
// ============================================================================

/**
 * sort(array, compareFn?) - Sort array elements
 */
const sortFunction: BuiltinFunction = (
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
      `first argument to 'sort' must be ARRAY, got ${arr.type()}`
    );
  }

  // Simple numeric sort for integers
  const elements = [...arr.elements];

  if (args.length === 1) {
    // Default sort - only works for integers
    const allIntegers = elements.every(
      (el) => el instanceof objects.IntegerObject
    );
    if (!allIntegers) {
      return new objects.ErrorObject(
        "default sort only works with INTEGER arrays"
      );
    }

    elements.sort((a, b) => {
      const aVal = (a as objects.IntegerObject).value;
      const bVal = (b as objects.IntegerObject).value;
      return aVal - bVal;
    });
  } else {
    // Custom compare function - requires evaluator integration
    return new objects.ErrorObject(
      "custom sort requires evaluator integration"
    );
  }

  return new objects.ArrayObject(elements);
};

/**
 * unique(array) - Remove duplicate elements
 */
const uniqueFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arr = args[0];
  if (!(arr instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `argument to 'unique' must be ARRAY, got ${arr.type()}`
    );
  }

  const seen = new Set<string>();
  const uniqueElements: objects.BaseObject[] = [];

  for (const element of arr.elements) {
    const key = element.inspect();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueElements.push(element);
    }
  }

  return new objects.ArrayObject(uniqueElements);
};

/**
 * flatten(array, depth?) - Flatten nested arrays
 */
const flattenFunction: BuiltinFunction = (
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
      `first argument to 'flatten' must be ARRAY, got ${arr.type()}`
    );
  }

  let depth = 1;
  if (args.length === 2) {
    const depthArg = args[1];
    if (!(depthArg instanceof objects.IntegerObject)) {
      return new objects.ErrorObject(
        `second argument to 'flatten' must be INTEGER, got ${depthArg.type()}`
      );
    }
    depth = depthArg.value;
  }

  const flattenHelper = (
    elements: objects.BaseObject[],
    currentDepth: number
  ): objects.BaseObject[] => {
    const result: objects.BaseObject[] = [];

    for (const element of elements) {
      if (element instanceof objects.ArrayObject && currentDepth > 0) {
        result.push(...flattenHelper(element.elements, currentDepth - 1));
      } else {
        result.push(element);
      }
    }

    return result;
  };

  const flattened = flattenHelper(arr.elements, depth);
  return new objects.ArrayObject(flattened);
};

/**
 * zip(array1, array2) - Combine two arrays element-wise
 */
const zipFunction: BuiltinFunction = (
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
      `first argument to 'zip' must be ARRAY, got ${arr1.type()}`
    );
  }

  if (!(arr2 instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `second argument to 'zip' must be ARRAY, got ${arr2.type()}`
    );
  }

  const minLength = Math.min(arr1.elements.length, arr2.elements.length);
  const pairs: objects.BaseObject[] = [];

  for (let i = 0; i < minLength; i++) {
    const pair = new objects.ArrayObject([arr1.elements[i], arr2.elements[i]]);
    pairs.push(pair);
  }

  return new objects.ArrayObject(pairs);
};

/**
 * enumerate(array) - Add index to each element
 */
const enumerateFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const arr = args[0];
  if (!(arr instanceof objects.ArrayObject)) {
    return new objects.ErrorObject(
      `argument to 'enumerate' must be ARRAY, got ${arr.type()}`
    );
  }

  const indexed: objects.BaseObject[] = [];

  for (let i = 0; i < arr.elements.length; i++) {
    const pair = new objects.ArrayObject([
      new objects.IntegerObject(i),
      arr.elements[i],
    ]);
    indexed.push(pair);
  }

  return new objects.ArrayObject(indexed);
};

// ============================================================================
// 3. ADVANCED STRING OPERATIONS
// ============================================================================

/**
 * format(template, ...args) - String formatting
 */
const formatFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length === 0) {
    return new objects.ErrorObject("format() expects at least 1 argument");
  }

  const template = args[0];
  if (!(template instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `first argument to 'format' must be STRING, got ${template.type()}`
    );
  }

  let result = template.value;
  const formatArgs = args.slice(1);

  // Simple placeholder replacement: {} with positional arguments
  let argIndex = 0;
  result = result.replace(/\{\}/g, () => {
    if (argIndex < formatArgs.length) {
      return formatArgs[argIndex++].inspect();
    }
    return "{}";
  });

  // Named placeholders: {0}, {1}, etc.
  result = result.replace(/\{(\d+)\}/g, (match, index) => {
    const idx = parseInt(index, 10);
    if (idx >= 0 && idx < formatArgs.length) {
      return formatArgs[idx].inspect();
    }
    return match;
  });

  return new objects.StringObject(result);
};

/**
 * repeat(string, count) - Repeat string
 */
const repeatFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 2) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2`
    );
  }

  const str = args[0];
  const count = args[1];

  if (!(str instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `first argument to 'repeat' must be STRING, got ${str.type()}`
    );
  }

  if (!(count instanceof objects.IntegerObject)) {
    return new objects.ErrorObject(
      `second argument to 'repeat' must be INTEGER, got ${count.type()}`
    );
  }

  if (count.value < 0) {
    return new objects.ErrorObject("repeat count cannot be negative");
  }

  return new objects.StringObject(str.value.repeat(count.value));
};

/**
 * padLeft(string, length, char?) - Pad string on the left
 */
const padLeftFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length < 2 || args.length > 3) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2 or 3`
    );
  }

  const str = args[0];
  const length = args[1];
  const padChar = args.length === 3 ? args[2] : new objects.StringObject(" ");

  if (!(str instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `first argument to 'padLeft' must be STRING, got ${str.type()}`
    );
  }

  if (!(length instanceof objects.IntegerObject)) {
    return new objects.ErrorObject(
      `second argument to 'padLeft' must be INTEGER, got ${length.type()}`
    );
  }

  if (!(padChar instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `third argument to 'padLeft' must be STRING, got ${padChar.type()}`
    );
  }

  const padString = padChar.value || " ";
  const result = str.value.padStart(length.value, padString);
  return new objects.StringObject(result);
};

/**
 * padRight(string, length, char?) - Pad string on the right
 */
const padRightFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length < 2 || args.length > 3) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2 or 3`
    );
  }

  const str = args[0];
  const length = args[1];
  const padChar = args.length === 3 ? args[2] : new objects.StringObject(" ");

  if (!(str instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `first argument to 'padRight' must be STRING, got ${str.type()}`
    );
  }

  if (!(length instanceof objects.IntegerObject)) {
    return new objects.ErrorObject(
      `second argument to 'padRight' must be INTEGER, got ${length.type()}`
    );
  }

  if (!(padChar instanceof objects.StringObject)) {
    return new objects.ErrorObject(
      `third argument to 'padRight' must be STRING, got ${padChar.type()}`
    );
  }

  const padString = padChar.value || " ";
  const result = str.value.padEnd(length.value, padString);
  return new objects.StringObject(result);
};

// ============================================================================
// 4. TIME AND DATE OPERATIONS
// ============================================================================

/**
 * now() - Get current timestamp
 */
const nowFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 0) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=0`
    );
  }

  return new objects.IntegerObject(Date.now());
};

/**
 * sleep(milliseconds) - Pause execution (Note: This is a simulation)
 */
const sleepFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const ms = args[0];
  if (!(ms instanceof objects.IntegerObject)) {
    return new objects.ErrorObject(
      `argument to 'sleep' must be INTEGER, got ${ms.type()}`
    );
  }

  if (ms.value < 0) {
    return new objects.ErrorObject("sleep duration cannot be negative");
  }

  // Note: This is a blocking sleep - in a real implementation,
  // you might want to use async/await or return a promise
  const start = Date.now();
  while (Date.now() - start < ms.value) {
    // Busy wait (not ideal, but simple for demonstration)
  }

  return new objects.NullObject();
};

// ============================================================================
// 5. ADVANCED UTILITY FUNCTIONS
// ============================================================================

/**
 * deepCopy(obj) - Create deep copy of object
 */
const deepCopyFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const obj = args[0];

  const copyObject = (original: objects.BaseObject): objects.BaseObject => {
    if (original instanceof objects.ArrayObject) {
      const copiedElements = original.elements.map(copyObject);
      return new objects.ArrayObject(copiedElements);
    }

    if (original instanceof objects.HashObject) {
      const copiedPairs = new Map<string, objects.BaseObject>();
      for (const [key, value] of original.pairs) {
        copiedPairs.set(key, copyObject(value));
      }
      return new objects.HashObject(copiedPairs);
    }

    // For primitive types, return the same object (they're immutable)
    return original;
  };

  return copyObject(obj);
};

/**
 * isEmpty(obj) - Check if object is empty
 */
const isEmptyFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 1) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=1`
    );
  }

  const obj = args[0];

  if (obj instanceof objects.ArrayObject) {
    return new objects.BooleanObject(obj.elements.length === 0);
  }

  if (obj instanceof objects.StringObject) {
    return new objects.BooleanObject(obj.value.length === 0);
  }

  if (obj instanceof objects.HashObject) {
    return new objects.BooleanObject(obj.pairs.size === 0);
  }

  if (obj instanceof objects.NullObject) {
    return new objects.BooleanObject(true);
  }

  return new objects.BooleanObject(false);
};

/**
 * isEqual(obj1, obj2) - Deep equality comparison
 */
const isEqualFunction: BuiltinFunction = (
  args: objects.BaseObject[]
): objects.BaseObject => {
  if (args.length !== 2) {
    return new objects.ErrorObject(
      `wrong number of arguments. got=${args.length}, want=2`
    );
  }

  const obj1 = args[0];
  const obj2 = args[1];

  const isEqual = (a: objects.BaseObject, b: objects.BaseObject): boolean => {
    if (a.type() !== b.type()) {
      return false;
    }

    if (
      a instanceof objects.IntegerObject &&
      b instanceof objects.IntegerObject
    ) {
      return a.value === b.value;
    }

    if (
      a instanceof objects.StringObject &&
      b instanceof objects.StringObject
    ) {
      return a.value === b.value;
    }

    if (
      a instanceof objects.BooleanObject &&
      b instanceof objects.BooleanObject
    ) {
      return a.value === b.value;
    }

    if (a instanceof objects.NullObject && b instanceof objects.NullObject) {
      return true;
    }

    if (a instanceof objects.ArrayObject && b instanceof objects.ArrayObject) {
      if (a.elements.length !== b.elements.length) {
        return false;
      }
      for (let i = 0; i < a.elements.length; i++) {
        if (!isEqual(a.elements[i], b.elements[i])) {
          return false;
        }
      }
      return true;
    }

    if (a instanceof objects.HashObject && b instanceof objects.HashObject) {
      if (a.pairs.size !== b.pairs.size) {
        return false;
      }
      for (const [key, value] of a.pairs) {
        const otherValue = b.pairs.get(key);
        if (!otherValue || !isEqual(value, otherValue)) {
          return false;
        }
      }
      return true;
    }

    return false;
  };

  return new objects.BooleanObject(isEqual(obj1, obj2));
};

// ============================================================================
// ADVANCED BUILTINS REGISTRY
// ============================================================================

export const ADVANCED_BUILTINS: Map<string, BuiltinObject> = new Map([
  // Functional programming (require evaluator integration)
  ["map", new BuiltinObject("map", mapFunction)],
  ["filter", new BuiltinObject("filter", filterFunction)],
  ["reduce", new BuiltinObject("reduce", reduceFunction)],
  ["forEach", new BuiltinObject("forEach", forEachFunction)],

  // Advanced array operations
  ["sort", new BuiltinObject("sort", sortFunction)],
  ["unique", new BuiltinObject("unique", uniqueFunction)],
  ["flatten", new BuiltinObject("flatten", flattenFunction)],
  ["zip", new BuiltinObject("zip", zipFunction)],
  ["enumerate", new BuiltinObject("enumerate", enumerateFunction)],

  // Advanced string operations
  ["format", new BuiltinObject("format", formatFunction)],
  ["repeat", new BuiltinObject("repeat", repeatFunction)],
  ["padLeft", new BuiltinObject("padLeft", padLeftFunction)],
  ["padRight", new BuiltinObject("padRight", padRightFunction)],

  // Time operations
  ["now", new BuiltinObject("now", nowFunction)],
  ["sleep", new BuiltinObject("sleep", sleepFunction)],

  // Advanced utilities
  ["deepCopy", new BuiltinObject("deepCopy", deepCopyFunction)],
  ["isEmpty", new BuiltinObject("isEmpty", isEmptyFunction)],
  ["isEqual", new BuiltinObject("isEqual", isEqualFunction)],
]);

export function getAdvancedBuiltinNames(): string[] {
  return Array.from(ADVANCED_BUILTINS.keys()).sort();
}

export function getAdvancedBuiltinsByCategory(): Record<string, string[]> {
  return {
    "Functional Programming": ["map", "filter", "reduce", "forEach"],
    "Advanced Arrays": ["sort", "unique", "flatten", "zip", "enumerate"],
    "Advanced Strings": ["format", "repeat", "padLeft", "padRight"],
    "Time Operations": ["now", "sleep"],
    "Advanced Utilities": ["deepCopy", "isEmpty", "isEqual"],
  };
}

/**
 * NOTE: Higher-order functions like map, filter, reduce require access to the evaluator
 * to call user-defined functions. These should be implemented directly in the evaluator
 * class rather than as standalone built-in functions.
 */
