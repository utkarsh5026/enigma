import * as objects from "../objects";
import { ObjectValidator } from "../core/validate";

export const evalLogicalNotOperator = (
  right: objects.BaseObject
): objects.BaseObject => {
  const isBoolean = ObjectValidator.isBoolean(right);

  if (isBoolean) {
    return ObjectValidator.isTruthy(right)
      ? new objects.BooleanObject(false)
      : new objects.BooleanObject(true);
  }

  if (ObjectValidator.isNull(right)) return new objects.BooleanObject(true);

  return new objects.BooleanObject(false);
};

export const evalNegationOperator = (
  right: objects.BaseObject
): objects.BaseObject => {
  if (!ObjectValidator.isInteger(right))
    return new objects.ErrorObject(
      `Unknown operator: -${right.type()}, You can only negate integers like -5, -x, etc.`
    );

  const intObj = right;
  return new objects.IntegerObject(intObj.value * -1);
};
