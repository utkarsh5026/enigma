import { NodeEvaluator } from "@/lang/exec/core";
import { Identifier } from "@/lang/ast/ast";
import { Environment, BaseObject, ErrorObject } from "@/lang/exec/objects";
import { isBuiltin, getBuiltin } from "@/lang/exec/builtins";

export class IndentifierEvaluator implements NodeEvaluator<Identifier> {
  public evaluate(node: Identifier, env: Environment): BaseObject {
    const value = env.get(node.value);
    if (value !== null) {
      return value;
    }

    if (isBuiltin(node.value)) {
      return getBuiltin(node.value) as BaseObject;
    }

    return new ErrorObject(`identifier not found: ${node.value}`);
  }
}
