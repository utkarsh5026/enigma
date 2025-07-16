import { ReturnStatement } from "@/lang/ast";
import {
  Environment,
  BaseObject,
  ReturnValueObject,
} from "@/lang/exec/objects";
import { EvaluationContext, NodeEvaluator } from "@/lang/exec/core";
import { ObjectValidator } from "../../core/validate";

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

    const returnValueObject = new ReturnValueObject(value);
    context.addAfterStep(
      node,
      env,
      returnValueObject,
      `Return statement evaluated: ${returnValueObject.inspect()}`
    );
    return returnValueObject;
  }
}
