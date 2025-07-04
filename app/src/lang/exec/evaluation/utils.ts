import * as objects from "../objects";

/**
 * Determines if an object is truthy
 *
 * @param obj - The object to check
 * @returns true if the object is considered truthy, false otherwise
 *
 * @example
 * console.log(evaluator.truthy(evaluator.TRUE)); // Outputs: true
 * console.log(evaluator.truthy(evaluator.FALSE)); // Outputs: false
 * console.log(evaluator.truthy(evaluator.NULL)); // Outputs: false
 * console.log(evaluator.truthy(new objects.IntegerObject(1))); // Outputs: true
 */
export const truthy = (obj: objects.BaseObject): boolean => {
  switch (obj.constructor) {
    case objects.BooleanObject:
      return (obj as objects.BooleanObject).value;

    case objects.NullObject:
      return false;

    case objects.IntegerObject:
      return (obj as objects.IntegerObject).value !== 0;

    case objects.StringObject:
      return (obj as objects.StringObject).value.length > 0;

    case objects.ArrayObject:
      return (obj as objects.ArrayObject).elements.length > 0;

    case objects.HashObject:
      return (obj as objects.HashObject).pairs.size > 0;

    default:
      return true;
  }
};
