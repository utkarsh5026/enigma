import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * Represents an array literal in the AST.
 */
export class ArrayLiteral extends Expression {
  elements: Expression[];

  constructor(token: Token, elements: Expression[]) {
    super(token);
    this.elements = elements;
  }

  toString(): string {
    const elements = this.elements.map((e) => e.toString()).join(", ");
    return `[${elements}]`;
  }
}
