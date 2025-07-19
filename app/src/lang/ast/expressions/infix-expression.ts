import { Operator, Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * Represents an infix expression in the AST.
 */
export class InfixExpression extends Expression {
  constructor(
    token: Token,
    public readonly left: Expression,
    public readonly operator: Operator,
    public readonly right: Expression
  ) {
    super(token);
  }

  toString(): string {
    const left = this.left.toString();
    const right = this.right.toString();
    return `(${left} ${this.operator} ${right})`;
  }
}
