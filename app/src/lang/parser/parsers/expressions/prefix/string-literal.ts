import { Expression, StringLiteral } from "@/lang/ast";
import { TokenType } from "@/lang/token/token";
import { PrefixExpressionParser, ParsingContext } from "@/lang/parser/core";

/**
 * 📝 StringLiteralParser - String Literal Specialist 📝
 *
 * Handles string literal expressions.
 *
 */
export class StringLiteralParser implements PrefixExpressionParser {
  public parsePrefix(context: ParsingContext): Expression {
    const token = context.consumeCurrentToken(
      TokenType.STRING,
      "Expected string literal"
    );
    return new StringLiteral(token, token.literal);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.STRING]);
  }
}
