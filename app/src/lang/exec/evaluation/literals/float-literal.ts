import {
  Environment,
  NodeEvaluator,
  EvaluationContext,
} from "@/lang/exec/core";
import { FloatLiteral } from "@/lang/ast/literal";
import { FloatObject } from "@/lang/exec/objects";

/**
 * 🌊 FloatLiteralEvaluator - Float Literal Evaluation Specialist 🌊
 *
 * Evaluates FloatLiteral AST nodes into FloatObject runtime values.
 */
export class FloatLiteralEvaluator implements NodeEvaluator<FloatLiteral> {
  public evaluate(
    node: FloatLiteral,
    env: Environment,
    context: EvaluationContext
  ) {
    context.addBeforeStep(node, env, `Evaluating float literal`);
    const value = node.value;
    const result = new FloatObject(value);
    context.addAfterStep(
      node,
      env,
      result,
      `Float literal evaluated: ${result.inspect()}`
    );
    return result;
  }
}
