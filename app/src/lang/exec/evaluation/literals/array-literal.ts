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
    context.addBeforeStep(node, env, `Evaluating array literal`);
    const evaluatedElements = context.evaluateExpressions(node.elements, env);

    for (const element of evaluatedElements) {
      if (ObjectValidator.isError(element)) {
        context.addAfterStep(
          node,
          env,
          element,
          `Error evaluating array literal: ${element.message}`
        );
        return element;
      }
    }

    context.addAfterStep(
      node,
      env,
      new ArrayObject(evaluatedElements),
      `Array literal evaluated: ${evaluatedElements
        .map((e) => e.inspect())
        .join(", ")}`
    );
    return new ArrayObject(evaluatedElements);
  }
}
