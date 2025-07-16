import { NodeEvaluator } from "@/lang/exec/core";
import { StringLiteral } from "@/lang/ast";
import { BaseObject, StringObject } from "@/lang/exec/objects";

export class StringLiteralEvaluator implements NodeEvaluator<StringLiteral> {
  public evaluate(node: StringLiteral): BaseObject {
    return new StringObject(node.value);
  }
}
