import { SuperExpression, Expression } from "@/lang/ast/";
import {
  NodeEvaluator,
  ObjectValidator,
  Environment,
  BaseObject,
  EvaluationContext,
  ObjectType,
} from "@/lang/exec/core";
import {
  InstanceObject,
  ClassObject,
  FunctionObject,
  ReturnValueObject,
} from "@/lang/exec/objects";
import { AstValidator } from "@/lang/ast/validate";

/**
 * ⬆️ SuperExpressionEvaluator - Parent Class Access Evaluator ⬆️
 *
 * Evaluates super expressions for calling parent class methods.
 *
 * From first principles, super evaluation involves:
 * 1. Find current instance from 'this' binding
 * 2. Get EXECUTION CONTEXT class (not instance class!)
 * 3. Find method in parent class of execution context
 * 4. Call method with current instance as 'this'
 */
export class SuperExpressionEvaluator implements NodeEvaluator<SuperExpression> {
  // 🔑 Reserved environment variable to track current class context
  private static readonly CLASS_CONTEXT_VAR = "__class_context__";
  private static readonly THIS_VARIABLE = "this";

  public evaluate(
    node: SuperExpression,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const thisObj = env.resolveVariable(SuperExpressionEvaluator.THIS_VARIABLE);
    if (!thisObj) {
      return context.createError(
        `'${SuperExpressionEvaluator.THIS_VARIABLE}' is not available in this context`,
        node.position()
      );
    }

    if (!ObjectValidator.isInstance(thisObj)) {
      return context.createError(
        `'${
          SuperExpressionEvaluator.THIS_VARIABLE
        }' is not an instance of a class: ${thisObj.type()}`,
        node.position()
      );
    }

    const currentClass = this.getCurrentClassContext(env, thisObj);

    if (!currentClass.hasParentClass()) {
      const errorMessage = `No parent class found for class: ${currentClass.name}`;
      return context.createError(errorMessage, node.position());
    }

    const parentClass = currentClass.parentClass!;

    if (node.isConstructorCall()) {
      return this.evaluateSuperConstructorCall(
        node,
        parentClass,
        thisObj,
        env,
        context
      );
    } else {
      return this.evaluateSuperMethodCall(
        node,
        parentClass,
        thisObj,
        env,
        context
      );
    }
  }

  /**
   * 🏗️ Evaluates super constructor call: super(args)
   */
  private evaluateSuperConstructorCall(
    node: SuperExpression,
    parentClass: ClassObject,
    instance: InstanceObject,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    if (!parentClass.hasConstructor()) {
      const argCount = node.args.length;
      if (argCount === 0) {
        return instance;
      }

      const errorMessage = `No constructor found for class: ${parentClass.name} with ${argCount} arguments`;
      return context.createError(errorMessage, node.position());
    }

    const parentConstructor = parentClass.classConstructor!;
    const args = context.evaluateExpressions(node.args, env);

    for (const arg of args) {
      if (ObjectValidator.isError(arg)) {
        return arg;
      }
    }

    const requiredArgs = parentConstructor.parameters.length;
    if (args.length !== requiredArgs) {
      const errorMessage = `Constructor argument mismatch: ${parentClass.name} requires ${requiredArgs} got ${args.length}`;
      return context.createError(errorMessage, node.position());
    }

    return this.callParentConstructor(
      parentConstructor,
      instance,
      args,
      parentClass,
      context
    );
  }

  /**
   * 🔧 Evaluates super method call: super.method(args)
   */
  private evaluateSuperMethodCall(
    node: SuperExpression,
    parentClass: ClassObject,
    instance: InstanceObject,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const methodName = this.extractMethodName(node.method!);
    if (!methodName) {
      return context.createError(
        `Method not found: ${methodName} in parent class: ${parentClass.name}`,
        node.position()
      );
    }

    const method = parentClass.findMethod(methodName);
    if (!method) {
      const errorMessage = `Method not found: ${methodName} in parent class: ${parentClass.name}`;
      return context.createError(errorMessage, node.position());
    }

    const args = context.evaluateExpressions(node.args, env);
    for (const arg of args) {
      if (ObjectValidator.isError(arg)) {
        return arg;
      }
    }

    const parentMethod = method;
    const requiredArgs = parentMethod.parameters.length;
    if (args.length !== requiredArgs) {
      const errorMessage = `Argument mismatch: ${parentClass.name} requires ${requiredArgs} got ${args.length}`;
      return context.createError(errorMessage, node.position());
    }

    return this.callParentMethod(
      parentMethod,
      instance,
      args,
      parentClass,
      context
    );
  }

