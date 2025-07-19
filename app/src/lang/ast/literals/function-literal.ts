import { Expression, Identifier } from "../ast";
import { BlockStatement } from "../statement";
import { Token } from "@/lang/token/token";

export class FunctionLiteral extends Expression {
  readonly parameters: Identifier[];
  readonly body: BlockStatement;

  constructor(token: Token, parameters: Identifier[], body: BlockStatement) {
    super(token);
    this.parameters = parameters;
    this.body = body;
  }

  toString(): string {
    const statements = this.body.statements.map((s) => s.toString()).join("\n");
    return `${this.functionSignature()} { \n${statements}\n}`;
  }

  functionSignature(): string {
    const params = this.parameters.map((p) => p.toString()).join(", ");
    return `${this.tokenLiteral()}(${params})`;
  }
}
