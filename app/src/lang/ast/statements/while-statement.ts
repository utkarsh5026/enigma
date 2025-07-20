import { Token } from "@/lang/token/token";
import { BlockStatement } from "./block-statement";
import { Expression, Statement } from "../ast";

/**
 * Represents a while statement in the AST.
 */
export class WhileStatement extends Statement {
  readonly condition: Expression;
  readonly body: BlockStatement;

  constructor(token: Token, condition: Expression, body: BlockStatement) {
    super(token);
    this.condition = condition;
    this.body = body;
  }

  toString(): string {
    const condition = this.condition.toString();
    let body = "";

    for (const statement of this.body.statements) {
      body += `\t${statement.toString()};\n`;
    }
    return `while (${condition}) {\n${body}\n}`;
  }

  whatIam() {
    return {
      name: "WhileStatement",
      description:
        "A while statement is a statement that is used to execute a block of code while a condition is true.",
    };
  }
}
