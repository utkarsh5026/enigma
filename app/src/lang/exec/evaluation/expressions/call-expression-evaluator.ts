import { NodeEvaluator } from "@/lang/exec/core";
import { CallExpression } from "@/lang/ast";
import { Environment, BaseObject, ErrorObject } from "@/lang/exec/objects";
import { EvaluationContext } from "@/lang/exec/core";
import { ObjectValidator } from "../../core/validate";

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

    const isFunction = ObjectValidator.isFunction(functionObject);
    const isBuiltin = ObjectValidator.isBuiltin(functionObject);

    if (isFunction || isBuiltin) {
      if (isFunction && args.length != functionObject.parameters.length) {
        return new ErrorObject(
          "Wrong number of arguments. Expected " +
            functionObject.parameters.length +
            ", got " +
            args.length
        );
      }
      return this.applyFunction(functionObject, args, context);
    }

    return new ErrorObject(`Not a function: ${functionObject.type()}`);
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
