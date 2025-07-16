import { NodeEvaluator, ObjectValidator } from "@/lang/exec/core";
import { PrefixExpression } from "@/lang/ast";
import {
  Environment,
  BaseObject,
  ErrorObject,
  BooleanObject,
  IntegerObject,
} from "@/lang/exec/objects";
import { EvaluationContext } from "@/lang/exec/core";

export class PrefixExpressionEvaluator
  implements NodeEvaluator<PrefixExpression>
{
  /**
   * Evaluates a prefix expression.
   * @param node - The prefix expression to evaluate.
   * @param env - The environment to evaluate the expression in.
   * @param context - The context to evaluate the expression in.
   * @returns The result of the evaluation.
   */
  public evaluate(
    node: PrefixExpression,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    context.addBeforeStep(
      node,
      env,
      `Evaluating prefix expression evaluation: ${node.toString()}`
    );
    const right = context.evaluate(node.right, env);
    if (ObjectValidator.isError(right)) {
      context.addAfterStep(
        node,
        env,
        right,
        `Error evaluating prefix expression: ${right.message}`
      );
      return right;
    }
    const result = this.evalPrefixExpression(node.operator, right);
    context.addAfterStep(
      node,
      env,
      result,
      `Prefix expression evaluated: ${result.inspect()}`
    );
    return result;
  }

  /**
   * Evaluates a prefix expression.
   * @param operator - The operator to evaluate.
   * @param right - The right operand.
   * @returns The result of the evaluation.
   */
  private evalPrefixExpression(
    operator: string,
    right: BaseObject
  ): BaseObject {
    if (operator === "!") {
      return this.evalLogicalNotOperator(right);
    }

    if (operator === "-") {
      return this.evalNegationOperator(right);
    }

    return new ErrorObject(
      `unknown operator: ${operator}${right.type()}, You can only use ! or - operator with BOOLEAN or INTEGER`
    );
  }

  private evalLogicalNotOperator(value: BaseObject): BaseObject {
    if (ObjectValidator.isBoolean(value)) {
      return new BooleanObject(!value.value);
    }

    if (ObjectValidator.isNull(value)) {
      return new BooleanObject(true);
    }

    return new BooleanObject(!(value as BaseObject).isTruthy());
  }

  private evalNegationOperator(value: BaseObject): BaseObject {
    if (ObjectValidator.isInteger(value)) {
      return new IntegerObject(-value.value);
    }

    const errorMessage = `unknown operator: -${value.type()}, You can only use - operator with INTEGER like -5, -10, -100, -1000, etc.`;

    return new ErrorObject(errorMessage);
  }
}
