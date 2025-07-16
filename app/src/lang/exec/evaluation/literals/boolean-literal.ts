import { NodeEvaluator } from "@/lang/exec/core";
import { BooleanExpression } from "@/lang/ast";
import { BaseObject, BooleanObject } from "@/lang/exec/objects";

export class BooleanLiteralEvaluator
  implements NodeEvaluator<BooleanExpression>
{
  public evaluate(node: BooleanExpression): BaseObject {
    return new BooleanObject(node.value);
  }
}
