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
    const value = context.evaluate(node.returnValue, env);

    if (ObjectValidator.isError(value)) {
      return value;
    }

    return new ReturnValueObject(value);
  }
}
