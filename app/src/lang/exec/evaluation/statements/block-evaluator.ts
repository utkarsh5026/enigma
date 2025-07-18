import {
  NodeEvaluator,
  EvaluationContext,
  ObjectValidator,
  Environment,
  BaseObject,
} from "@/lang/exec/core";
import { BlockStatement } from "@/lang/ast";
import { NullObject } from "../../objects";

/**
 * 📦 BlockEvaluator - The Block Statement Expert 📦
 *
 * This evaluator handles the evaluation of block statements.
 * It's like a conductor who leads a symphony!
 */
export class BlockEvaluator implements NodeEvaluator<BlockStatement> {
  evaluate(
    node: BlockStatement,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const newEnv = context.newScope(env, true);

    let result: BaseObject = NullObject.INSTANCE;
    for (const statement of node.statements) {
      result = context.evaluate(statement, newEnv);

      if (
        ObjectValidator.isError(result) ||
        ObjectValidator.isBreak(result) ||
        ObjectValidator.isContinue(result) ||
        ObjectValidator.isReturnValue(result)
      ) {
        break;
      }
    }

    return result;
  }
}
