import {
  EvaluationContext,
  NodeEvaluator,
  Environment,
  BaseObject,
} from "@/lang/exec/core";
import { IntegerLiteral } from "@/lang/ast";
import { IntegerObject } from "@/lang/exec/objects";

export class IntegerLiteralEvaluator implements NodeEvaluator<IntegerLiteral> {
  public evaluate(
    node: IntegerLiteral,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const integerObject = new IntegerObject(node.value);
    context.addAfterStep(node, env, integerObject, `Integer literal evaluated`);
    return integerObject;
  }
}
