import { Token } from "@/lang/token/token";
import { Expression, Statement } from "../ast";

/**
 * Represents a return statement in the AST.
 */
export class ReturnStatement extends Statement {
  returnValue: Expression;

  constructor(startToken: Token, returnValue: Expression, endToken: Token) {
    super(startToken, endToken);
    this.returnValue = returnValue;
  }

  toString(): string {
    const value = this.returnValue.toString();
    return `${this.tokenLiteral()} ${value};`;
  }

  whatIam() {
    return {
      name: "ReturnStatement",
      description:
        "A return statement is a statement that is used to return a value from a function.",
    };
  }
}
