import { TokenType } from "@/lang/token/token";
import {
  ExpressionParser,
  ParsingContext,
  Precedence,
  ParserException,
} from "../core";
import { Expression } from "@/lang/ast/ast";

/**
 * 📝 Parses a comma-separated list of expressions
 *
 * @param context          The parsing context
 * @param expressionParser The expression parser to use
 * @param closingDelimiter The token that ends the list (e.g., RPAREN, RBRACKET,
 *                         RBRACE)
 * @param contextName      Description for error messages (e.g., "function
 *                         arguments", "array elements")
 * @return List of parsed expressions
 */
export const parseExpressionList = (
  context: ParsingContext,
  expressionParser: ExpressionParser,
  closingDelimiter: TokenType,
  contextName: string
): Expression[] => {
  const expressions: Expression[] = [];

  if (context.isCurrentToken(closingDelimiter)) {
    return expressions;
  }

  while (!context.isCurrentToken(closingDelimiter)) {
    const expression = expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );
    expressions.push(expression);

    if (
      !context.isCurrentToken(TokenType.COMMA) &&
      !context.isCurrentToken(closingDelimiter)
    ) {
      const expectedDelimiter = getDelimiterName(closingDelimiter);
      throw new ParserException(
        `Expected ',' or '${expectedDelimiter}' after ${contextName}`,
        context.getCurrentToken()
      );
    }

    if (context.isCurrentToken(TokenType.COMMA)) {
      context.consumeCurrentToken(TokenType.COMMA);
    }
  }

  return expressions;
};

/**
 * 🔤 Gets human-readable name for delimiter tokens
 */
function getDelimiterName(delimiter: TokenType) {
  switch (delimiter) {
    case TokenType.RPAREN:
      return ")";
    case TokenType.RBRACKET:
      return "]";
    case TokenType.RBRACE:
      return "}";
    default:
      return delimiter.toString();
  }
}
