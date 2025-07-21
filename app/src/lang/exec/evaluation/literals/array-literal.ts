import { ArrayLiteral } from "@/lang/ast";
import { ArrayObject } from "@/lang/exec/objects";
import {
  EvaluationContext,
  NodeEvaluator,
  Environment,
  ObjectValidator,
  BaseObject,
} from "@/lang/exec/core";

/**
 * 📚 ArrayLiteralEvaluator - Array Collection Builder
 *
 * Evaluates array literal expressions into runtime array objects. Handles
 * ordered collections of elements where each element can be any expression
 * that gets evaluated to a value.
 *
 * @example
 * - Empty arrays: []
 * - Numeric arrays: [1, 2, 3, 4, 5]
 * - Mixed-type arrays: [42, "hello", true, null]
 * - Nested arrays: [[1, 2], [3, 4], [5, 6]]
 * - Expression arrays: [x + 1, getName(), calculateTotal()]
 */
export class ArrayLiteralEvaluator implements NodeEvaluator<ArrayLiteral> {
  public evaluate(
    node: ArrayLiteral,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const evaluatedElements = context.evaluateExpressions(node.elements, env);

    for (const element of evaluatedElements) {
      if (ObjectValidator.isError(element)) {
        return element;
      }
    }

    return new ArrayObject(evaluatedElements);
  }
}
