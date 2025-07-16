import { NodeEvaluator } from "@/lang/exec/core";
import { NullLiteral } from "@/lang/ast";
import { BaseObject, NullObject } from "@/lang/exec/objects";

export class NullLiteralEvaluator implements NodeEvaluator<NullLiteral> {
  public evaluate(): BaseObject {
    return NullObject.INSTANCE;
  }
}
