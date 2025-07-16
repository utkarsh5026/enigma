import { ForStatement } from "@/lang/ast";
import {
  Environment,
  BaseObject,
  NullObject,
  ErrorObject,
} from "../../objects";
import { LoopContext, NodeEvaluator, EvaluationContext } from "../../core";
import { ObjectValidator } from "../../core/validate";

export class ForStatementEvaluator implements NodeEvaluator<ForStatement> {
  constructor(private readonly loopContext: LoopContext) {}

  public evaluate(
    node: ForStatement,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const loopEnv = context.newScope(env, true);
    this.loopContext.enterLoop();
    let result = NullObject.INSTANCE;

    try {
      const initResult = context.evaluate(node.initializer, loopEnv);
      if (ObjectValidator.isError(initResult)) {
        return initResult;
      }

      while (true) {
        if (this.loopContext.isMaxIterationsReached()) {
          return new ErrorObject(
            `Maximum iterations (${LoopContext.getMaxIterations()}) reached for loop`
          );
        }

        const condition = context.evaluate(node.condition, loopEnv);
        if (ObjectValidator.isError(condition)) {
          return condition;
        }

        if (!condition.isTruthy()) {
          break;
        }

        result = context.evaluate(node.body, loopEnv);

        if (
          ObjectValidator.isReturnValue(result) ||
          ObjectValidator.isError(result)
        ) {
          return result;
        }

        const updateResult = context.evaluate(node.increment, loopEnv);
        if (ObjectValidator.isError(updateResult)) {
          return updateResult;
        }

        if (ObjectValidator.isBreak(result)) {
          break;
        }

        if (ObjectValidator.isContinue(result)) {
          continue;
        }
      }
    } finally {
      this.loopContext.exitLoop();
    }

    return this.processLoopResult(result);
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
