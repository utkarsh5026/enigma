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
    super(token);
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

  /**
   * Returns the range of the identifier.
   * The value is the just the length of the identifier
   */
  nodeRange(): { start: Position; end: Position } {
    const pos = this.position();
    const start = { ...pos, column: pos.column - this.value.length };
    const end = { ...pos, column: pos.column };
    return { start, end };
  }
}
