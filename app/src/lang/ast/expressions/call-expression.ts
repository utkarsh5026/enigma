import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * Represents a function call expression in the AST.
 * in the function call hello(name)
 */
export class CallExpression extends Expression {
  constructor(
    token: Token,
    public readonly func: Expression,
    public readonly args: Expression[]
  ) {
    super(token);
  }

  toString(): string {
    const args = this.args.map((a) => a.toString()).join(", ");
    return `${this.func.toString()}(${args})`;
  }
}
