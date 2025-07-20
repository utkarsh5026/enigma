import { BaseObject, NodeEvaluator } from "@/lang/exec/core";
import { NewExpression } from "@/lang/ast";
import {
  NullObject,
  FunctionObject,
  InstanceObject,
} from "@/lang/exec/objects";
import {
  EvaluationContext,
  Environment,
  ObjectValidator,
} from "@/lang/exec/core";

/**
 * 🆕 NewExpressionEvaluator - Object Instantiation Evaluator 🆕
 *
 * Evaluates new expressions to create class instances.
 *
 * From first principles, object instantiation involves:
 * 1. Evaluate class expression to get ClassObject
 * 2. Create new InstanceObject from class
 * 3. Call constructor with provided arguments
 * 4. Return the initialized instance
 */
export class NewExpressionEvaluator implements NodeEvaluator<NewExpression> {
  public evaluate(
    node: NewExpression,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const classObj = context.evaluate(node.className, env);
    if (ObjectValidator.isError(classObj)) {
      return classObj;
    }

    if (!ObjectValidator.isClass(classObj)) {
      return context.createError(
        "Cannot instantiate non-class object: " + classObj.type(),
        node.position()
      );
    }

    const args = context.evaluateExpressions(node.arguments, env);
    for (const arg of args) {
      if (ObjectValidator.isError(arg)) {
        return arg;
      }
    }

    const instance = classObj.createInstance();
    const { classConstructor } = classObj;
    if (classConstructor) {
      const requiredArgs = classConstructor.parameters.length;
      if (args.length != requiredArgs) {
        const message = `Constructor argument mismatchs: ${classObj.name} requires ${requiredArgs} got ${args.length}`;
        return context.createError(message, node.position());
      }

      const constructorResult = this.callConstructor(
        classConstructor,
        instance,
        args,
        context
      );
      if (ObjectValidator.isError(constructorResult)) {
        return constructorResult;
      }
    } else if (node.hasArguments()) {
      return context.createError(
        "No constructor found for class: " + classObj.name,
        node.position()
      );
    }

    return instance;
  }

  /**
   * 🏗️ Calls a constructor function with proper this binding
   */
  private callConstructor(
    constructor: FunctionObject,
    instance: InstanceObject,
    args: BaseObject[],
    context: EvaluationContext
  ): BaseObject {
    const constructorEnv = new Environment(constructor.env, false);
    constructorEnv.defineVariable("this", instance);

    for (let i = 0; i < constructor.parameters.length; i++) {
      const paramName = constructor.parameters[i].value;
      constructorEnv.defineVariable(paramName, args[i]);
    }

    const result = context.evaluate(constructor.body, constructorEnv);

    if (ObjectValidator.isReturnValue(result)) {
      return NullObject.INSTANCE;
    }

    return result;
  }
}
