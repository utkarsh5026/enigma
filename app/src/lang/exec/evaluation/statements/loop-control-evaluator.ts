/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeEvaluator, EvaluationContext } from "../../core/interfaces";
import { BreakStatement, ContinueStatement } from "@/lang/ast";
import {
  Environment,
  BaseObject,
  BreakObject,
  ContinueObject,
} from "../../objects";

/**
 * 📦 BreakStatementEvaluator - The Break Statement Expert 📦
 *
 * This evaluator handles the evaluation of break statements.
 * It's like a conductor who leads a symphony!
 */
export class BreakStatementEvaluator implements NodeEvaluator<BreakStatement> {
  evaluate(
    node: BreakStatement,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
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
    return ContinueObject.INSTANCE;
  }
}
