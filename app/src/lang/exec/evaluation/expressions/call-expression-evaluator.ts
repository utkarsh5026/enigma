import { NodeEvaluator } from "@/lang/exec/core";
import { CallExpression } from "@/lang/ast";
import { Environment, BaseObject, ErrorObject } from "@/lang/exec/objects";
import { EvaluationContext } from "@/lang/exec/core";
import { ObjectValidator } from "../../core/validate";
import { Identifier } from "@/lang/ast/ast";

export class CallExpressionEvaluator implements NodeEvaluator<CallExpression> {
  public evaluate(
    node: CallExpression,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    let funcName = "anonymous function";
    if (node.func instanceof Identifier) {
      funcName = node.func.value;
    }

    context.addBeforeStep(
      node,
      env,
      `About to call function "${funcName}" with ${node.args.length} arguments`
    );

    const functionObject = context.evaluate(node.func, env);
    if (ObjectValidator.isError(functionObject)) {
      context.addAfterStep(
        node,
        env,
        functionObject,
        `Error evaluating function "${funcName}": ${functionObject.message}`
      );
      return functionObject;
    }

    context.addDuringStep(
      node,
      env,
      `Evaluating ${node.args.length} arguments for function "${funcName}"`
    );
    const args = context.evaluateExpressions(node.args, env);

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (ObjectValidator.isError(arg)) {
        context.addAfterStep(
          node,
          env,
          arg,
          `Error evaluating argument ${i + 1} for function "${funcName}": ${
            arg.message
          }`
        );
        return arg;
      }
    }

    context.addDuringStep(
      node,
      env,
      `Arguments evaluated for function "${funcName}": [${args
        .map((arg) => arg.inspect())
        .join(", ")}]`,
      {
        argumentCount: args.length,
        argumentValues: args.map((arg) => arg.inspect()),
      }
    );

    const isFunction = ObjectValidator.isFunction(functionObject);
    const isBuiltin = ObjectValidator.isBuiltin(functionObject);

    if (isFunction || isBuiltin) {
      if (isFunction && args.length != functionObject.parameters.length) {
        const error = new ErrorObject(
          `Wrong number of arguments. Expected ${functionObject.parameters.length}, got ${args.length}`
        );

        context.addAfterStep(
          node,
          env,
          error,
          `Error: Function "${funcName}" expects ${functionObject.parameters.length} arguments, got ${args.length}`
        );

        return error;
      }
      const result = this.applyFunction(functionObject, args, context);
      context.addAfterStep(
        node,
        env,
        result,
        `Function "${funcName}" returned: ${result.inspect()}`
      );
      return result;
    }

    const error = new ErrorObject(`Not a function: ${functionObject.type()}`);
    context.addAfterStep(
      node,
      env,
      error,
      `Error: Function "${funcName}" is not a function`
    );
    return error;
  }

  private applyFunction(
    functionObject: BaseObject,
    args: BaseObject[],
    context: EvaluationContext
  ): BaseObject {
    if (ObjectValidator.isBuiltin(functionObject)) {
      return functionObject.fn(args);
    }

    if (!ObjectValidator.isFunction(functionObject)) {
      return new ErrorObject(`Not a function: ${functionObject.type()}`);
    }

    const extendedEnv = new Environment(functionObject.env, false);
    const { parameters } = functionObject;

    parameters.forEach((param, i) => {
      extendedEnv.set(param.value, args[i]);
    });

    const result = context.evaluate(functionObject.body, extendedEnv);

    if (ObjectValidator.isError(result)) {
      return result;
    }

    if (ObjectValidator.isReturnValue(result)) {
      return result.value;
    }

    return result;
  }
}
