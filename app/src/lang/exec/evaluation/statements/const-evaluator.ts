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

    if (env.has(varName)) {
      return new ErrorObject(
        `variable '${varName}' already declared in this scope`
      );
    }

    const value = context.evaluate(node.value, env);

    if (ObjectValidator.isError(value)) {
      return new ErrorObject(
        `error evaluating expression for variable '${varName}': ${value.message}`
      );
    }

    env.set(varName, value);
    return value;
  }
}
