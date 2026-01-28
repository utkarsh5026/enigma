import {
  NodeEvaluator,
  ObjectValidator,
  Environment,
  BaseObject,
} from "@/lang/exec/core";
import { PrefixExpression } from "@/lang/ast";
import { BooleanObject, IntegerObject } from "@/lang/exec/objects";
import type { EvaluationContext } from "@/lang/exec/core";
import type { Position } from "@/lang/token/token";

/**
 * ➖ PrefixExpressionEvaluator - Unary Operation Handler
 *
 * Evaluates prefix (unary) expressions that operate on a single operand.
 * Handles logical negation for boolean values and arithmetic negation
 * for numeric values, with proper type checking and error handling.
 *
 * @example
 * - Logical negation: !true, !isValid, !user.hasPermission
 * - Arithmetic negation: -42, -totalCost, -temperature
 * - Boolean conversion: !0, !null, !"", ![]
 * - Sign flipping: -positiveNumber, -(-5)
 */
export class PrefixExpressionEvaluator implements NodeEvaluator<PrefixExpression> {
  public evaluate(
    node: PrefixExpression,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const right = context.evaluate(node.right, env);
    if (ObjectValidator.isError(right)) {
      return right;
    }

    const result = this.evalPrefixExpression(
      node.operator,
      right,
      context,
      node.position()
    );
    return result;
  }

  private evalPrefixExpression(
    operator: string,
    right: BaseObject,
    context: EvaluationContext,
    position: Position
  ): BaseObject {
    if (operator === "!") {
      return this.evalLogicalNotOperator(right);
    }

    if (operator === "-") {
      return this.evalNegationOperator(right, context, position);
    }

    return context.createError(
      `unknown operator: ${operator}${right.type()}, You can only use ! or - operator with BOOLEAN or INTEGER`,
      position
    );
  }

  private evalLogicalNotOperator(value: BaseObject): BaseObject {
    if (ObjectValidator.isBoolean(value)) {
      return new BooleanObject(!value.value);
    }

    if (ObjectValidator.isNull(value)) {
      return new BooleanObject(true);
    }

    return new BooleanObject(!(value as BaseObject).isTruthy());
  }

  private evalNegationOperator(
    value: BaseObject,
    context: EvaluationContext,
    position: Position
  ): BaseObject {
    if (ObjectValidator.isInteger(value)) {
      return new IntegerObject(-value.value);
    }

    const errorMessage = `unknown operator: -${value.type()}, You can only use - operator with INTEGER like -5, -10, -100, -1000, etc.`;

    return context.createError(errorMessage, position);
  }
}
