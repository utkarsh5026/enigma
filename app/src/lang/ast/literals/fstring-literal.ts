import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * Represents a f-string literal in the AST.
 * like f"Hello my name is {name}"
 */
export class FStringLiteral extends Expression {
  constructor(
    token: Token,
    public readonly actualStrings: string[],
    public readonly expressions: Expression[]
  ) {
    super(token);
  }

  toString(): string {
    if (this.expressions.length === 0) {
      return `f"${this.actualStrings[0]}"`;
    }
    const parts: string[] = [];

    for (let i = 0; i < this.expressions.length; i++) {
      parts.push(this.actualStrings[i]);
      parts.push(`{${this.expressions[i].toString()}}`);
    }

    parts.push(this.actualStrings[this.actualStrings.length - 1]);
    parts.push('"');

    return parts.join("");
  }

  public isOnlyStaticString(): boolean {
    return this.expressions.length === 0 && this.actualStrings.length === 1;
  }

  whatIam() {
    return {
      name: "FStringLiteral",
      description:
        "A f-string literal is an expression that is used to create a formatted string. It is used to embed variables or expressions within a string.",
    };
  }
}
