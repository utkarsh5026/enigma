import { NodeEvaluator, EvaluationContext } from "../../core/interfaces";
import { ConstStatement } from "@/lang/ast";
import { Environment, BaseObject, ErrorObject } from "../../objects";
import { ObjectValidator } from "../../core/validate";

export class ConstEvaluator implements NodeEvaluator<ConstStatement> {
  evaluate(
    node: ConstStatement,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const varName = node.name.value;
    context.addBeforeStep(node, env, `Evaluating const statement ${varName}`);

    if (env.has(varName)) {
      context.addAfterStep(
        node,
        env,
        new ErrorObject(`variable '${varName}' already declared in this scope`),
        `Error: variable '${varName}' already declared in this scope`
      );
      return new ErrorObject(
        `variable '${varName}' already declared in this scope`
      );
    }

    const value = context.evaluate(node.value, env);

    if (ObjectValidator.isError(value)) {
      const error = new ErrorObject(
        `error evaluating expression for variable '${varName}': ${value.message}`
      );
      context.addAfterStep(
        node,
        env,
        error,
        `Error: error evaluating expression for variable '${varName}': ${value.message}`
      );
      return error;
    }

    env.set(varName, value);

    context.addAfterStep(
      node,
      env,
      value,
      `Const statement evaluated: ${varName} = ${value.inspect()}`
    );
    return value;
  }
}
