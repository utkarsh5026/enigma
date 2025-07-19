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
    context.addBeforeStep(node, env, `Evaluating if expression`);
    const { conditions, consequences, alternative } = node;

    for (let i = 0; i < conditions.length; i++) {
      context.addBeforeStep(
        node,
        env,
        `Evaluating if expression condition ${i} ${conditions[i].toString()}`
      );

      const condition = context.evaluate(conditions[i], env);

      if (ObjectValidator.isError(condition)) {
        context.addAfterStep(
          node,
          env,
          condition,
          `Error evaluating if expression condition ${i}: ${condition.message}`
        );
        return condition;
      }

      if (condition.isTruthy()) {
        context.addBeforeStep(
          node,
          env,
          `Evaluating if expression consequence ${i} ${consequences[
            i
          ].toString()}`
        );
        const result = context.evaluate(consequences[i], env);
        context.addAfterStep(
          node,
          env,
          result,
          `If expression consequence ${i} evaluated: ${result.inspect()}`
        );
        return result;
      }
    }

    if (alternative !== null) {
      context.addBeforeStep(
        node,
        env,
        `Evaluating if expression alternative ${alternative.toString()}`
      );
      const result = context.evaluate(alternative, env);
      return result;
    }

    return NullObject.INSTANCE;
  }
}
