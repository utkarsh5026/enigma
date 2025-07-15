import { Expression } from "@/lang/ast/ast";
import { StringLiteral } from "@/lang/ast/literal";
import { TokenType } from "@/lang/token/token";
import { PrefixExpressionParser } from "@/lang/parser/core";
import { ParsingContext } from "@/lang/parser/core";

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
