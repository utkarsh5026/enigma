import { ForStatement } from "@/lang/ast";
import { NullObject } from "@/lang/exec/objects";
import {
  LoopContext,
  NodeEvaluator,
  EvaluationContext,
  ObjectValidator,
  Environment,
  BaseObject,
} from "@/lang/exec/core";

export class ForStatementEvaluator implements NodeEvaluator<ForStatement> {
  constructor(private readonly loopContext: LoopContext) {}

  public evaluate(
    node: ForStatement,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    context.addBeforeStep(
      node,
      env,
      `Setting up for loop (depth: ${this.loopContext.getLoopDepth() + 1})`
    );

    const loopEnv = context.newScope(env, true);
    this.loopContext.enterLoop();
    let result = NullObject.INSTANCE;

    let iterationCount = 0;
    try {
      context.addDuringStep(
        node.initializer,
        loopEnv,
        "Executing for loop initializer"
      );

      const initResult = context.evaluate(node.initializer, loopEnv);
      if (ObjectValidator.isError(initResult)) {
        context.addAfterStep(
          node,
          loopEnv,
          initResult,
          `For loop error in initializer: ${initResult.message}`
        );
        return initResult;
      }

      while (true) {
        iterationCount++;
        if (this.loopContext.isMaxIterationsReached()) {
          const error = context.createError(
            `Maximum iterations (${LoopContext.getMaxIterations()}) reached for loop`,
            node.position()
          );

          context.addAfterStep(
            node,
            loopEnv,
            error,
            "For loop terminated: too many iterations"
          );
          return error;
        }

        context.addDuringStep(
          node.condition,
          loopEnv,
          `Evaluating for loop condition (iteration ${iterationCount})`,
          { iteration: iterationCount }
        );
        const condition = context.evaluate(node.condition, loopEnv);
        if (ObjectValidator.isError(condition)) {
          return condition;
        }

        if (!condition.isTruthy()) {
          context.addAfterStep(
            node,
            loopEnv,
            condition,
            `For loop condition evaluated to false: ${condition.inspect()}`
          );
          break;
        }

        result = context.evaluate(node.body, loopEnv);

        if (
          ObjectValidator.isReturnValue(result) ||
          ObjectValidator.isError(result)
        ) {
          context.addAfterStep(
            node,
            loopEnv,
            result,
            `For loop returned: ${result.inspect()}`
          );
          return result;
        }

        const updateResult = context.evaluate(node.increment, loopEnv);
        if (ObjectValidator.isError(updateResult)) {
          context.addAfterStep(
            node,
            loopEnv,
            updateResult,
            `For loop error in increment: ${updateResult.message}`
          );
          return updateResult;
        }

        if (ObjectValidator.isBreak(result)) {
          context.addAfterStep(
            node,
            loopEnv,
            result,
            `For loop returned break: ${result.inspect()}`
          );
          break;
        }

        if (ObjectValidator.isContinue(result)) {
          context.addAfterStep(
            node,
            loopEnv,
            result,
            `For loop returned continue`
          );
          continue;
        }
      }
    } finally {
      this.loopContext.exitLoop();
      context.addAfterStep(node, env, result, `For loop evaluated`);
    }

    const loopResult = this.processLoopResult(result);
    context.addAfterStep(
      node,
      env,
      loopResult,
      `For loop evaluated: ${loopResult.inspect()}`
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
