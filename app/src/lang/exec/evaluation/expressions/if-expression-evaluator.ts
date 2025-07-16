import { NodeEvaluator } from "@/lang/exec/core";
import { IfExpression } from "@/lang/ast/expression";
import { Environment, NullObject } from "@/lang/exec/objects";
import { EvaluationContext } from "@/lang/exec/core";
import { ObjectValidator } from "../../core/validate";

export class IfExpressionEvaluator implements NodeEvaluator<IfExpression> {
  public evaluate(
    node: IfExpression,
    env: Environment,
    context: EvaluationContext
  ) {
    const { conditions, consequences, alternative } = node;

    for (let i = 0; i < conditions.length; i++) {
      const condition = context.evaluate(conditions[i], env);

      if (ObjectValidator.isError(condition)) {
        return condition;
      }

      if (condition.isTruthy()) {
        return context.evaluate(consequences[i], env);
      }
    }

    if (alternative !== null) {
      return context.evaluate(alternative, env);
    }

    return NullObject.INSTANCE;
  }
}
