import { NodeEvaluator } from "@/lang/exec/core";
import { IndexExpression, Expression } from "@/lang/ast";
import { ArrayObject, HashObject, NullObject } from "@/lang/exec/objects";
import {
  EvaluationContext,
  ObjectValidator,
  Environment,
} from "@/lang/exec/core";

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
export class IndexExpressionEvaluator implements NodeEvaluator<IndexExpression> {
  public evaluate(
    node: IndexExpression,
    env: Environment,
    context: EvaluationContext
  ) {
    const left = context.evaluate(node.left, env);
    if (ObjectValidator.isError(left)) {
      return left;
    }

    if (ObjectValidator.isArray(left)) {
      return this.evalArrayIndexExpression(
        left,
        node.index,
        env,
        context,
        node
      );
    }

    if (ObjectValidator.isHash(left)) {
      return this.evalHashIndexExpression(left, node.index, env, context, node);
    }

    const error = context.createError(
      "Index operator not supported for type: " + left.type(),
      node.position()
    );
    return error;
  }

  private evalArrayIndexExpression(
    array: ArrayObject,
    index: Expression,
    env: Environment,
    context: EvaluationContext,
    indexExpression: IndexExpression
  ) {
    const indexObject = context.evaluate(index, env);

    if (!ObjectValidator.isInteger(indexObject)) {
      return context.createError(
        `Index must be an integer literal, got: ${indexObject.inspect()}`,
        indexExpression.position()
      );
    }

    const arrIndex = indexObject.value;

    if (arrIndex < 0 || arrIndex >= array.size()) {
      return context.createError(
        `Index out of bounds: ${arrIndex} for array of size ${array.size()}`,
        indexExpression.position()
      );
    }

    return array.get(arrIndex);
  }

  private evalHashIndexExpression(
    hash: HashObject,
    index: Expression,
    env: Environment,
    context: EvaluationContext,
    indexExpression: IndexExpression
  ) {
    const indexObject = context.evaluate(index, env);

    if (
      !ObjectValidator.isString(indexObject) &&
      !ObjectValidator.isInteger(indexObject)
    ) {
      return context.createError(
        `Index must be a string or integer literal, got: ${indexObject.inspect()}`,
        indexExpression.position()
      );
    }

    const key = ObjectValidator.isString(indexObject)
      ? indexObject.value
      : indexObject.value.toString();

    const value = hash.get(key);
    if (value === null) {
      return NullObject.INSTANCE;
    }

    return value;
  }
}
