import {
  NodeEvaluator,
  BaseObject,
  Environment,
  EvaluationContext,
  ObjectValidator,
} from "@/lang/exec/core";
import { ThisExpression } from "@/lang/ast";

/**
 * 👆 ThisExpressionEvaluator - Current Instance Reference Evaluator 👆
 *
 * Evaluates 'this' expressions to return the current object instance.
 *
 * From first principles, 'this' evaluation involves:
 * 1. Look up 'this' binding in current environment
 * 2. Return the bound instance object
 * 3. Error if 'this' is not bound (not in instance context)
 */
export class ThisExpressionEvaluator implements NodeEvaluator<ThisExpression> {
  public evaluate(
    node: ThisExpression,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const thisObj = env.resolveVariable("this");

    if (!thisObj) {
      return context.createError(
        "'this' is not available in this context",
        node.position()
      );
    }

    if (!ObjectValidator.isInstance(thisObj)) {
      return context.createError(
        `'this' is not an instance of a class: ${thisObj.type()}`,
        node.position()
      );
    }

    return thisObj;
  }
}
