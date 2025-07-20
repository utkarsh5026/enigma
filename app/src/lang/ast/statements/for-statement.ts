import { Token } from "@/lang/token/token";
import { Statement } from "../ast";
import { Expression } from "../ast";
import { BlockStatement } from "./block-statement";

/**
 * Represents a for statement in the AST.
 */
export class ForStatement extends Statement {
  readonly initializer: Statement;
  readonly condition: Expression;
  readonly increment: Expression;
  readonly body: BlockStatement;

  constructor(
    token: Token,
    initializer: Statement,
    condition: Expression,
    increment: Expression,
    body: BlockStatement
  ) {
    super(token);
    this.initializer = initializer;
    this.condition = condition;
    this.increment = increment;
    this.body = body;
  }

  toString(): string {
    return `for (${this.initializer.toString()}; ${this.condition.toString()}; ${this.increment.toString()}) {\n${this.body.toString()}\n}`;
  }

  whatIam() {
    return {
      name: "ForStatement",
      description:
        "A for statement is a statement that is used to iterate over a block of code a certain number of times.",
    };
  }
}
