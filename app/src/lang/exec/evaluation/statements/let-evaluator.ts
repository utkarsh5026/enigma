import { LetStatement } from "@/lang/ast/statement";
import {
  EvaluationContext,
  NodeEvaluator,
  ObjectValidator,
  Environment,
  BaseObject,
} from "@/lang/exec/core";

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

    if (env.containsVariableLocally(varName)) {
      const error = context.createError(
        `variable '${varName}' already declared in this scope`,
        node.name.position()
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

      return context.createError(
        `error evaluating expression for variable '${varName}': ${value.message}`,
        node.value.position()
      );
    }

    env.defineVariable(varName, value);

    context.addAfterStep(
      node,
      env,
      value,
      `Variable "${varName}" declared with value: ${value.inspect()}`
    );
    return value;
  }
}
