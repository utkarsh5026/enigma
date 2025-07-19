import { Token } from "@/lang/token/token";
import { Expression } from "../ast";
import { BlockStatement } from "../statement";

/**
 * Represents an if-else expression in the AST.
 */
export class IfExpression extends Expression {
  constructor(
    token: Token,
    public readonly conditions: Expression[],
    public readonly consequences: BlockStatement[],
    public readonly alternative: BlockStatement | null
  ) {
    super(token);
  }

  toString(): string {
    let out = `if ${this.conditions[0].toString()} ${this.consequences[0].toString()}`;
    for (let i = 1; i < this.conditions.length; i++) {
      out += `elif ${this.conditions[i].toString()} ${this.consequences[
        i
      ].toString()}`;
    }
    if (this.alternative !== null) {
      out += `else ${this.alternative.toString()}`;
    }
    return out;
  }
}
