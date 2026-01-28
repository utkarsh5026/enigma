import { FunctionLiteral } from "@/lang/ast";
import { FunctionObject } from "@/lang/exec/objects";
import { NodeEvaluator, Environment, BaseObject } from "@/lang/exec/core";

/**
 * 🔧 FunctionLiteralEvaluator - Executable Code Block Creator
 *
 * Evaluates function literal expressions into runtime function objects.
 * Creates reusable code blocks that can accept parameters and return values,
 * capturing their defining environment for closure behavior.
 *
 * @example
 * - Simple functions: function(x) { return x * 2; }
 * - Multi-parameter: function(a, b, c) { return a + b + c; }
 * - No parameters: function() { return "Hello World"; }
 */
export class FunctionLiteralEvaluator implements NodeEvaluator<FunctionLiteral> {
  public evaluate(node: FunctionLiteral, env: Environment): BaseObject {
    const functionObject = new FunctionObject(node.parameters, node.body, env);
    return functionObject;
  }
}
