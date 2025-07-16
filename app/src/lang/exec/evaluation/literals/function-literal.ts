import { FunctionLiteral } from "@/lang/ast";
import { Environment, BaseObject, FunctionObject } from "@/lang/exec/objects";
import { NodeEvaluator } from "@/lang/exec/core";

export class FunctionLiteralEvaluator
  implements NodeEvaluator<FunctionLiteral>
{
  public evaluate(node: FunctionLiteral, env: Environment): BaseObject {
    return new FunctionObject(node.parameters, node.body, env);
  }
}
