import {
  EvaluationContext,
  NodeEvaluator,
  Environment,
  BaseObject,
} from "@/lang/exec/core";
import { Identifier } from "@/lang/ast/ast";
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
    context.addBeforeStep(node, env, `Evaluating identifier: ${node.value}`);
    const value = env.resolveVariable(node.value);
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
      return result;
    }

    return context.createError(
      `identifier not found: ${node.value}`,
      node.position()
    );
  }
}