  /**
   * 🏗️ Calls parent constructor with proper this binding AND class context
   *
   * From first principles:
   * 1. Create a new environment for the constructor
   * 2. Bind 'this' to the current instance
   * 3. Bind parameters
   * 4. Execute the constructor
   * 5. Return the result
   */
  private callParentConstructor(
    constructor: FunctionObject,
    instance: InstanceObject,
    args: BaseObject[],
    parentClass: ClassObject,
    context: EvaluationContext
  ): BaseObject {
    const constructorEnv = new Environment(constructor.env, false);
    constructorEnv.defineVariable(
      SuperExpressionEvaluator.CLASS_CONTEXT_VAR,
      new ClassContextObject(parentClass)
    );
    constructorEnv.defineVariable(
      SuperExpressionEvaluator.THIS_VARIABLE,
      instance
    );

    for (let i = 0; i < constructor.parameters.length; i++) {
      const paramName = constructor.parameters[i].value;
      constructorEnv.defineVariable(paramName, args[i]);
    }

    return context.evaluate(constructor.body, constructorEnv);
  }

  /**
   * 🔧 Calls parent method with proper this binding
   */
  private callParentMethod(
    method: FunctionObject,
    instance: InstanceObject,
    args: BaseObject[],
    parentClass: ClassObject,
    context: EvaluationContext
  ): BaseObject {
    const methodEnv = new Environment(method.env, false);
    methodEnv.defineVariable(SuperExpressionEvaluator.THIS_VARIABLE, instance);
    methodEnv.defineVariable(
      SuperExpressionEvaluator.CLASS_CONTEXT_VAR,
      new ClassContextObject(parentClass)
    );

    const paramNames = method.parameters.map((p) => p.value);
    for (let i = 0; i < paramNames.length; i++) {
      methodEnv.defineVariable(paramNames[i], args[i]);
    }

    const result = context.evaluate(method.body, methodEnv);

    if (ObjectValidator.isReturnValue(result)) {
      return (result as ReturnValueObject).value;
    }

    return result;
  }

  /**
   * 🏷️ Extracts method name from method expression
   */
  private extractMethodName(methodExpr: Expression): string | null {
    if (AstValidator.isIdentifier(methodExpr)) {
      return methodExpr.value;
    }
    return null;
  }

  /**
   * 🎯 Gets the current class execution context
   *
   * From first principles:
   * 1. Check if environment has explicit class context (set during
   * method/constructor calls)
   * 2. If not, fall back to instance's actual class (for top-level calls)
   */
  private getCurrentClassContext(
    env: Environment,
    instance: InstanceObject
  ): ClassObject {
    const classContext = env.resolveVariable(
      SuperExpressionEvaluator.CLASS_CONTEXT_VAR
    );
    if (classContext && classContext.type() === ObjectType.CLASS_CONTEXT) {
      return (classContext as ClassContextObject).getClassObject();
    }
    return instance.classObject;
  }
}

/**
 * 🎯 Class Context Object - Wraps a ClassObject for environment storage
 *
 * This is a helper object that allows us to store class context information
 * in the environment variables.
 */
export class ClassContextObject implements BaseObject {
  private readonly classObject: ClassObject;

  constructor(classObject: ClassObject) {
    this.classObject = classObject;
  }

  getClassObject(): ClassObject {
    return this.classObject;
  }

  type(): ObjectType {
    return ObjectType.CLASS_CONTEXT;
  }

  inspect(): string {
    return `ClassContext(${this.classObject.name})`;
  }

  isTruthy(): boolean {
    return true;
  }
}
