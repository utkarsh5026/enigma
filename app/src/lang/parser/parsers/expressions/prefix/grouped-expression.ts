import {
  ExpressionParser,
  ParsingContext,
  Precedence,
  PrefixExpressionParser,
} from "@/lang/parser/core";
import { TokenType } from "@/lang/token/token";

/**
 * 🔗 GroupedExpressionParser - Parentheses Handler 🔗
 *
 * Handles grouped expressions wrapped in parentheses for precedence control.
 * This is a prefix parser because parentheses can start an expression.
 *
 * Examples:
 * - (2 + 3) * 4 - parentheses override normal precedence
 * - (x > 0) && (y < 10) - group boolean expressions for clarity
 * - ((a + b) * c) + d - nested grouping
 *
 * Note: LPAREN can be both prefix (grouped expression) and infix (function
 * call).
 * This class only handles the prefix case. CallExpressionParser handles infix.
 */
export class GroupedExpressionParser implements PrefixExpressionParser {
  constructor(private expressionParser: ExpressionParser) {}

  public parsePrefix(context: ParsingContext) {
    context.consumeCurrentToken(
      TokenType.LPAREN,
      "Grouped expression not opened should start with ("
    );
    const expression = this.expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );
    context.consumeCurrentToken(
      TokenType.RPAREN,
      "Grouped expression not closed should end with )"
    );
    return expression;
  }

  public getHandledTokenTypes(): Set<TokenType> {
    return new Set([TokenType.LPAREN]);
  }
}
