import { InfixExpression } from "@/lang/ast/expression";
import { NodeEvaluator, ObjectValidator } from "@/lang/exec/core";
import {
  Environment,
  BaseObject,
  ErrorObject,
  StringObject,
  BooleanObject,
  IntegerObject,
} from "@/lang/exec/objects";
import { EvaluationContext } from "@/lang/exec/core";

/**
 * 🧮 InfixExpressionEvaluator - Binary Operation Specialist 🧮
 *
 * Handles all operations between two values: 5 + 3, "hello" + "world", etc.
 * This evaluator focuses purely on infix operations and delegates everything
 * else.
 */
export class InfixExpressionEvaluator
  implements NodeEvaluator<InfixExpression>
{
  public evaluate(
    node: InfixExpression,
    env: Environment,
    context: EvaluationContext
  ) {
    context.addBeforeStep(
      node,
      env,
      `Evaluating the left side of the infix expression`
    );
    const left = context.evaluate(node.left, env);
    if (ObjectValidator.isError(left)) {
      context.addAfterStep(
        node,
        env,
        left,
        `Error evaluating the left side of the infix expression: ${left.message}`
      );
      return left;
    }

    context.addBeforeStep(
      node,
      env,
      `Evaluating the right side of the infix expression`
    );
    const right = context.evaluate(node.right, env);
    if (ObjectValidator.isError(right)) {
      context.addAfterStep(
        node,
        env,
        right,
        `Error evaluating the right side of the infix expression: ${right.message}`
      );
      return right;
    }

    context.addBeforeStep(node, env, `Evaluating the infix expression`);
    const result = this.evalInfixExpression(node.operator, left, right);
    context.addAfterStep(
      node,
      env,
      result,
      `Infix expression evaluated: ${result.inspect()}`
    );
    return result;
  }

  private evalStringInfixExpression(
    operator: string,
    left: BaseObject,
    right: BaseObject
  ) {
    if (!ObjectValidator.isString(left) || !ObjectValidator.isString(right)) {
      return this.createTypeMismatchError(operator, left, right);
    }

    const leftString = left.value;
    const rightString = right.value;

    switch (operator) {
      case "+":
        return new StringObject(leftString + rightString);

      case "==":
        return new BooleanObject(leftString === rightString);

      case "!=":
        return new BooleanObject(leftString !== rightString);

      case ">":
        return new BooleanObject(leftString > rightString);

      case "<":
        return new BooleanObject(leftString < rightString);

      default:
        return this.createInvalidOperatorError(operator, left, right);
    }
  }

  private evalIntegerInfixExpression(
    operator: string,
    left: BaseObject,
    right: BaseObject
  ) {
    if (!ObjectValidator.isInteger(left) || !ObjectValidator.isInteger(right)) {
      return this.createTypeMismatchError(operator, left, right);
    }

    const leftInteger = left.value;
    const rightInteger = right.value;

    switch (operator) {
      case "+":
        return new IntegerObject(leftInteger + rightInteger);

      case "-":
        return new IntegerObject(leftInteger - rightInteger);

      case "*":
        return new IntegerObject(leftInteger * rightInteger);

      case "/":
        if (rightInteger == 0) {
          return new ErrorObject("division by zero");
        }
        return new IntegerObject(Math.floor(leftInteger / rightInteger));

      case "%":
        return new IntegerObject(leftInteger % rightInteger);

      case "==":
        return new BooleanObject(leftInteger == rightInteger);

      case "!=":
        return new BooleanObject(leftInteger != rightInteger);

      case "<":
        return new BooleanObject(leftInteger < rightInteger);

      case "<=":
        return new BooleanObject(leftInteger <= rightInteger);

      case ">":
        return new BooleanObject(leftInteger > rightInteger);

      case ">=":
        return new BooleanObject(leftInteger >= rightInteger);

      default:
        return this.createInvalidOperatorError(operator, left, right);
    }
  }

  private evalBooleanInfixExpression(
    operator: string,
    left: BaseObject,
    right: BaseObject
  ) {
    if (!ObjectValidator.isBoolean(left) || !ObjectValidator.isBoolean(right)) {
      return this.createTypeMismatchError(operator, left, right);
    }

    const leftBoolean = left.value;
    const rightBoolean = right.value;

    switch (operator) {
      case "==":
        return new BooleanObject(leftBoolean == rightBoolean);

      case "!=":
        return new BooleanObject(leftBoolean != rightBoolean);

      case "&&":
        return new BooleanObject(leftBoolean && rightBoolean);

      case "||":
        return new BooleanObject(leftBoolean || rightBoolean);

      default:
        return this.createInvalidOperatorError(operator, left, right);
    }
  }

  private evalInfixExpression(
    operator: string,
    left: BaseObject,
    right: BaseObject
  ) {
    // Handle null operations first
    if (ObjectValidator.isNull(left) || ObjectValidator.isNull(right)) {
      return this.evalNullInfixExpression(operator, left, right);
    }

    if (ObjectValidator.isString(left) && ObjectValidator.isString(right))
      return this.evalStringInfixExpression(operator, left, right);

    if (ObjectValidator.isInteger(left) && ObjectValidator.isInteger(right))
      return this.evalIntegerInfixExpression(operator, left, right);

    if (ObjectValidator.isBoolean(left) && ObjectValidator.isBoolean(right))
      return this.evalBooleanInfixExpression(operator, left, right);

    return this.createInvalidOperatorError(operator, left, right);
  }

  private evalNullInfixExpression(
    operator: string,
    left: BaseObject,
    right: BaseObject
  ) {
    switch (operator) {
      case "==":
        // null == null -> true, null == anything -> false
        return new BooleanObject(
          ObjectValidator.isNull(left) && ObjectValidator.isNull(right)
        );

      case "!=":
        // null != null -> false, null != anything -> true
        return new BooleanObject(
          !(ObjectValidator.isNull(left) && ObjectValidator.isNull(right))
        );

      default:
        // All other operations with null are errors
        return new ErrorObject(
          "Cannot perform '" +
            operator +
            "' operation with null values. " +
            "Only equality (==) and inequality (!=) operations are supported with null."
        );
    }
  }

  private createInvalidOperatorError(
    operator: string,
    left: BaseObject,
    right: BaseObject
  ) {
    return new ErrorObject(
      "Invalid operator '" +
        operator +
        "' for types " +
        left.type() +
        " and " +
        right.type() +
        ". This operation is not supported."
    );
  }

  private createTypeMismatchError(
    operator: string,
    left: BaseObject,
    right: BaseObject
  ) {
    return new ErrorObject(
      "Type mismatch: " +
        left.type() +
        " " +
        operator +
        " " +
        right.type() +
        ". This operation is not supported."
    );
  }
}
