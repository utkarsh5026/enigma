import { Token } from "@/lang/token/token";
import { Expression, Statement } from "../ast";

/**
 * Represents an expression statement in the AST.
 */
export class ExpressionStatement extends Statement {
  expression: Expression;

  constructor(startToken: Token, expression: Expression, endToken: Token) {
    super(startToken, endToken);
    this.expression = expression;
  }

  toString(): string {
    return this.expression.toString();
  }

  whatIam() {
    return {
      name: "ExpressionStatement",
      description:
        "An expression statement is a statement that is used to evaluate an expression. It is used to evaluate an expression and return the result.",
    };
  }
}
