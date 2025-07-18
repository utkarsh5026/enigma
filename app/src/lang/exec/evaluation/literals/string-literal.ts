import {
  EvaluationContext,
  NodeEvaluator,
  Environment,
  BaseObject,
} from "@/lang/exec/core";
import { StringLiteral } from "@/lang/ast";
import { StringObject } from "@/lang/exec/objects";

/**
 * 📝 StringLiteralEvaluator - Text Value Processor
 *
 * Evaluates string literal expressions into runtime string objects.
 * Handles sequences of characters used for text representation,
 * messages, identifiers, and textual data processing.
 *
 * @example
 * - Simple text: "Hello World"
 * - Empty strings: ""
 * - Multi-word: "The quick brown fox"
 * - Special characters: "Line 1\nLine 2\tTabbed"
 * - Quoted content: "She said 'Hello' to me"
 */
export class StringLiteralEvaluator implements NodeEvaluator<StringLiteral> {
  public evaluate(
    node: StringLiteral,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const stringObject = new StringObject(node.value);
    context.addAfterStep(
      node,
      env,
      stringObject,
      `String literal evaluated: "${node.value}"`
    );
    return stringObject;
  }
}
