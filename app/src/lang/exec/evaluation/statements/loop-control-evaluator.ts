import {
  EvaluationContext,
  NodeEvaluator,
  Environment,
  BaseObject,
} from "@/lang/exec/core";
import { BreakStatement, ContinueStatement } from "@/lang/ast";
import { BreakObject, ContinueObject } from "@/lang/exec/objects";

/**
 * 📦 BreakStatementEvaluator - The Break Statement Expert 📦
 *
 * This evaluator handles the evaluation of break statements.
 * It's like a conductor who leads a symphony!
 */
export class BreakStatementEvaluator implements NodeEvaluator<BreakStatement> {
  public evaluate(
    node: BreakStatement,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    context.addAfterStep(
      node,
      env,
      BreakObject.INSTANCE,
      `Break statement evaluated`
    );
    return BreakObject.INSTANCE;
  }
}

/**
 * 📦 ContinueStatementEvaluator - The Continue Statement Expert 📦
 *
 * This evaluator handles the evaluation of continue statements.
 * It's like a conductor who leads a symphony!
 */
export class ContinueStatementEvaluator
  implements NodeEvaluator<ContinueStatement>
{
  evaluate(
    node: ContinueStatement,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    context.addAfterStep(
      node,
      env,
      ContinueObject.INSTANCE,
      `Continue statement evaluated`
    );
    return ContinueObject.INSTANCE;
  }
}
