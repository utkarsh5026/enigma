import { NodeEvaluator } from "@/lang/exec/core";
import { IndexExpression } from "@/lang/ast/expression";
import { ArrayObject, HashObject, NullObject } from "@/lang/exec/objects";
import {
  EvaluationContext,
  ObjectValidator,
  Environment,
} from "@/lang/exec/core";
import { Expression } from "@/lang/ast/ast";

export class IndexExpressionEvaluator
  implements NodeEvaluator<IndexExpression>
{
  public evaluate(
    node: IndexExpression,
    env: Environment,
    context: EvaluationContext
  ) {
    context.addBeforeStep(node, env, `Evaluating index expression`);
    const left = context.evaluate(node.left, env);
    if (ObjectValidator.isError(left)) {
      context.addAfterStep(
        node,
        env,
        left,
        `Error evaluating index expression left: ${left.message}`
      );
      return left;
    }

    if (ObjectValidator.isArray(left)) {
      context.addBeforeStep(node, env, `Evaluating array index expression`);
      const result = this.evalArrayIndexExpression(
        left,
        node.index,
        env,
        context,
        node
      );
      context.addAfterStep(
        node,
        env,
        result,
        `Array index expression evaluated: ${result.inspect()}`
      );
      return result;
    }

    if (ObjectValidator.isHash(left)) {
      context.addBeforeStep(node, env, `Evaluating hash index expression`);
      const result = this.evalHashIndexExpression(
        left,
        node.index,
        env,
        context,
        node
      );
      context.addAfterStep(
        node,
        env,
        result,
        `Hash index expression evaluated: ${result.inspect()}`
      );
      return result;
    }

    const error = context.createError(
      "Index operator not supported for type: " + left.type(),
      node.position()
    );
    context.addAfterStep(
      node,
      env,
      error,
      `Error evaluating index expression: ${error.message}`
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
