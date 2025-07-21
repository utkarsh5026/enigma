import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * ➖ PrefixExpression - Unary Operation AST Node
 *
 * Represents unary operations that apply a single operator to one operand.
 * Handles logical negation for boolean values and arithmetic negation for
 * numeric values, providing essential unary transformations.
 *
 * @example
 * - Logical negation: !isActive, !user.hasPermission, !isEmpty
 * - Arithmetic negation: -temperature, -balance, -offset
 * - Boolean conversion: !0, !null, !"", ![]
 * - Sign operations: -positiveNumber, -(-value)
 */
export class PrefixExpression extends Expression {
  readonly operator: string; // 🔄 Operator
  readonly right: Expression; // 🔄 Right operand

  constructor(
    token: Token,
    operator: string,
    right: Expression,
    endToken: Token | null
  ) {
    super(token, endToken);
    this.operator = operator;
    this.right = right;
  }

  /**
   * Returns a string representation of the PrefixExpression.
   * @returns A string representation of the expression.
   */
  toString(): string {
    return `(${this.operator}${this.right.toString()})`;
  }

  whatIam() {
    return {
      name: "PrefixExpression",
      description:
        "A prefix expression is an expression that is prefixed with an operator. It is used to negate a value or perform a logical operation. For example, `!isActive` or `-temperature`.",
    };
  }
}
