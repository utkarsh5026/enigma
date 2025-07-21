import { Operator, Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * ⚡ InfixExpression - Binary Operation AST Node
 *
 * Represents binary operations that combine two operands with an operator.
 * Handles arithmetic calculations, logical comparisons, string operations,
 * and boolean logic with proper operator precedence and type handling.
 *
 * @example
 * - Arithmetic: 5 + 3, total * tax, balance - withdrawal
 * - Comparisons: age >= 18, score == 100, name != "admin"
 * - Logical: isActive && hasPermission, isGuest || isAdmin
 * - String operations: firstName + " " + lastName, "Hello" == greeting
 */
export class InfixExpression extends Expression {
  constructor(
    token: Token,
    public readonly left: Expression,
    public readonly operator: Operator,
    public readonly right: Expression,
    endToken: Token | null
  ) {
    super(token, endToken);
  }

  toString(): string {
    const left = this.left.toString();
    const right = this.right.toString();
    return `(${left} ${this.operator} ${right})`;
  }

  whatIam() {
    return {
      name: "InfixExpression",
      description:
        "An infix expression is an expression that is in between two operands. It is used to perform a binary operation. For example, `5 + 3` or `isActive && hasPermission`.",
    };
  }
}
