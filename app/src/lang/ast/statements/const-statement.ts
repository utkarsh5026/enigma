import { Token } from "@/lang/token/token";
import { Expression, Statement } from "../ast";
import { Identifier } from "../expressions/identifier-expression";

/**
 * Represents a const statement in the AST.
 */
export class ConstStatement extends Statement {
  readonly name: Identifier;
  readonly value: Expression;

  constructor(token: Token, name: Identifier, value: Expression) {
    super(token);
    this.name = name;
    this.value = value;
  }

  toString(): string {
    return `const ${this.name.toString()} = ${this.value.toString()};`;
  }

  whatIam() {
    return {
      name: "ConstStatement",
      description:
        "A const statement is a statement that declares a constant variable.",
    };
  }
}
