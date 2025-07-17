import {
  NodeEvaluator,
  EvaluationContext,
  ObjectValidator,
} from "@/lang/exec/core";
import { FStringLiteral } from "@/lang/ast/literal";
import {
  Environment,
  StringObject,
  ErrorObject,
  BaseObject,
  IntegerObject,
  BooleanObject,
  NullObject,
} from "@/lang/exec/objects";

/**
 * 🎯 FStringLiteralEvaluator - F-String Interpolation Specialist 🎯
 *
 * Evaluates f-string literals by interpolating expressions into static text.
 *
 * From first principles, f-string evaluation works like this:
 * 1. Evaluate each embedded expression to get its value
 * 2. Convert each value to its string representation
 * 3. Interleave static text with expression results
 * 4. Concatenate everything into the final string
 *
 * Example evaluation process:
 * - f"Hello {name}!" with name="Alice"
 * - Static parts: ["Hello ", "!"]
 * - Expressions: [name] → ["Alice"]
 * - Result: "Hello " + "Alice" + "!" = "Hello Alice!"
 *
 * Error handling:
 * - If any expression evaluation fails, return the error
 * - If any value can't be converted to string, return error
 * - Otherwise, return the interpolated string
 */
export class FStringLiteralEvaluator implements NodeEvaluator<FStringLiteral> {
  evaluate(node: FStringLiteral, env: Environment, context: EvaluationContext) {
    const { actualStrings, expressions } = node;

    if (node.isOnlyStaticString()) {
      return new StringObject(actualStrings[0]);
    }

    const expressionValues: string[] = Array(expressions.length);
    for (let i = 0; i < expressions.length; i++) {
      const result = context.evaluate(expressions[i], env);
      if (ObjectValidator.isError(result)) {
        return new ErrorObject(
          `Error evaluating expression in f-string: ${result.message}`
        );
      }
      expressionValues[i] = this.convertToString(result);
    }

    const parts: string[] = [];
    for (let i = 0; i < expressions.length; i++) {
      parts.push(actualStrings[i], expressionValues[i]);
    }
    parts.push(actualStrings[actualStrings.length - 1]);

    const result = parts.join("");

    return new StringObject(result);
  }

  /**
   * 🔄 Converts any BaseObject to its string representation
   */
  private convertToString(obj: BaseObject): string {
    if (obj == null) {
      return "null";
    }

    switch (true) {
      case obj instanceof StringObject:
        return obj.value;
      case obj instanceof IntegerObject:
        return obj.value.toString();
      case obj instanceof BooleanObject:
        return obj.value ? "true" : "false";
      case obj instanceof NullObject:
        // Null becomes "null"
        return "null";
      case ObjectValidator.isBuiltin(obj):
        // Built-in functions show their name
        return `<builtin function: ${obj.name}>`;
      default:
        return (obj as BaseObject).inspect();
    }
  }
}
