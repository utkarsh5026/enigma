import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * Represents a boolean expression in the AST.
 */
export class BooleanLiteral extends Expression {
  constructor(
    token: Token,
    public readonly value: boolean,
    endToken: Token | null
  ) {
    super(token, endToken);
  }

  toString(): string {
    return this.token.literal;
  }

  whatIam() {
    return {
      name: "BooleanLiteral",
      description:
        "A boolean literal is an expression that is used to represent a boolean value.",
    };
  }
}
