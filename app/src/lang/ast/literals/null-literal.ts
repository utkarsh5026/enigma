import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

export class NullLiteral extends Expression {
  constructor(token: Token, endToken: Token | null) {
    super(token, endToken);
  }

  toString(): string {
    return "null";
  }

  whatIam() {
    return {
      name: "NullLiteral",
      description:
        "A null literal is an expression that is used to represent a null value.",
    };
  }
}
