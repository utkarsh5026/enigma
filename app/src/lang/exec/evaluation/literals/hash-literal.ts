import { HashLiteral } from "@/lang/ast";
import { Environment, BaseObject, HashObject } from "@/lang/exec/objects";
import { EvaluationContext, NodeEvaluator } from "@/lang/exec/core";
import { ObjectValidator } from "../../core/validate";

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
