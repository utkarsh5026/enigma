import { NodeEvaluator, BaseObject } from "@/lang/exec/core";
import { BooleanLiteral } from "@/lang/ast";
import { BooleanObject } from "@/lang/exec/objects";

/**
 * ✅ BooleanLiteralEvaluator - Truth Value Processor
 *
 * Evaluates boolean literal expressions into runtime boolean objects.
 * Handles the fundamental true/false values used in logical operations
 * and conditional statements.
 *
 * @example
 * - Literal true value: true
 * - Literal false value: false
 * - Used in conditions: if true then... else...
 * - Used in assignments: let isReady = true
 */
export class BooleanLiteralEvaluator implements NodeEvaluator<BooleanLiteral> {
  public evaluate(node: BooleanLiteral): BaseObject {
    const booleanObject = new BooleanObject(node.value);
    return booleanObject;
  }
}
