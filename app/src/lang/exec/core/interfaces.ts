import { Node } from "@/lang/ast/ast";
import { BaseObject, Environment } from "../objects";

/**
 * 🎯 NodeEvaluator - The Universal Evaluation Contract 🎯
 *
 * This interface defines the fundamental contract that all evaluators must
 * follow.
 * Think of it as the universal language that all evaluation modules speak!
 *
 * From first principles:
 * - Every piece of code (AST node) needs to be turned into a runtime value
 * (object)
 * - This transformation happens in a specific context (environment with
 * variables)
 * - The result is always a BaseObject (our universal value container)
 */
export interface NodeEvaluator<T extends Node> {
  evaluate(node: T, env: Environment, context: EvaluationContext): BaseObject;
}

/**
 * 🎛️ EvaluationContext - The Master Control Center 🎛️
 *
 * This interface provides a way for specialized evaluators to delegate back to
 * the main evaluation system. It's like having a phone line to mission control!
 *
 * Why we need this:
 * - Expression evaluators need to evaluate sub-expressions
 * - Statement evaluators need to evaluate nested statements
 * - Function calls need to evaluate arguments
 * - We avoid circular dependencies by using this interface
 */
export interface EvaluationContext {
  /**
   * Evaluates any AST node by delegating to the appropriate specialized evaluator
   */
  evaluate(node: Node, env: Environment): BaseObject;

  /**
   * Evaluates a list of expressions (useful for function arguments, array
   * elements)
   */
  evaluateExpressions(expressions: Node[], env: Environment): BaseObject[];

  /**
   * Creates a new scope for block statements, functions, etc.
   */
  newScope(parent: Environment, isBlockScope: boolean): Environment;
}
