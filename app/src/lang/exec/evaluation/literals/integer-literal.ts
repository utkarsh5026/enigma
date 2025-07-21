import type { NodeEvaluator, BaseObject } from "@/lang/exec/core";
import type { IntegerLiteral } from "@/lang/ast";
import { IntegerObject } from "@/lang/exec/objects";

/**
 * 🔢 IntegerLiteralEvaluator - Whole Number Processor
 *
 * Evaluates integer literal expressions into runtime integer objects.
 * Handles whole numbers without fractional parts, used for counting,
 * indexing, and mathematical operations requiring exact values.
 *
 * @example
 * - Positive integers: 1, 42, 1000, 999999
 * - Zero: 0
 * - Negative integers: -1, -42, -1000
 * - Array indices: arr[0], arr[5], arr[length-1]
 */
export class IntegerLiteralEvaluator implements NodeEvaluator<IntegerLiteral> {
  public evaluate(node: IntegerLiteral): BaseObject {
    const integerObject = new IntegerObject(node.value);
    return integerObject;
  }
}
