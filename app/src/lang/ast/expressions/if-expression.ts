import { Token } from "@/lang/token/token";
import { Expression } from "../ast";
import { BlockStatement } from "../statements";

/**
 * 🔀 IfExpression - Conditional Logic AST Node
 *
 * Represents conditional expressions that evaluate different branches based
 * on boolean conditions. Supports if-else-if chains with multiple conditions
 * and optional else clauses for comprehensive decision-making logic.
 *
 * @example
 * - Simple conditions: if age >= 18 then "adult" else "minor"
 * - Multiple branches: if score >= 90 then "A" else if score >= 80 then "B"
 * - Complex logic: if user.isActive && user.hasPermission then allowAccess
 * - Nested conditions: if weather == "sunny" then if temp > 75 then "beach"
 */
export class IfExpression extends Expression {
  constructor(
    token: Token,
    public readonly conditions: Expression[],
    public readonly consequences: BlockStatement[],
    public readonly alternative: BlockStatement | null,
    endToken: Token | null
  ) {
    super(token, endToken);
  }

  toString(): string {
    let out = `if ${this.conditions[0].toString()} ${this.consequences[0].toString()}`;
    for (let i = 1; i < this.conditions.length; i++) {
      out += `elif ${this.conditions[i].toString()} ${this.consequences[
        i
      ].toString()}`;
    }
    if (this.alternative !== null) {
      out += `else ${this.alternative.toString()}`;
    }
    return out;
  }

  whatIam() {
    return {
      name: "IfExpression",
      description:
        "An if expression is an expression that is used to evaluate a condition and execute a block of code if the condition is true.",
    };
  }
}
