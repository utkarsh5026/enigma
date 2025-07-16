import { EvaluationContext, NodeEvaluator } from "@/lang/exec/core";
import { BooleanExpression } from "@/lang/ast";
import { BaseObject, BooleanObject, Environment } from "@/lang/exec/objects";

export class BooleanLiteralEvaluator
  implements NodeEvaluator<BooleanExpression>
{
  public evaluate(
    node: BooleanExpression,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const booleanObject = new BooleanObject(node.value);
    context.addAfterStep(
      node,
      env,
      booleanObject,
      `Boolean literal evaluated: ${node.value}`
    );
    return booleanObject;
  }
}
