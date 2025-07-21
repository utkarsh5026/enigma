import { TokenType } from "@/lang/token/token";
import {
  type Parser,
  ParsingContext,
  Precedence,
  type ExpressionParser,
} from "@/lang/parser/core";
import { NullLiteral, ReturnStatement } from "@/lang/ast";

export class ReturnStatementParser implements Parser<ReturnStatement> {
  constructor(private expressionParser: ExpressionParser) {}

  canParse(context: ParsingContext): boolean {
    return context.tokens.isCurrentToken(TokenType.RETURN);
  }

  /**
   * 🎯 Parse a return statement
   *
   * Parses a statement of the form:
   * return expression;
   *
   * @param context The parsing context
   * @return The parsed return statement
   */
  parse(context: ParsingContext): ReturnStatement {
    const returnToken = context.consumeCurrentToken(
      TokenType.RETURN,
      "Expected 'return' at start of return statement"
    );

    if (context.isCurrentToken(TokenType.SEMICOLON)) {
      const endToken = context.consumeCurrentToken(TokenType.SEMICOLON);
      return new ReturnStatement(
        returnToken,
        new NullLiteral(returnToken, returnToken),
        endToken
      );
    }

    const returnValue = this.expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );

    const endToken = context.consumeCurrentToken(
      TokenType.SEMICOLON,
      "Expected ';' after return value"
    );
    return new ReturnStatement(returnToken, returnValue, endToken);
  }
}
