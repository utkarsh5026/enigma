import { FunctionLiteral } from "@/lang/ast";
import { Environment, BaseObject, FunctionObject } from "@/lang/exec/objects";
import { EvaluationContext, NodeEvaluator } from "@/lang/exec/core";

export class FunctionLiteralEvaluator
  implements NodeEvaluator<FunctionLiteral>
{
  public evaluate(
    node: FunctionLiteral,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const functionObject = new FunctionObject(node.parameters, node.body, env);
    context.addAfterStep(
      node,
      env,
      functionObject,
      `Function literal evaluated: ${functionObject.inspect()}`
    );
    return functionObject;
  }
}
