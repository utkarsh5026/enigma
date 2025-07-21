import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * Represents an array literal in the AST.
 */
export class ArrayLiteral extends Expression {
  elements: Expression[];

  constructor(token: Token, elements: Expression[], endToken: Token | null) {
    super(token, endToken);
    this.elements = elements;
  }

  toString(): string {
    const elements = this.elements.map((e) => e.toString()).join(", ");
    return `[${elements}]`;
  }

  whatIam() {
    return {
      name: "ArrayLiteral",
      description:
        "An array literal is an expression that is used to create an array.",
    };
  }
}
