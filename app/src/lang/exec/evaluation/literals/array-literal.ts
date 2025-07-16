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
    const evaluatedElements = context.evaluateExpressions(node.elements, env);

    for (const element of evaluatedElements) {
      if (ObjectValidator.isError(element)) {
        return element;
      }
    }

    return new ArrayObject(evaluatedElements);
  }
}
