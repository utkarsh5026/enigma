import * as objects from "../objects";
import { truthy } from "./utils";
import * as validate from "./validate";

export const evalLogicalNotOperator = (
  right: objects.BaseObject
): objects.BaseObject => {
  const isBoolean = validate.isBoolean(right);

  if (isBoolean) {
    return truthy(right)
      ? new objects.BooleanObject(false)
      : new objects.BooleanObject(true);
  }

  if (validate.isNull(right)) return new objects.BooleanObject(true);

  return new objects.BooleanObject(false);
};

export const evalNegationOperator = (
  right: objects.BaseObject
): objects.BaseObject => {
  if (!validate.isInteger(right))
    return new objects.ErrorObject(
      `Unknown operator: -${right.type()}, You can only negate integers like -5, -x, etc.`
    );

  const intObj = right;
  return new objects.IntegerObject(intObj.value * -1);
};
