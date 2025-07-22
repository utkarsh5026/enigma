import { Token } from "@/lang/token/token";
import { Statement } from "../ast";

/**
 * Represents a block statement in the AST.
 */
export class BlockStatement extends Statement {
  statements: Statement[];

  constructor(startToken: Token, statements: Statement[], endToken: Token) {
    super(startToken, endToken);
    this.statements = statements;
  }

  toString(): string {
    return `{${this.statements
      .map((s) => s.toString())
      .join(" ")
      .substring(0, 12)}...}`;
  }

  whatIam() {
    return {
      name: "BlockStatement",
      description:
        "A block statement is a statement that is used to group a list of statements.",
    };
  }
}
