import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

export class NullLiteral extends Expression {
  constructor(token: Token) {
    super(token);
  }

  toString(): string {
    return "null";
  }
}
