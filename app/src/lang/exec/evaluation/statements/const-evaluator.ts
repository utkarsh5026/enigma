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
    context.addBeforeStep(node, env, `Evaluating const statement ${varName}`);

    if (env.containsVariableLocally(varName)) {
      const error = context.createError(
        `variable '${varName}' already declared in this scope`,
        node.name.position()
      );
      context.addAfterStep(
        node,
        env,
        error,
        `Error: variable '${varName}' already declared in this scope`
      );
      return error;
    }

    const value = context.evaluate(node.value, env);

    if (ObjectValidator.isError(value)) {
      const error = context.createError(
        `error evaluating expression for variable '${varName}': ${value.message}`,
        node.value.position()
      );
      context.addAfterStep(
        node,
        env,
        error,
        `Error: error evaluating expression for variable '${varName}': ${value.message}`
      );
      return error;
    }

    env.defineConstant(varName, value);

    context.addAfterStep(
      node,
      env,
      value,
      `Const statement evaluated: ${varName} = ${value.inspect()}`
    );
    return value;
  }
}
