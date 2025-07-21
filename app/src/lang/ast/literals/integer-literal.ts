import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * Represents an integer literal in the AST.
 */
export class IntegerLiteral extends Expression {
  value: number;

  /**
   * Creates a new IntegerLiteral instance.
   * @param token The token associated with this literal.
   * @param value The numeric value of the integer.
   */
  constructor(token: Token, value: number, endToken: Token | null) {
    super(token, endToken);
    this.value = value;
  }

  /**
   * Returns a string representation of the IntegerLiteral.
   * @returns A string representation of the integer value.
   */
  toString(): string {
    return this.value.toString();
  }

  whatIam() {
    return {
      name: "IntegerLiteral",
      description:
        "An integer literal is an expression that is used to represent an integer number.",
    };
  }
}
