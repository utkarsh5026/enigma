import { LetStatement } from "@/lang/ast";
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

    env.defineVariable(varName, value);
    return value;
  }
}
