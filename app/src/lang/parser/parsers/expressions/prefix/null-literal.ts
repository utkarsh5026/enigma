import { Expression, NullLiteral } from "@/lang/ast";
import { ParsingContext, PrefixExpressionParser } from "@/lang/parser/core";
import { TokenType } from "@/lang/token/token";

/**
 * 🔄 NullLiteralParser - Null Literal Specialist 🔄
 *
 * Handles null literal expressions.
 *
 */
export class NullLiteralParser implements PrefixExpressionParser {
  public parsePrefix(context: ParsingContext): Expression {
    const currToken = context.getCurrentToken();
    context.consumeCurrentToken(currToken.type);
    return new NullLiteral(currToken);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.NULL]);
  }
}
