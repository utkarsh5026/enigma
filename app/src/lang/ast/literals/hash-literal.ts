import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * Represents a hash literal (key-value pairs) in the AST.
 */
export class HashLiteral extends Expression {
  pairs: Map<string, Expression>;

  constructor(
    token: Token,
    pairs: Map<string, Expression>,
    endToken: Token | null
  ) {
    super(token, endToken);
    this.pairs = pairs;
  }

  /**
   * Returns a string representation of the HashLiteral.
   * @returns A string representation of the hash, with key-value pairs separated by commas.
   */
  toString(): string {
    const pairs = Array.from(this.pairs.entries())
      .map(([key, value]) => {
        const keyStr = key.toString();
        const valueStr = value.toString();
        return `${keyStr}:${valueStr}`;
      })
      .join(", ");
    return `{${pairs}}`;
  }

  whatIam() {
    return {
      name: "HashLiteral",
      description:
        "A hash literal is an expression that is used to create a hash (key-value pairs).",
    };
  }
}
