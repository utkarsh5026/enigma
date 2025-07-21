import type { NodeEvaluator } from "@/lang/exec/core";
import { FloatLiteral } from "@/lang/ast";
import { FloatObject } from "@/lang/exec/objects";

/**
 * 🌊 FloatLiteralEvaluator - Decimal Number Specialist
 *
 * Evaluates floating-point literal expressions into runtime float objects.
 * Handles decimal numbers with fractional parts for precise calculations
 * involving real numbers.
 *
 * @example
 * - Simple decimals: 3.14, 2.718, 0.5
 * - Scientific notation: 1.23e-4, 9.81e2
 * - Financial values: 19.99, 1000.50
 * - Mathematical constants: 3.141592653589793
 */
export class FloatLiteralEvaluator implements NodeEvaluator<FloatLiteral> {
  public evaluate(node: FloatLiteral) {
    const value = node.value;
    const result = new FloatObject(value);
    return result;
  }
}
