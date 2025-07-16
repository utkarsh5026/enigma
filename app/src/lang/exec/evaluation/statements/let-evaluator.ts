import { BaseObject, Environment, ErrorObject } from "../../objects";
import { LetStatement } from "@/lang/ast/statement";
import { EvaluationContext, NodeEvaluator } from "../../core/interfaces";
import { ObjectValidator } from "../../core/validate";

/**
 * 📦 LetEvaluator - The Variable Declaration Expert 📦
 *
 * This evaluator handles the creation of new variables in the environment.
 * It's like a librarian who assigns books to shelves!
 *
 * Why we need this:
 * - Variables need to be declared before they can be used
 * - We need to create a new scope for the variables
 * - We need to evaluate the expression to get the value of the variable
 */
export class LetEvaluator implements NodeEvaluator<LetStatement> {
  evaluate(
    node: LetStatement,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const varName = node.name.value;

    context.addBeforeStep(node, env, `Declaring variable "${varName}"`);

    if (env.has(varName)) {
      const error = new ErrorObject(
        `variable '${varName}' already declared in this scope`
      );
      context.addAfterStep(
        node,
        env,
        error,
        `Error: Variable "${varName}" already exists`
      );
      return error;
    }

    const value = context.evaluate(node.value, env);

    if (ObjectValidator.isError(value)) {
      context.addAfterStep(
        node,
        env,
        value,
        `Error evaluating expression for variable "${varName}": ${value.message}`
      );

      return new ErrorObject(
        `error evaluating expression for variable '${varName}': ${value.message}`
      );
    }

    env.set(varName, value);

    context.addAfterStep(
      node,
      env,
      value,
      `Variable "${varName}" declared with value: ${value.inspect()}`
    );
    return value;
  }
}
