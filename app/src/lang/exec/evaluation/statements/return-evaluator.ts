import { ReturnStatement } from "@/lang/ast";
import { ReturnValueObject } from "@/lang/exec/objects";
import {
  EvaluationContext,
  NodeEvaluator,
  Environment,
  ObjectValidator,
  BaseObject,
} from "@/lang/exec/core";

export class ReturnStatementEvaluator
  implements NodeEvaluator<ReturnStatement>
{
  public evaluate(
    node: ReturnStatement,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    context.addBeforeStep(node, env, `Evaluating return statement`);
    const value = context.evaluate(node.returnValue, env);

    if (ObjectValidator.isError(value)) {
      context.addAfterStep(
        node,
        env,
        value,
        `Error evaluating return statement: ${value.message}`
      );
      return value;
    }

    return new ReturnValueObject(value);
  }
}
