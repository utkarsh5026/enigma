import { EvaluationContext, NodeEvaluator } from "@/lang/exec/core";
import { NullLiteral } from "@/lang/ast";
import { BaseObject, Environment, NullObject } from "@/lang/exec/objects";

export class NullLiteralEvaluator implements NodeEvaluator<NullLiteral> {
  public evaluate(
    node: NullLiteral,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    context.addAfterStep(
      node,
      env,
      NullObject.INSTANCE,
      `Null literal evaluated`
    );
    return NullObject.INSTANCE;
  }
}
