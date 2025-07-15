import { NodeEvaluator, EvaluationContext } from "../../core/interfaces";
import { BlockStatement } from "@/lang/ast";
import { Environment, BaseObject, NullObject } from "../../objects";
import { ObjectValidator } from "../validate";

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
