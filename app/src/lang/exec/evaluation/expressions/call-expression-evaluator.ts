import { NodeEvaluator } from "@/lang/exec/core";
import { CallExpression } from "@/lang/ast";
import {
  EvaluationContext,
  Environment,
  BaseObject,
  ObjectValidator,
} from "@/lang/exec/core";
import { FrameType } from "@/lang/exec/debug";
import { Position } from "@/lang/token/token";
import { AstValidator } from "@/lang/ast";

/**
 * 📞 CallExpressionEvaluator - Function Invocation Handler
 *
 * Evaluates function call expressions by resolving the function and executing
 * it with provided arguments. Handles both user-defined functions and built-in
 * system functions with proper parameter binding and return value handling.
 *
 * @example
 * - Simple calls: print("Hello"), max(5, 10), len([1, 2, 3])
 * - User functions: calculateTotal(items), processData(input)
 * - Method-style: math.sqrt(16), string.upper("hello")
 * - Complex calls: fibonacci(10), sortArray([3, 1, 4, 1, 5])
 */
export class CallExpressionEvaluator implements NodeEvaluator<CallExpression> {
  public evaluate(
    node: CallExpression,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const functionObject = context.evaluate(node.func, env);
    if (ObjectValidator.isError(functionObject)) {
      return functionObject;
    }

    const args = context.evaluateExpressions(node.args, env);

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (ObjectValidator.isError(arg)) {
        return arg;
      }
    }

    const isFunction = ObjectValidator.isFunction(functionObject);
    const isBuiltin = ObjectValidator.isBuiltin(functionObject);

    if (isFunction || isBuiltin) {
      if (isFunction && args.length != functionObject.parameters.length) {
        const error = context.createError(
          `Wrong number of arguments. Expected ${functionObject.parameters.length}, got ${args.length}`,
          node.position()
        );
        return error;
      }

      return this.applyFunction(functionObject, args, context, node);
    }

    return context.createError(
      `Not a function: ${functionObject.type()}`,
      node.position()
    );
  }

  private applyFunction(
    functionObject: BaseObject,
    args: BaseObject[],
    context: EvaluationContext,
    node: CallExpression
  ): BaseObject {
    if (ObjectValidator.isBuiltin(functionObject)) {
      return this.applyBuiltinFunction(
        functionObject,
        args,
        context,
        node.position()
      );
    }

    if (ObjectValidator.isFunction(functionObject)) {
      return this.applyUserFunction(functionObject, args, context, node);
    }

    return context.createError(
      `Not a function: ${functionObject.type()}`,
      node.position()
    );
  }

  private applyBuiltinFunction(
    builtin: BaseObject,
    args: BaseObject[],
    context: EvaluationContext,
    functionPos: Position
  ): BaseObject {
    if (!ObjectValidator.isBuiltin(builtin)) {
      return context.createError(
        `Not a builtin function: ${builtin.type()}`,
        functionPos
      );
    }

    const functionName = builtin.name;
    context.enterFunction(functionName, functionPos, FrameType.BUILTIN);

    try {
      const result = builtin.fn(args);
      if (ObjectValidator.isError(result)) {
        const message = `Error in evaluation of the builtin function ${functionName}: ${result.message}`;
        return context.createError(message, functionPos);
      }
      return result;
    } finally {
      context.exitFunction();
    }
  }

  /**
   * Applies a user function to the given arguments and returns the result.
   */
  private applyUserFunction(
    func: BaseObject,
    args: BaseObject[],
    context: EvaluationContext,
    caller: CallExpression
  ): BaseObject {
    if (!ObjectValidator.isFunction(func)) {
      return context.createError(
        `Not a function: ${func.type()}`,
        caller.func.position()
      );
    }

    const functionName = this.determineFunctionName(caller);
    context.enterFunction(
      functionName,
      caller.func.position(),
      FrameType.USER_FUNCTION
    );

    try {
      const extendedEnv = new Environment(func.env, false);
      const parameters = func.parameters;

      // Bind arguments to parameters
      for (let i = 0; i < parameters.length; i++) {
        const param = parameters[i];
        const arg = args[i];
        extendedEnv.defineVariable(param.value, arg);
      }

      const result = context.evaluate(func.body, extendedEnv);
      if (ObjectValidator.isError(result)) {
        return result;
      }

      if (ObjectValidator.isReturnValue(result)) {
        return result.value;
      }

      return result;
    } finally {
      context.exitFunction();
    }
  }

  /**
   * Determines the name of the function to be used in the stack trace.
   */
  private determineFunctionName(node: CallExpression): string {
    const functionExpr = node.func;
    if (AstValidator.isIdentifier(functionExpr)) {
      return functionExpr.value;
    }
    return "<anonymous>";
  }
}
