import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * Represents a boolean expression in the AST.
 */
export class BooleanLiteral extends Expression {
  constructor(token: Token, public readonly value: boolean) {
    super(token);
  }

  toString(): string {
    return this.token.literal;
  }
}
