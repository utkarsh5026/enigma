import { truthy } from "./utils";
import * as objects from "../objects";
import { Operator } from "@/lang/token/token";

export const evalAndExpression = (
  left: objects.BaseObject,
  right: objects.BaseObject
): objects.BaseObject => {
  const leftVal = truthy(left);
  if (!leftVal) return toBool(false);

  const rightVal = truthy(right);
  return toBool(rightVal);
};

export const toBool = (res: boolean): objects.BooleanObject =>
  res ? new objects.BooleanObject(true) : new objects.BooleanObject(false);

export const evalOrExpression = (
  left: objects.BaseObject,
  right: objects.BaseObject
): objects.BaseObject => {
  const leftVal = truthy(left);
  if (leftVal) return toBool(leftVal);

  const rightVal = truthy(right);
  return toBool(rightVal);
};

/**
 * Evaluates an infix expression with integer operands
 *
 * @param left - The left operand (integer)
 * @param right - The right operand (integer)
 * @param operator - The operator
 * @returns The result of applying the operator to the operands
 *
 * @example
 * // This method is called internally by evalInfixExpression
 * // e.g., when evaluating 5 + 3, 10 - 7, etc.
 */
export const evalIntegerInfixExpression = (
  left: objects.IntegerObject,
  right: objects.IntegerObject,
  operator: Operator
): objects.BaseObject => {
  const leftVal = left.value;
  const rightVal = right.value;

  switch (operator) {
    case "+":
      return new objects.IntegerObject(leftVal + rightVal);
    case "-":
      return new objects.IntegerObject(leftVal - rightVal);
    case "*":
      return new objects.IntegerObject(leftVal * rightVal);
    case "/":
      return new objects.IntegerObject(leftVal / rightVal);
    case "%":
      return new objects.IntegerObject(leftVal % rightVal);

    case "<":
      return toBool(leftVal < rightVal);
    case ">":
      return toBool(leftVal > rightVal);
    case "==":
      return toBool(leftVal === rightVal);
    case "!=":
      return toBool(leftVal !== rightVal);

    default:
      return new objects.ErrorObject(
        `Unknown operator: ${left.type()} (${operator}) ${right.type()}`
      );
  }
};

/**
 * Evaluates an infix expression with string operands
 *
 * @param left - The left operand (string)
 * @param right - The right operand (string)
 * @param operator - The operator
 * @returns The result of applying the operator to the operands
 *
 * @example
 * // This method is called internally by evalInfixExpression
 * // e.g., when evaluating "Hello" + " World"
 */
export const evalStringInfixExpression = (
  left: objects.StringObject,
  right: objects.StringObject,
  operator: Operator
): objects.BaseObject => {
  if (operator === "+")
    return new objects.StringObject(left.value + right.value);

  return new objects.ErrorObject(
    `Unknown operator: ${left.type()} (${operator}) ${right.type()}`
  );
};
