import {
  EvaluationContext,
  NodeEvaluator,
  Environment,
  BaseObject,
} from "@/lang/exec/core";
import { Identifier } from "@/lang/ast";
import { isBuiltin, getBuiltin } from "@/lang/exec/builtins";

/**
 * 🏷️ IdentifierEvaluator - Variable Name Resolver
 *
 * Evaluates identifier expressions by looking up variable names in the current
 * environment scope. Resolves user-defined variables, function names, and
 * built-in identifiers to their corresponding runtime values.
 *
 * @example
 * - Variable names: userName, totalScore, isActive
 * - Function references: calculateSum, processInput, validateData
 * - Built-in identifiers: print, len, push, pop
 * - Constant values: PI, MAX_SIZE, DEFAULT_TIMEOUT
 */
export class IndentifierEvaluator implements NodeEvaluator<Identifier> {
  public evaluate(
    node: Identifier,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const value = env.resolveVariable(node.value);
    if (value !== null) {
      return value;
    }

    if (isBuiltin(node.value)) {
      const result = getBuiltin(node.value) as BaseObject;
      return result;
    }

    return context.createError(
      `identifier not found: ${node.value}`,
      node.position()
    );
  }
}
