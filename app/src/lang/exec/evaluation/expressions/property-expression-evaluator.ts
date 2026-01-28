import { PropertyExpression, Expression } from "@/lang/ast";
import {
  NodeEvaluator,
  ObjectValidator,
  Environment,
  BaseObject,
  EvaluationContext,
} from "@/lang/exec/core";
import { InstanceObject, FunctionObject } from "@/lang/exec/objects";
import { AstValidator } from "@/lang/ast/validate";

/**
 * 🔗 PropertyExpressionEvaluator - Property Access Evaluator 🔗
 *
 * Evaluates property access expressions (instance.property).
 *
 * From first principles, property access involves:
 * 1. Evaluate object expression to get instance
 * 2. Get property name from property expression
 * 3. Look up property in instance or method in class
 * 4. Return property value or bound method
 */
export class PropertyExpressionEvaluator implements NodeEvaluator<PropertyExpression> {
  evaluate(
    node: PropertyExpression,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const instance = context.evaluate(node.object, env);
    if (ObjectValidator.isError(instance)) {
      return instance;
    }

    const { property } = node;
    const propertyName = this.extractPropertyName(property, env, context);
    if (!propertyName) {
      return context.createError("Invalid property name", property.position());
    }

    if (ObjectValidator.isInstance(instance)) {
      return this.evaluateInstancePropertyAccess(
        instance,
        propertyName,
        context,
        node
      );
    }

    const message = `Cannot access property '${propertyName}' on non-instance object: ${instance.type()}`;
    return context.createError(message, node.position());
  }

  /**
   * 🎭 Evaluates property access on an instance object
   */
  private evaluateInstancePropertyAccess(
    instance: InstanceObject,
    propertyName: string,
    context: EvaluationContext,
    node: PropertyExpression
  ): BaseObject {
    const property = instance.getProperty(propertyName);
    if (property) {
      return property;
    }

    const method = instance.findMethod(propertyName);
    if (method) {
      return this.createBoundMethod(method, instance);
    }

    return this.createPropertyNotFoundErrorWithSuggestions(
      instance,
      propertyName,
      context,
      node
    );
  }

  /**
   * 🔗 Creates a bound method (method with 'this' pre-bound to instance)
   */
  private createBoundMethod(
    method: FunctionObject,
    instance: InstanceObject
  ): BaseObject {
    const boundEnv = new Environment(method.env, false);
    boundEnv.defineVariable("this", instance);
    const { parameters, body } = method;
    return new FunctionObject(parameters, body, boundEnv);
  }

  /**
   * 🏷️ Extracts property name from property expression
   */
  private extractPropertyName(
    propertyExpr: Expression,
    env: Environment,
    context: EvaluationContext
  ): string | null {
    if (AstValidator.isIdentifier(propertyExpr)) {
      return propertyExpr.value;
    }

    const result = context.evaluate(propertyExpr, env);
    if (ObjectValidator.isString(result)) {
      return result.value;
    }

    return null;
  }

  /**
   * 🔍 Additional utility methods for enhanced property access
   */

  /**
   * Checks if a property exists on an instance without accessing it
   */
  hasProperty(instance: InstanceObject, propertyName: string): boolean {
    return (
      instance.getProperty(propertyName) !== null ||
      instance.findMethod(propertyName) !== null
    );
  }

  /**
   * Gets all available property names for an instance
   */
  getAvailableProperties(instance: InstanceObject): string[] {
    const properties: string[] = [];

    // Add instance properties
    const instanceProperties = instance.getPropertyNames();
    properties.push(...instanceProperties);

    // Add class methods
    const methods = Array.from(instance.classObject.methods.keys());
    properties.push(...methods);

    return Array.from(new Set(properties)); // Remove duplicates
  }

  /**
   * Determines if a property is a method or a field
   */
  getPropertyType(
    instance: InstanceObject,
    propertyName: string
  ): "field" | "method" | "not_found" {
    if (instance.getProperty(propertyName)) {
      return "field";
    }
    if (instance.findMethod(propertyName)) {
      return "method";
    }
    return "not_found";
  }

  /**
   * Creates an error message with suggestions for similar property names
   */
  private createPropertyNotFoundErrorWithSuggestions(
    instance: InstanceObject,
    propertyName: string,
    context: EvaluationContext,
    node: PropertyExpression
  ): BaseObject {
    const availableProperties = this.getAvailableProperties(instance);
    const suggestions = this.findSimilarProperties(
      propertyName,
      availableProperties
    );

    let message = `Property '${propertyName}' not found on instance of ${instance.classObject.name}`;

    if (suggestions.length > 0) {
      message += `. Did you mean: ${suggestions.join(", ")}?`;
    }

    return context.createError(message, node.position());
  }

  /**
   * Finds similar property names using simple string similarity
   */
  private findSimilarProperties(target: string, available: string[]): string[] {
    const threshold = 0.6;
    const similar: string[] = [];

    for (const prop of available) {
      if (
        this.calculateSimilarity(target.toLowerCase(), prop.toLowerCase()) >=
        threshold
      ) {
        similar.push(prop);
      }
    }

    return similar.sort().slice(0, 3); // Return top 3 suggestions
  }

  /**
   * Simple string similarity calculation using Levenshtein distance
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) {
      return 1.0;
    }

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculates Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }
}
