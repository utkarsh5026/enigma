import { EvaluationContext, NodeEvaluator } from "@/lang/exec/core";
import { StringLiteral } from "@/lang/ast";
import { BaseObject, Environment, StringObject } from "@/lang/exec/objects";

export class StringLiteralEvaluator implements NodeEvaluator<StringLiteral> {
  public evaluate(
    node: StringLiteral,
    env: Environment,
    context: EvaluationContext
  ): BaseObject {
    const stringObject = new StringObject(node.value);
    context.addAfterStep(
      node,
      env,
      stringObject,
      `String literal evaluated: "${node.value}"`
    );
    return stringObject;
  }
}
