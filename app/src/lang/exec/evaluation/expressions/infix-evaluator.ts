import { InfixExpression } from "@/lang/ast";
import {
  NodeEvaluator,
  ObjectValidator,
  Environment,
  BaseObject,
} from "@/lang/exec/core";
import {
  ErrorObject,
  StringObject,
  BooleanObject,
  IntegerObject,
  FloatObject,
} from "@/lang/exec/objects";
import { EvaluationContext } from "@/lang/exec/core";

/**
 * 🧮 InfixExpressionEvaluator - Binary Operation Specialist 🧮
 *
 * Handles all operations between two values: 5 + 3, "hello" + "world", etc.
 * This evaluator focuses purely on infix operations and delegates everything
 * else.
 */
export class InfixExpressionEvaluator
  implements NodeEvaluator<InfixExpression>
{
  public evaluate(
    node: InfixExpression,
    env: Environment,
    context: EvaluationContext
  ) {
    context.addBeforeStep(
      node,
      env,
      `Evaluating the left side of the infix expression`
    );
    const left = context.evaluate(node.left, env);
    if (ObjectValidator.isError(left)) {
      context.addAfterStep(
        node,
        env,
        left,
        `Error evaluating the left side of the infix expression: ${left.message}`
      );
      return left;
    }

    context.addBeforeStep(
      node,
      env,
      `Evaluating the right side of the infix expression`
    );
    const right = context.evaluate(node.right, env);
    if (ObjectValidator.isError(right)) {
      context.addAfterStep(
        node,
        env,
        right,
        `Error evaluating the right side of the infix expression: ${right.message}`
      );
      return right;
    }

    context.addBeforeStep(node, env, `Evaluating the infix expression`);
    const result = this.evalInfixExpression(
      node.operator,
      left,
      right,
      context,
      node
    );
    context.addAfterStep(
      node,
      env,
      result,
      `Infix expression evaluated: ${result.inspect()}`
    );
    return result;
  }

  private evalStringInfixExpression(
    operator: string,
    left: BaseObject,
    right: BaseObject,
    context: EvaluationContext,
    node: InfixExpression
  ) {
    if (!ObjectValidator.isString(left) || !ObjectValidator.isString(right)) {
      return this.createTypeMismatchError(operator, left, right, context, node);
    }

    const leftString = left.value;
    const rightString = right.value;

    switch (operator) {
      case "+":
        return new StringObject(leftString + rightString);

      case "==":
        return new BooleanObject(leftString === rightString);

      case "!=":
        return new BooleanObject(leftString !== rightString);

      case ">":
        return new BooleanObject(leftString > rightString);

      case "<":
        return new BooleanObject(leftString < rightString);

      default:
        return this.createInvalidOperatorError(
          operator,
          left,
          right,
          context,
          node
        );
    }
  }

  /**
   * 🔢 Numeric operations
   *
   * Handles all arithmetic and comparison operations on numeric values.
   * Both operands are converted to number for calculation.
   */
  private evalNumericInfixExpression(
    operator: string,
    left: BaseObject,
    right: BaseObject,
    context: EvaluationContext,
    node: InfixExpression
  ) {
    if (ObjectValidator.isFloat(left) || ObjectValidator.isFloat(right)) {
      return this.evalFloatInfixExpression(
        operator,
        left,
        right,
        context,
        node
      );
    }

    return this.evalIntegerInfixExpression(
      operator,
      left,
      right,
      context,
      node
    );
  }

  /**
   * 🔢 Integer-based numeric operations (enhanced for consistency)
   *
   * Handles operations when both operands are integers and the result
   * should remain an integer.
   */
  private evalIntegerInfixExpression(
    operator: string,
    left: BaseObject,
    right: BaseObject,
    context: EvaluationContext,
    node: InfixExpression
  ) {
    if (!ObjectValidator.isInteger(left) || !ObjectValidator.isInteger(right)) {
      return this.createTypeMismatchError(operator, left, right, context, node);
    }

    const leftInteger = left.value;
    const rightInteger = right.value;

    switch (operator) {
      case "+":
        return new IntegerObject(leftInteger + rightInteger);

      case "-":
        return new IntegerObject(leftInteger - rightInteger);

      case "*":
        return new IntegerObject(leftInteger * rightInteger);

      case "/":
        if (rightInteger == 0) {
          return context.createError("division by zero", node.position());
        }
        return new FloatObject(leftInteger / rightInteger);

      case "//":
        if (rightInteger == 0) {
          return context.createError(
            "integer division by zero",
            node.position()
          );
        }
        return new IntegerObject(Math.floor(leftInteger / rightInteger));

      case "%":
        if (rightInteger == 0) {
          return context.createError("modulo by zero", node.position());
        }
        return new IntegerObject(leftInteger % rightInteger);

      case "==":
        return new BooleanObject(leftInteger == rightInteger);

      case "!=":
        return new BooleanObject(leftInteger != rightInteger);

      case "<":
        return new BooleanObject(leftInteger < rightInteger);

      case "<=":
        return new BooleanObject(leftInteger <= rightInteger);

      case ">":
        return new BooleanObject(leftInteger > rightInteger);

      case ">=":
        return new BooleanObject(leftInteger >= rightInteger);

      default:
        return this.createInvalidOperatorError(
          operator,
          left,
          right,
          context,
          node
        );
    }
  }

  /**
   * 🌊 Float-based numeric operations
   *
   * Handles all arithmetic and comparison operations on floating-point numbers.
   * Both operands are converted to number for calculation.
   */
  private evalFloatInfixExpression(
    operator: string,
    left: BaseObject,
    right: BaseObject,
    context: EvaluationContext,
    node: InfixExpression
  ): BaseObject {
    const leftDouble = this.toDouble(left);
    const rightDouble = this.toDouble(right);

    if (leftDouble === null || rightDouble === null) {
      return this.createTypeMismatchError(operator, left, right, context, node);
    }

    const leftDoubleValue = leftDouble;
    const rightDoubleValue = rightDouble;

    switch (operator) {
      case "+":
        return new FloatObject(leftDoubleValue + rightDoubleValue);

      case "-":
        return new FloatObject(leftDoubleValue - rightDoubleValue);

      case "*":
        return new FloatObject(leftDoubleValue * rightDoubleValue);

      case "/":
        if (rightDoubleValue === 0.0) {
          // IEEE 754 behavior: 1.0/0.0 = Infinity, -1.0/0.0 = -Infinity
          if (leftDoubleValue > 0.0) {
            return new FloatObject(Number.POSITIVE_INFINITY);
          } else if (leftDoubleValue < 0.0) {
            return new FloatObject(Number.NEGATIVE_INFINITY);
          } else {
            return new FloatObject(NaN); // 0.0/0.0 = NaN
          }
        }
        return new FloatObject(leftDoubleValue / rightDoubleValue);

      case "//":
        if (rightDoubleValue === 0.0) {
          return context.createError(
            "integer division by zero",
            node.position()
          );
        }

        return new IntegerObject(
          Math.floor(leftDoubleValue / rightDoubleValue)
        );

      case "%":
        return new FloatObject(leftDoubleValue % rightDoubleValue);

      // Comparison operations always return boolean
      case "==":
        return new BooleanObject(
          this.compareDoubles(leftDoubleValue, rightDoubleValue) === 0
        );

      case "!=":
        return new BooleanObject(
          this.compareDoubles(leftDoubleValue, rightDoubleValue) !== 0
        );

      case "<":
        return new BooleanObject(
          this.compareDoubles(leftDoubleValue, rightDoubleValue) < 0
        );

      case "<=":
        return new BooleanObject(
          this.compareDoubles(leftDoubleValue, rightDoubleValue) <= 0
        );

      case ">":
        return new BooleanObject(
          this.compareDoubles(leftDoubleValue, rightDoubleValue) > 0
        );

      case ">=":
        return new BooleanObject(
          this.compareDoubles(leftDoubleValue, rightDoubleValue) >= 0
        );

      default:
        return this.createInvalidOperatorError(
          operator,
          left,
          right,
          context,
          node
        );
    }
  }

  /**
   * 🔢 Converts a BaseObject to a double value if possible
   *
   * @param obj The object to convert
   * @returns The numeric value or null if conversion is not possible
   */
  private toDouble(obj: BaseObject): number | null {
    if (ObjectValidator.isInteger(obj)) {
      return obj.value;
    }
    if (ObjectValidator.isFloat(obj)) {
      return obj.value;
    }
    return null;
  }

  /**
   * 🔍 Compares two double values with proper NaN handling
   *
   * Mimics Java's Double.compare() behavior:
   * - NaN is considered equal to NaN
   * - NaN is greater than all other values
   * - Properly handles +0.0 vs -0.0
   *
   * @param a First value
   * @param b Second value
   * @returns -1 if a < b, 0 if a == b, 1 if a > b
   */
  private compareDoubles(a: number, b: number): number {
    if (Number.isNaN(a) && Number.isNaN(b)) {
      return 0;
    }
    if (Number.isNaN(a)) {
      return 1;
    }
    if (Number.isNaN(b)) {
      return -1;
    }

    if (a === 0 && b === 0) {
      if (1 / a === 1 / b) {
        return 0;
      }
      return 1 / a > 1 / b ? 1 : -1; // +0.0 > -0.0
    }

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  private evalBooleanInfixExpression(
    operator: string,
    left: BaseObject,
    right: BaseObject,
    context: EvaluationContext,
    node: InfixExpression
  ) {
    if (!ObjectValidator.isBoolean(left) || !ObjectValidator.isBoolean(right)) {
      return this.createTypeMismatchError(operator, left, right, context, node);
    }

    const leftBoolean = left.value;
    const rightBoolean = right.value;

    switch (operator) {
      case "==":
        return new BooleanObject(leftBoolean == rightBoolean);

      case "!=":
        return new BooleanObject(leftBoolean != rightBoolean);

      case "&&":
        return new BooleanObject(leftBoolean && rightBoolean);

      case "||":
        return new BooleanObject(leftBoolean || rightBoolean);

      default:
        return this.createInvalidOperatorError(
          operator,
          left,
          right,
          context,
          node
        );
    }
  }

  private evalInfixExpression(
    operator: string,
    left: BaseObject,
    right: BaseObject,
    context: EvaluationContext,
    node: InfixExpression
  ) {
    // Handle null operations first
    if (ObjectValidator.isNull(left) || ObjectValidator.isNull(right)) {
      return this.evalNullInfixExpression(operator, left, right);
    }

    if (ObjectValidator.isString(left) && ObjectValidator.isString(right)) {
      return this.evalStringInfixExpression(
        operator,
        left,
        right,
        context,
        node
      );
    }

    if (
      (ObjectValidator.isString(left) && ObjectValidator.isInteger(right)) ||
      (ObjectValidator.isInteger(left) && ObjectValidator.isString(right))
    ) {
      return this.evalStringIntegerConcatenation(
        operator,
        left,
        right,
        context,
        node
      );
    }

    if (ObjectValidator.isNumeric(left) && ObjectValidator.isNumeric(right)) {
      return this.evalNumericInfixExpression(
        operator,
        left,
        right,
        context,
        node
      );
    }

    if (ObjectValidator.isBoolean(left) && ObjectValidator.isBoolean(right))
      return this.evalBooleanInfixExpression(
        operator,
        left,
        right,
        context,
        node
      );

    return this.createInvalidOperatorError(
      operator,
      left,
      right,
      context,
      node
    );
  }

  /**
   * 🔤➕🔢 String-Integer concatenation operations
   *
   * Handles concatenation when one operand is a string and the other is an
   * integer.
   * Only supports the '+' operator for concatenation.
   */
  private evalStringIntegerConcatenation(
    operator: string,
    left: BaseObject,
    right: BaseObject,
    context: EvaluationContext,
    node: InfixExpression
  ) {
    if (operator !== "+") {
      return this.createInvalidOperatorError(
        operator,
        left,
        right,
        context,
        node
      );
    }

    let leftString: string;
    let rightString: string;

    if (ObjectValidator.isString(left) && ObjectValidator.isInteger(right)) {
      leftString = left.value;
      rightString = right.value.toString();
    } else if (
      ObjectValidator.isInteger(left) &&
      ObjectValidator.isString(right)
    ) {
      leftString = left.value.toString();
      rightString = right.value;
    } else {
      return this.createTypeMismatchError(operator, left, right, context, node);
    }

    return new StringObject(leftString + rightString);
  }

  private evalNullInfixExpression(
    operator: string,
    left: BaseObject,
    right: BaseObject
  ) {
    switch (operator) {
      case "==":
        // null == null -> true, null == anything -> false
        return new BooleanObject(
          ObjectValidator.isNull(left) && ObjectValidator.isNull(right)
        );

      case "!=":
        // null != null -> false, null != anything -> true
        return new BooleanObject(
          !(ObjectValidator.isNull(left) && ObjectValidator.isNull(right))
        );

      default:
        // All other operations with null are errors
        return new ErrorObject(
          "Cannot perform '" +
            operator +
            "' operation with null values. " +
            "Only equality (==) and inequality (!=) operations are supported with null."
        );
    }
  }

  private createInvalidOperatorError(
    operator: string,
    left: BaseObject,
    right: BaseObject,
    context: EvaluationContext,
    node: InfixExpression
  ) {
    const message =
      "Invalid operator '" +
      operator +
      "' for types " +
      left.type() +
      " and " +
      right.type() +
      ". This operation is not supported.";
    return context.createError(message, node.position());
  }

  private createTypeMismatchError(
    operator: string,
    left: BaseObject,
    right: BaseObject,
    context: EvaluationContext,
    node: InfixExpression
  ) {
    const message =
      "Type mismatch: " +
      left.type() +
      " " +
      operator +
      " " +
      right.type() +
      ". This operation is not supported.";
    return context.createError(message, node.position());
  }
}
