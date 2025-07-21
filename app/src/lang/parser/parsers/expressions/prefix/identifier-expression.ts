import { Identifier } from "@/lang/ast/expressions";
import { ParsingContext, PrefixExpressionParser } from "@/lang/parser/core";
import { TokenType } from "@/lang/token/token";

/**
 * 🔤 IdentifierExpressionParser - Identifier Specialist 🔤
 *
 * Handles identifier expressions.
 *
 * Examples:
 * - x
 * - my_variable
 * - some_function_call
 *
 */
export class IdentifierExpressionParser implements PrefixExpressionParser {
  public parsePrefix(context: ParsingContext) {
    const identifierToken = context.consumeCurrentToken(
      TokenType.IDENTIFIER,
      "Expected identifier"
    );
    return new Identifier(identifierToken, identifierToken.literal);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.IDENTIFIER]);
  }
}
