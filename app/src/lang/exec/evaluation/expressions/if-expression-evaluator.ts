import { NodeEvaluator } from "@/lang/exec/core";
import { IfExpression } from "@/lang/ast";
import { NullObject } from "@/lang/exec/objects";
import {
  EvaluationContext,
  Environment,
  ObjectValidator,
} from "@/lang/exec/core";

/**
 * 🔀 IfExpressionEvaluator - Conditional Logic Processor
 *
 * Evaluates conditional expressions by testing conditions and executing the
 * appropriate branch. Supports multiple if-else-if chains and handles both
 * expression-style and statement-style conditional logic.
 *
 * @example
 * - Simple conditions: if (age >= 18) then "adult" else "minor"
 * - Multiple branches: if score >= 90 then "A" else if score >= 80 then "B"
 * - Boolean tests: if isLoggedIn then showDashboard() else showLogin()
 * - Null checks: if user != null then user.name else "Guest"
 */
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
        const result = context.evaluate(consequences[i], env);
        return result;
      }
    }

    if (alternative !== null) {
      const result = context.evaluate(alternative, env);
      return result;
    }

    return NullObject.INSTANCE;
  }
}
