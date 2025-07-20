import { Token } from "@/lang/token/token";
import { Expression, Statement } from "../ast";
import { Identifier } from "../expressions";

/**
 * Represents a let statement in the AST.
 */
export class LetStatement extends Statement {
  readonly name: Identifier;
  readonly value: Expression;

  constructor(token: Token, name: Identifier, value: Expression) {
    super(token);
    this.name = name;
    this.value = value;
  }

  toString(): string {
    const varName = this.name.toString();
    const value = this.value.toString();
    return `${this.tokenLiteral()} ${varName} = ${value};`;
  }

  whatIam() {
    return {
      name: "LetStatement",
      description:
        "A let statement is a statement that declares a variable. It is used to declare a variable and assign a value to it.",
    };
  }
}
