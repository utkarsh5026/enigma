import {
  EvaluationContext,
  NodeEvaluator,
  Environment,
  BaseObject,
} from "@/lang/exec/core";
import { NullLiteral } from "@/lang/ast";
import { NullObject } from "@/lang/exec/objects";

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
