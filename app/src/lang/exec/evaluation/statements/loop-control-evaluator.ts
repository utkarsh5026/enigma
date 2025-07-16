import { NodeEvaluator } from "@/lang/exec/core";
import { BreakStatement, ContinueStatement } from "@/lang/ast";
import { BaseObject, BreakObject, ContinueObject } from "@/lang/exec/objects";

/**
 * 📦 BreakStatementEvaluator - The Break Statement Expert 📦
 *
 * This evaluator handles the evaluation of break statements.
 * It's like a conductor who leads a symphony!
 */
export class BreakStatementEvaluator implements NodeEvaluator<BreakStatement> {
  public evaluate(): BaseObject {
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
  evaluate(): BaseObject {
    return ContinueObject.INSTANCE;
  }
}
