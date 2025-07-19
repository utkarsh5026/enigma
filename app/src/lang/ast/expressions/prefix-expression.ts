import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * Represents a prefix expression in the AST.
 */
export class PrefixExpression extends Expression {
  operator: string;
  right: Expression;

  /**
   * Creates a new PrefixExpression instance.
   * @param token The token associated with this expression.
   * @param operator The prefix operator.
   * @param right The expression to the right of the operator.
   */
  constructor(token: Token, operator: string, right: Expression) {
    super(token);
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
}
