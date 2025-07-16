import { NodeEvaluator } from "@/lang/exec/core";
import { IntegerLiteral } from "@/lang/ast";
import { BaseObject, IntegerObject } from "@/lang/exec/objects";

export class IntegerLiteralEvaluator implements NodeEvaluator<IntegerLiteral> {
  public evaluate(node: IntegerLiteral): BaseObject {
    return new IntegerObject(node.value);
  }
}
