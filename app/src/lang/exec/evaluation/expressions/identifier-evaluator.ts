import { EvaluationContext, NodeEvaluator } from "@/lang/exec/core";
import { Identifier } from "@/lang/ast/ast";
import { Environment, BaseObject, ErrorObject } from "@/lang/exec/objects";
import { isBuiltin, getBuiltin } from "@/lang/exec/builtins";

export class IndentifierEvaluator implements NodeEvaluator<Identifier> {
  public evaluate(
    node: Identifier,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    context.addBeforeStep(node, env, `Evaluating identifier: ${node.value}`);
    const value = env.get(node.value);
    if (value !== null) {
      context.addAfterStep(
        node,
        env,
        value,
        `Identifier found: ${value.inspect()}`
      );
      return value;
    }

    if (isBuiltin(node.value)) {
      context.addBeforeStep(
        node,
        env,
        `Evaluating builtin identifier: ${node.value}`
      );
      const result = getBuiltin(node.value) as BaseObject;
      context.addAfterStep(
        node,
        env,
        result,
        `Builtin identifier found: ${result.inspect()}`
      );
    }

    return new ErrorObject(`identifier not found: ${node.value}`);
  }
}
