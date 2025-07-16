import { ArrayLiteral } from "@/lang/ast";
import { Environment, BaseObject, ArrayObject } from "@/lang/exec/objects";
import { EvaluationContext, NodeEvaluator } from "@/lang/exec/core";
import { ObjectValidator } from "../../core/validate";

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
