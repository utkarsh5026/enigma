import { LoopContext, NodeEvaluator } from "@/lang/exec/core";
import { WhileStatement } from "@/lang/ast";
import {
  Environment,
  BaseObject,
  NullObject,
  ErrorObject,
} from "@/lang/exec/objects";
import { EvaluationContext } from "@/lang/exec/core";
import { ObjectValidator } from "../../core/validate";

export class WhileStatementEvaluator implements NodeEvaluator<WhileStatement> {
  constructor(private readonly loopContext: LoopContext) {}

  public evaluate(
    node: WhileStatement,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    context.addBeforeStep(node, env, `Evaluating while statement`);
    this.loopContext.enterLoop();
    let result = NullObject.INSTANCE;

    try {
      while (true) {
        if (this.loopContext.isMaxIterationsReached()) {
          const error = new ErrorObject(
            `Maximum iterations (${LoopContext.getMaxIterations()}) reached for loop`
          );
          context.addAfterStep(
            node,
            env,
            error,
            `Error: Maximum iterations (${LoopContext.getMaxIterations()}) reached for loop`
          );
          return error;
        }

        const condition = context.evaluate(node.condition, env);
        if (ObjectValidator.isError(condition)) {
          context.addAfterStep(
            node,
            env,
            condition,
            `Error: error evaluating while statement condition: ${condition.message}`
          );
          return condition;
        }

        if (!condition.isTruthy()) {
          context.addAfterStep(
            node,
            env,
            condition,
            `While statement condition evaluated to false: ${condition.inspect()}`
          );
          break;
        }

        result = context.evaluate(node.body, env);
        if (ObjectValidator.isError(result)) {
          context.addAfterStep(
            node,
            env,
            result,
            `Error: error evaluating while statement body: ${result.message}`
          );
          return result;
        }

        if (ObjectValidator.isReturnValue(result)) {
          context.addAfterStep(
            node,
            env,
            result,
            `While statement returned: ${result.inspect()}`
          );
          return result;
        }

        if (ObjectValidator.isBreak(result)) {
          context.addAfterStep(
            node,
            env,
            result,
            `While statement returned break: ${result.inspect()}`
          );
          break;
        }

        if (ObjectValidator.isContinue(result)) {
          context.addAfterStep(
            node,
            env,
            result,
            `While statement returned continue`
          );
          continue;
        }
      }
    } finally {
      this.loopContext.exitLoop();
      context.addAfterStep(node, env, result, `While statement evaluated`);
    }

    const loopResult = this.processLoopResult(result);
    context.addAfterStep(
      node,
      env,
      loopResult,
      `While statement evaluated: ${loopResult.inspect()}`
    );
    return loopResult;
  }

  private processLoopResult(result: BaseObject): BaseObject {
    if (ObjectValidator.isBreak(result)) {
      return NullObject.INSTANCE;
    }

    if (ObjectValidator.isContinue(result)) {
      return NullObject.INSTANCE;
    }

    return result;
  }
}
