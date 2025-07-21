import { Statement } from "../ast";
import { Token } from "@/lang/token/token";

/**
 * Represents a break statement in the AST.
 */
export class BreakStatement extends Statement {
  constructor(startToken: Token, endToken: Token) {
    super(startToken, endToken);
  }

  toString(): string {
    return "break;";
  }

  whatIam() {
    return {
      name: "BreakStatement",
      description:
        "A break statement is a statement that is used to break out of a loop.",
    };
  }
}

/**
 * Represents a continue statement in the AST.
 */
export class ContinueStatement extends Statement {
  constructor(startToken: Token, endToken: Token) {
    super(startToken, endToken);
  }

  toString(): string {
    return "continue;";
  }

  whatIam() {
    return {
      name: "ContinueStatement",
      description:
        "A continue statement is a statement that is used to skip the rest of the current iteration of a loop.",
    };
  }
}
