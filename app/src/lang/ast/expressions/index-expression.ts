import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * Represents an index expression in the AST.
 * This is used for accessing elements in arrays or other indexable structures.
 */
export class IndexExpression extends Expression {
  constructor(
    token: Token,
    public readonly left: Expression,
    public readonly index: Expression
  ) {
    super(token);
  }

  toString(): string {
    return `(${this.left.toString()}[${this.index.toString()}])`;
  }
}
