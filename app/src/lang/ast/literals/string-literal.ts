import { Position, Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * Represents a string literal in the AST.
 */
export class StringLiteral extends Expression {
  value: string;

  constructor(token: Token, value: string, endToken: Token | null) {
    super(token, endToken);
    this.value = value;
  }

  /**
   * Returns a string representation of the StringLiteral.
   * @returns The literal value of the token.
   */
  toString(): string {
    return this.token.literal;
  }

  whatIam() {
    return {
      name: "StringLiteral",
      description:
        "A string literal is an expression that is used to represent a string value.",
    };
  }

  nodeRange(): { start: Position; end: Position } {
    const start = this.token.start();
    return {
      start: { ...start, column: start.column - 2 }, // quotations marks
      end: this.endToken?.position ?? this.token.position,
    };
  }
}
