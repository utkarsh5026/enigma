import {
  ExpressionParser,
  ParsingContext,
  PrefixExpressionParser,
  ParserException,
} from "@/lang/parser/core";
import { Token, TokenType } from "@/lang/token/token";
import { parseExpressionList } from "@/lang/parser/utils/list-parsing";
import { Identifier, SuperExpression } from "@/lang/ast";

/**
 * ⬆️ SuperExpressionParser - Parent Class Access Parser ⬆️
 *
 * Parses 'super' expressions for accessing parent class methods.
 *
 * From first principles, super expression parsing involves:
 * 1. Parse 'super' keyword
 * 2. Check for constructor call super() or method call super.method()
 * 3. Parse arguments if present
 * 4. Create SuperExpression AST node
 *
 * Grammar:
 * ```
 * super-expression := 'super' ('(' argument-list ')' | '.' IDENTIFIER '('
 * argument-list ')')
 * ```
 */
export class SuperExpressionParser implements PrefixExpressionParser {
  constructor(readonly expressionParser: ExpressionParser) {}

  public parsePrefix(context: ParsingContext) {
    const superToken = context.consumeCurrentToken(
      TokenType.SUPER,
      "Expected 'super' keyword"
    );

    if (context.isCurrentToken(TokenType.LPAREN)) {
      return this.parseSuperConstructorCall(context, superToken);
    }

    if (context.isCurrentToken(TokenType.DOT)) {
      return this.parseSuperMethodCall(context, superToken);
    }

    throw new ParserException(
      "Expected '(' or '.' after 'super'",
      context.getCurrentToken()
    );
  }

  private parseSuperMethodCall(context: ParsingContext, superToken: Token) {
    context.consumeCurrentToken(TokenType.DOT, "Expected '.' after 'super'");

    const methodToken = context.consumeCurrentToken(
      TokenType.IDENTIFIER,
      "Expected method name after 'super.'"
    );
    const method = new Identifier(methodToken, methodToken.literal);

    context.consumeCurrentToken(
      TokenType.LPAREN,
      "Expected '(' after super method name"
    );

    const args = parseExpressionList(
      context,
      this.expressionParser,
      TokenType.RPAREN,
      "super method argument"
    );

    const endToken = context.consumeCurrentToken(
      TokenType.RPAREN,
      "Expected ')' after super method arguments"
    );

    return new SuperExpression(superToken, method, args, endToken);
  }

  private parseSuperConstructorCall(
    context: ParsingContext,
    superToken: Token
  ) {
    context.consumeCurrentToken(TokenType.LPAREN);

    const args = parseExpressionList(
      context,
      this.expressionParser,
      TokenType.RPAREN,
      "super constructor argument"
    );

    const endToken = context.consumeCurrentToken(
      TokenType.RPAREN,
      "Expected ')' after super arguments"
    );

    return new SuperExpression(superToken, null, args, endToken);
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.SUPER]);
  }
}
