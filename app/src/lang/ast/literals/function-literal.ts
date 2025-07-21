import { Expression } from "../ast";
import { BlockStatement } from "../statements";
import { Token } from "@/lang/token/token";
import { Identifier } from "../expressions";

export class FunctionLiteral extends Expression {
  readonly parameters: Identifier[];
  readonly body: BlockStatement;

  constructor(
    token: Token,
    parameters: Identifier[],
    body: BlockStatement,
    endToken: Token | null
  ) {
    super(token, endToken);
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

  whatIam() {
    return {
      name: "FunctionLiteral",
      description:
        "A function literal is an expression that is used to create a function.",
    };
  }
}
