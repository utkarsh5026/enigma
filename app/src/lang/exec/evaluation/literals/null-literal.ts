import {
  EvaluationContext,
  NodeEvaluator,
  Environment,
  BaseObject,
} from "@/lang/exec/core";
import { NullLiteral } from "@/lang/ast";
import { NullObject } from "@/lang/exec/objects";

/**
 * ⭕ NullLiteralEvaluator - Absence Value Handler
 *
 * Evaluates null literal expressions into runtime null objects.
 * Represents the intentional absence of any object value, commonly
 * used to indicate "no value" or uninitialized state.
 *
 * @example
 * - Explicit null: null
 * - Uninitialized variables: let data = null
 * - Missing values: {"name": "Alice", "phone": null}
 * - Default returns: functions that don't explicitly return anything
 */
export class NullLiteralEvaluator implements NodeEvaluator<NullLiteral> {
  public evaluate(
    node: NullLiteral,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    context.addAfterStep(
      node,
      env,
      NullObject.INSTANCE,
      `Null literal evaluated`
    );
    return NullObject.INSTANCE;
  }
}
