import {
  NodeEvaluator,
  EvaluationContext,
  Environment,
  BaseObject,
} from "@/lang/exec/core";
import { ExpressionStatement } from "@/lang/ast";

/**
 * 📦 ExpressionEvaluator - The Expression Statement Expert 📦
 *
 * This evaluator handles the evaluation of expression statements.
 * It's like a conductor who leads a symphony!
 * eg:
 */
export class ExpressionEvaluator implements NodeEvaluator<ExpressionStatement> {
  evaluate(
    node: ExpressionStatement,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    context.addBeforeStep(
      node,
      env,
      `Evaluating expression statement ${node.toString()}`
    );
    const result = context.evaluate(node.expression, env);
    context.addAfterStep(
      node,
      env,
      result,
      `Expression statement evaluated: ${result.inspect()}`
    );
    return result;
  }
}
