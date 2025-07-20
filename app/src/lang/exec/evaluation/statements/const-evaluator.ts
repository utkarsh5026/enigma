import {
  NodeEvaluator,
  EvaluationContext,
  ObjectValidator,
  Environment,
  BaseObject,
} from "@/lang/exec/core";
import { ConstStatement } from "@/lang/ast";

export class ConstEvaluator implements NodeEvaluator<ConstStatement> {
  evaluate(
    node: ConstStatement,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const varName = node.name.value;

    if (env.containsVariableLocally(varName)) {
      const error = context.createError(
        `variable '${varName}' already declared in this scope`,
        node.name.position()
      );
      return error;
    }

    const value = context.evaluate(node.value, env);

    if (ObjectValidator.isError(value)) {
      return value;
    }

    env.defineConstant(varName, value);
    return value;
  }
}
