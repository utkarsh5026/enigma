import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * Represents a float literal in the AST.
 */
export class FloatLiteral extends Expression {
  constructor(
    token: Token,
    public readonly value: number,
    endToken: Token | null
  ) {
    super(token, endToken);
  }

  public isWholeNumber(): boolean {
    return this.value == Math.floor(this.value);
  }

  toString(): string {
    if (Number.isNaN(this.value)) {
      return "NaN";
    }
    if (!Number.isFinite(this.value)) {
      return this.value > 0 ? "Infinity" : "-Infinity";
    }
    let str = this.value.toString();

    if (
      this.isWholeNumber() &&
      !str.includes(".") &&
      !str.includes("E") &&
      !str.includes("e")
    ) {
      str += ".0";
    }

    return str;
  }

  whatIam() {
    return {
      name: "FloatLiteral",
      description:
        "A float literal is an expression that is used to represent a floating-point number.",
    };
  }
}
