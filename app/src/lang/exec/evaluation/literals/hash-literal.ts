import { HashLiteral } from "@/lang/ast";
import { HashObject } from "@/lang/exec/objects";
import {
  EvaluationContext,
  NodeEvaluator,
  Environment,
  BaseObject,
} from "@/lang/exec/core";
import { ObjectValidator } from "@/lang/exec/core";

/**
 * 🗺️ HashLiteralEvaluator - Key-Value Mapping Builder
 *
 * Evaluates hash literal expressions into runtime hash objects. Creates
 * dictionary-like structures that map string keys to arbitrary values,
 * enabling structured data storage and retrieval.
 *
 * @example
 * - Empty hash: {}
 * - Simple mapping: {"name": "Alice", "age": 30}
 * - Nested structures: {"person": {"name": "Bob"}, "scores": [95, 87]}
 * - Configuration objects: {"debug": true, "timeout": 5000, "retries": 3}
 */
export class HashLiteralEvaluator implements NodeEvaluator<HashLiteral> {
  public evaluate(
    node: HashLiteral,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const pairs: Map<string, BaseObject> = new Map();

    context.addBeforeStep(node, env, `Evaluating hash literal`);
    for (const [key, value] of node.pairs) {
      const evaluatedValue = context.evaluate(value, env);

      if (ObjectValidator.isError(evaluatedValue)) {
        context.addAfterStep(
          node,
          env,
          evaluatedValue,
          `Error evaluating hash literal: ${evaluatedValue.message}`
        );
        return evaluatedValue;
      }

      context.addAfterStep(
        node,
        env,
        evaluatedValue,
        `Hash literal evaluated: ${evaluatedValue.inspect()}`
      );
      pairs.set(key, evaluatedValue);
    }

    return new HashObject(pairs);
  }
}
