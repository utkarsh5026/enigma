import { HashLiteral } from "@/lang/ast";
import { Environment, BaseObject, HashObject } from "@/lang/exec/objects";
import { EvaluationContext, NodeEvaluator } from "@/lang/exec/core";
import { ObjectValidator } from "../validate";

export class HashLiteralEvaluator implements NodeEvaluator<HashLiteral> {
  public evaluate(
    node: HashLiteral,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const pairs: Map<string, BaseObject> = new Map();

    for (const [key, value] of node.pairs) {
      const evaluatedValue = context.evaluate(value, env);

      if (ObjectValidator.isError(evaluatedValue)) {
        return evaluatedValue;
      }

      pairs.set(key, evaluatedValue);
    }

    return new HashObject(pairs);
  }
}
