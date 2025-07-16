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
    this.loopContext.enterLoop();
    let result = NullObject.INSTANCE;

    try {
      while (true) {
        if (this.loopContext.isMaxIterationsReached()) {
          return new ErrorObject(
            `Maximum iterations (${LoopContext.getMaxIterations()}) reached for loop`
          );
        }

        const condition = context.evaluate(node.condition, env);
        if (ObjectValidator.isError(condition)) {
          return condition;
        }

        if (!condition.isTruthy()) {
          break;
        }

        result = context.evaluate(node.body, env);
        if (ObjectValidator.isError(result)) {
          return result;
        }

        if (ObjectValidator.isReturnValue(result)) {
          return result;
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
