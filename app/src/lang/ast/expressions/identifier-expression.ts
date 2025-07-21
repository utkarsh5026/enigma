import { Expression } from "../ast";
import type { Token, Position } from "@/lang/token/token";

/**
 * Represents an identifier in the AST.
 */
export class Identifier extends Expression {
  /**
   * The value of the identifier.
   */
  value: string;

  /**
   * Creates a new Identifier instance.
   * @param {Token} token - The token associated with this identifier.
   * @param {string} value - The value of the identifier.
   */
  constructor(token: Token, value: string) {
    super(token, token);
    this.value = value;
  }

  /**
   * Marker method to identify this node as an expression.
   */
  expressionNode() {}

  /**
   * Returns the literal value of the token associated with this identifier.
   * @returns {string} The token's literal value.
   */
  tokenLiteral(): string {
    return this.token.literal;
  }

  /**
   * Returns a string representation of the identifier.
   * @returns {string} The value of the identifier.
   */
  toString(): string {
    return this.value;
  }

  position(): Position {
    return this.token.position;
  }

  whatIam(): { name: string; description: string } {
    return {
      name: "Identifier",
      description:
        "An identifier is a name for a variable or function. It is used to reference a variable or function in the code.",
    };
  }
}
