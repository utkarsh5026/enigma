import { NodeEvaluator } from "@/lang/exec/core";
import { IndexExpression } from "@/lang/ast/expression";
import {
  Environment,
  ErrorObject,
  ArrayObject,
  HashObject,
  NullObject,
} from "@/lang/exec/objects";
import { EvaluationContext } from "@/lang/exec/core";
import { ObjectValidator } from "../validate";
import { Expression } from "@/lang/ast/ast";

export class IndexExpressionEvaluator
  implements NodeEvaluator<IndexExpression>
{
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
      return this.evalArrayIndexExpression(left, node.index, env, context);
    }

    if (ObjectValidator.isHash(left)) {
      return this.evalHashIndexExpression(left, node.index, env, context);
    }

    return new ErrorObject(
      "Index operator not supported for type: " + left.type()
    );
  }

  private evalArrayIndexExpression(
    array: ArrayObject,
    index: Expression,
    env: Environment,
    context: EvaluationContext
  ) {
    const indexObject = context.evaluate(index, env);

    if (!ObjectValidator.isInteger(indexObject)) {
      return new ErrorObject(
        `Index must be an integer literal, got: ${indexObject.inspect()}`
      );
    }

    const arrIndex = indexObject.value;

    if (arrIndex < 0 || arrIndex >= array.size()) {
      return new ErrorObject(
        `Index out of bounds: ${arrIndex} for array of size ${array.size()}`
      );
    }

    return array.get(arrIndex);
  }

  private evalHashIndexExpression(
    hash: HashObject,
    index: Expression,
    env: Environment,
    context: EvaluationContext
  ) {
    const indexObject = context.evaluate(index, env);

    if (
      !ObjectValidator.isString(indexObject) &&
      !ObjectValidator.isInteger(indexObject)
    ) {
      return new ErrorObject(
        `Index must be a string or integer literal, got: ${indexObject.inspect()}`
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
