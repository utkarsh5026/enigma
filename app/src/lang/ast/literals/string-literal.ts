import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * Represents a string literal in the AST.
 */
export class StringLiteral extends Expression {
  value: string;

  constructor(token: Token, value: string) {
    super(token);
    this.value = value;
  }

  /**
   * Returns a string representation of the StringLiteral.
   * @returns The literal value of the token.
   */
  toString(): string {
    return this.token.literal;
  }
}
