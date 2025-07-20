import { Token } from "@/lang/token/token";
import { Expression } from "../ast";

/**
 * 📞 CallExpression - Function Invocation AST Node
 *
 * Represents function call operations that invoke callable objects with
 * provided arguments. Handles both built-in function calls and user-defined
 * function invocations with parameter passing and return value handling.
 *
 * @example
 * - Built-in functions: print("Hello"), len(myArray), max(5, 10)
 * - User functions: calculateTotal(items), processData(input)
 * - Method calls: object.method(), this.doSomething()
 * - Nested calls: getUser(getCurrentId()).getName()
 */
export class CallExpression extends Expression {
  constructor(
    token: Token,
    public readonly func: Expression,
    public readonly args: Expression[]
  ) {
    super(token);
  }

  toString(): string {
    const args = this.args.map((a) => a.toString()).join(", ");
    return `${this.func.toString()}(${args})`;
  }

  whatIam() {
    return {
      name: "CallExpression",
      description:
        "A call expression is an expression that is used to call a function or method.",
    };
  }
}
