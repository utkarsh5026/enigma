import { IntegerLiteral, Expression } from "@/lang/ast";
import {
  ParserException,
  ParsingContext,
  PrefixExpressionParser,
} from "@/lang/parser/core";
import { TokenType } from "@/lang/token/token";

/**
 * 🔢 IntegerLiteralParser - Number Literal Specialist 🔢
 *
 * Handles integer literal expressions.
 *
 */
export class IntegerLiteralParser implements PrefixExpressionParser {
  public parsePrefix(context: ParsingContext): Expression {
    const intToken = context.consumeCurrentToken(TokenType.INT);

    try {
      const value = parseInt(intToken.literal);
      return new IntegerLiteral(intToken, value, intToken);
    } catch {
      throw new ParserException(
        "Invalid integer literal: " + intToken.literal,
        intToken
      );
    }
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.INT]);
  }
}
