import { truthy } from "./utils";
import * as objects from "../objects";
import { Operator } from "@/lang/token/token";
import type { Identifier } from "@/lang/ast/ast";
import { ObjectValidator } from "../core/validate";
import { evalLogicalNotOperator, evalNegationOperator } from "./operator";
import { getBuiltin, isBuiltin } from "../builtins";

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
    case "<=":
      return toBool(leftVal <= rightVal);
    case ">=":
      return toBool(leftVal >= rightVal);
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

/**
 * Evaluates an identifier
 *
 * @param node - The identifier node
 * @param env - The current environment
 * @returns The value associated with the identifier
 *
 * @example
 * // Assuming "x" is already defined in the environment with value 5
 * const identifier = new ast.Identifier("x");
 * const result = evaluator.evaluate(identifier, environment);
 * console.log(result.inspect()); // Outputs: 5
 */
export const evalIdentifier = (
  node: Identifier,
  env: objects.Environment
): objects.BaseObject => {
  console.log(node.value);
  if (isBuiltin(node.value)) {
    const builtin = getBuiltin(node.value);
    if (builtin) return builtin;
  }
  const value = env.get(node.value);
  if (value) return value;

  return new objects.ErrorObject(`Identifier not found: ${node.value}`);
};

export const evaluateInfix = (
  left: objects.BaseObject,
  right: objects.BaseObject,
  operator: Operator
): objects.BaseObject => {
  if (ObjectValidator.isInteger(left) && ObjectValidator.isInteger(right)) {
    return evalIntegerInfixExpression(left, right, operator);
  }

  if (ObjectValidator.isString(left) && ObjectValidator.isString(right)) {
    return evalStringInfixExpression(left, right, operator);
  }

  if (operator === "==") {
    return toBool(left === right);
  }

  if (operator === "!=") {
    return toBool(left !== right);
  }

  if (operator === "&&") {
    return evalAndExpression(left, right);
  }

  if (operator === "||") {
    return evalOrExpression(left, right);
  }

  if (left.type() !== right.type()) {
    return new objects.ErrorObject(
      `Type mismatch: ${left.type()} ${operator} ${right.type()}`
    );
  }

  return new objects.ErrorObject(
    `Unknown operator: ${left.type()} ${operator} ${right.type()}`
  );
};

export const evaluatePrefix = (
  operator: string,
  operand: objects.BaseObject
): objects.BaseObject => {
  switch (operator) {
    case "!":
      return evalLogicalNotOperator(operand);
    case "-":
      return evalNegationOperator(operand);
    default:
      return new objects.ErrorObject(`Unknown operator: ${operator}`);
  }
};
