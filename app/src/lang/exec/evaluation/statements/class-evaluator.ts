import { ClassStatement, FunctionLiteral } from "@/lang/ast/";
import {
  NodeEvaluator,
  BaseObject,
  Environment,
  EvaluationContext,
  ObjectValidator,
} from "@/lang/exec/core";
import { ErrorObject, ClassObject, FunctionObject } from "../../objects";

interface ParentClassResolution {
  parentClass: ClassObject | null;
  error: ErrorObject | null;
}

/**
 * 🏛️ ClassStatementEvaluator - Class Definition Evaluator 🏛️
 *
 * Evaluates class definitions to create ClassObject instances.
 *
 * From first principles, class evaluation involves:
 * 1. Create class environment for lexical scoping
 * 2. Resolve parent class if inheritance is used
 * 3. Create constructor function object
 * 4. Create method function objects
 * 5. Create ClassObject with all components
 * 6. Register class in current environment
 */
export class ClassStatementEvaluator implements NodeEvaluator<ClassStatement> {
  public evaluate(
    node: ClassStatement,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const className = node.name.value;

    if (env.containsVariableLocally(className)) {
      return context.createError(
        "Class '" + className + "' already defined in this scope",
        node.position()
      );
    }

    const parentClassResolution = this.resolveParentClass(node, env);
    if (parentClassResolution.error) {
      const errorMessage = parentClassResolution.error.message;
      return context.createError(errorMessage, node.position());
    }

    const classEnv = new Environment(env, false);

    const constructor = node.classConstructor
      ? this.createFunctionObject(node.classConstructor, classEnv)
      : null;

    const methods = this.createMethods(node, classEnv);
    const classObj = new ClassObject(
      className,
      parentClassResolution.parentClass,
      constructor,
      methods,
      classEnv
    );

    env.defineVariable(className, classObj);

    return classObj;
  }

  private wouldCreateCircularInheritance(
    newClassName: string,
    parentClass: ClassObject
  ) {
    let current: ClassObject | null = parentClass;
    while (current != null) {
      if (current.name === newClassName) {
        return true;
      }
      current = current.parentClass;
    }
    return false;
  }

  private resolveParentClass(
    node: ClassStatement,
    env: Environment
  ): ParentClassResolution {
    const className = node.name.value;
    let parentClass: ClassObject | null = null;
    let error: ErrorObject | null = null;

    if (node.parentClass) {
      const parentClassName = node.parentClass.value;
      const parentObj = env.resolveVariable(parentClassName);
      if (!parentObj) {
        error = new ErrorObject(
          "Parent class '" + parentClassName + "' not found"
        );
        return { parentClass, error };
      }

      if (!ObjectValidator.isClass(parentObj)) {
        error = new ErrorObject("'" + parentClassName + "' is not a class");
        return { parentClass, error };
      }

      parentClass = parentObj as ClassObject;

      if (
        this.wouldCreateCircularInheritance(className, parentObj as ClassObject)
      ) {
        error = new ErrorObject(
          "Circular inheritance detected: " +
            className +
            " cannot extend " +
            parentClassName
        );
      }
    }

    return { parentClass, error };
  }

  /**
   * 🔧 Creates a FunctionObject from a FunctionLiteral
   */
  private createFunctionObject(
    funcLiteral: FunctionLiteral,
    classEnv: Environment
  ): FunctionObject {
    return new FunctionObject(
      funcLiteral.parameters,
      funcLiteral.body,
      classEnv
    );
  }

  /**
   * 🔧 Creates a map of method function objects from a class definition
   */
  private createMethods(
    node: ClassStatement,
    classEnv: Environment
  ): Map<string, FunctionObject> {
    const methods = new Map<string, FunctionObject>();
    for (const methodDef of node.methods) {
      const methodName = methodDef.name.value;
      const methodObj = this.createFunctionObject(methodDef.function, classEnv);
      methods.set(methodName, methodObj);
    }
    return methods;
  }
}
