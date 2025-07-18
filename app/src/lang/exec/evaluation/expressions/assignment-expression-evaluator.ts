import { AssignmentExpression, AstValidator } from "@/lang/ast";
import {
  NodeEvaluator,
  EvaluationContext,
  Environment,
  BaseObject,
  ObjectValidator,
} from "@/lang/exec/core";
import { HashObject, ArrayObject } from "@/lang/exec/objects";

/**
 * 📝 AssignmentExpressionEvaluator - Universal Assignment Specialist 📝
 *
 * Handles all types of assignment expressions:
 * 1. Simple identifier assignment: x = value
 * 2. Array index assignment: array[0] = value
 * 3. Hash key assignment: hash["key"] = value
 */
export class AssignmentExpressionEvaluator
  implements NodeEvaluator<AssignmentExpression>
{
  public evaluate(
    node: AssignmentExpression,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const value = context.evaluate(node.value, env);
    if (ObjectValidator.isError(value)) {
      return value;
    }

    if (node.isIdentifierAssignment()) {
      return this.evaluateIdentifierAssignment(node, value, env, context);
    } else if (node.isIndexAssignment()) {
      return this.evaluateIndexAssignment(node, value, env, context);
    } else {
      return context.createError(
        `Invalid assignment target: ${node.name}`,
        node.position()
      );
    }
  }

  /**
   * 🏷️ Handles simple identifier assignment: x = value
   *
   * This is the traditional variable assignment where we store a value
   * in a variable name within the current environment scope.
   */
  private evaluateIdentifierAssignment(
    node: AssignmentExpression,
    value: BaseObject,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    if (!AstValidator.isIdentifier(node.name)) {
      return context.createError(
        `Invalid assignment target: ${node.name}`,
        node.position()
      );
    }

    const variableName = node.name.value;
    const definingScope = env.findVariableDeclarationScope(variableName);

    if (definingScope == null) {
      return context.createError(
        `identifier not found: ${variableName}`,
        node.position()
      );
    }

    if (definingScope.isVariableImmutable(variableName)) {
      return context.createError(
        `cannot assign to constant ${variableName}`,
        node.position()
      );
    }

    definingScope.defineVariable(variableName, value);
    return value;
  }

  /**
   * 🗂️ Handles index assignment: array[0] = value or hash["key"] = value
   *
   */
  private evaluateIndexAssignment(
    node: AssignmentExpression,
    value: BaseObject,
    env: Environment,
    context: EvaluationContext
  ) {
    if (!AstValidator.isIndexExpression(node.name)) {
      throw new Error("Invalid assignment target: " + node.name);
    }

    const indexExpr = node.name;

    const targetObject = context.evaluate(indexExpr.left, env);
    if (ObjectValidator.isError(targetObject)) {
      return targetObject;
    }

    const indexObject = context.evaluate(indexExpr.index, env);
    if (ObjectValidator.isError(indexObject)) {
      return indexObject;
    }

    if (ObjectValidator.isArray(targetObject)) {
      return this.evaluateArrayIndexAssignment(
        targetObject,
        indexObject,
        value,
        context,
        node
      );
    }

    if (ObjectValidator.isHash(targetObject)) {
      return this.evaluateHashIndexAssignment(
        targetObject,
        indexObject,
        value,
        context,
        node
      );
    }

    return context.createError(
      `Index assignment not supported for type: ${targetObject.type()}`,
      node.position()
    );
  }

  /**
   * 📋 Handles array index assignment: array[index] = value
   */
  private evaluateArrayIndexAssignment(
    array: ArrayObject,
    indexObject: BaseObject,
    value: BaseObject,
    context: EvaluationContext,
    node: AssignmentExpression
  ) {
    if (!ObjectValidator.isInteger(indexObject)) {
      return context.createError(
        `Array index must be an integer, got: ${indexObject.type()}`,
        node.position()
      );
    }

    const index = indexObject.value;
    if (!array.isValidIndex(index)) {
      return context.createError(
        `Array index out of bounds: ${index} for array of size ${array.size()}`,
        node.position()
      );
    }

    try {
      return array.set(index, value);
    } catch (e: unknown) {
      if (e instanceof Error) {
        return context.createError(e.message, node.position());
      }
      return context.createError("Unknown error", node.position());
    }
  }

  /**
   * 🗃️ Handles hash index assignment: hash["key"] = value
   *
   * From first principles, hash assignment means:
   * 1. Verify the key is a valid string
   * 2. Update or create the key-value pair in the hash
   * 3. Return the assigned value
   */
  private evaluateHashIndexAssignment(
    hash: HashObject,
    keyObject: BaseObject,
    value: BaseObject,
    context: EvaluationContext,
    node: AssignmentExpression
  ) {
    if (
      !ObjectValidator.isString(keyObject) &&
      !ObjectValidator.isInteger(keyObject)
    ) {
      return context.createError(
        `Hash key must be a string or integer, got: ${keyObject.type()}`,
        node.position()
      );
    }

    if (ObjectValidator.isString(keyObject)) {
      return hash.set(keyObject.value, value);
    }

    return hash.set(keyObject.value.toString(), value);
  }
}
