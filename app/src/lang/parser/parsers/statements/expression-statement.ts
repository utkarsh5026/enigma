import {
  type Parser,
  ParsingContext,
  Precedence,
  type ExpressionParser,
  ParserException,
} from "@/lang/parser/core";
import { Token, TokenType, type Operator } from "@/lang/token/token";
import {
  ExpressionStatement,
  Identifier,
  AssignmentExpression,
  InfixExpression,
} from "@/lang/ast";

export class ExpressionStatementParser implements Parser<ExpressionStatement> {
  canParse(context: ParsingContext): boolean {
    return (
      context.isCurrentToken(TokenType.IDENTIFIER) ||
      context.isCurrentToken(TokenType.LPAREN)
    );
  }

  constructor(private expressionParser: ExpressionParser) {}

  /**
   * 🎯 Parse an expression statement
   *
   * Parses a statement of the form:
   * identifier = expression;
   *
   * @param context The parsing context
   * @return The parsed expression statement
   */
  parse(context: ParsingContext): ExpressionStatement {
    const token = context.getCurrentToken();

    if (
      context.isCurrentToken(TokenType.IDENTIFIER) &&
      this.isCompoundAssignmentOperator(context.getPeekToken().type)
    ) {
      return this.parseCompoundStatement(context);
    }

    const expression = this.expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );

    let endToken = expression.token;
    if (context.isCurrentToken(TokenType.SEMICOLON)) {
      endToken = context.consumeCurrentToken(TokenType.SEMICOLON);
    }

    return new ExpressionStatement(token, expression, endToken);
  }

  /**
   * 🎯 Parse a compound statement
   *
   * Parses a statement of the form:
   * identifier += expression or identifier -= expression
   *
   * @param context The parsing context
   * @return The parsed compound statement
   */
  private parseCompoundStatement(context: ParsingContext): ExpressionStatement {
    const startToken = context.consumeCurrentToken(
      TokenType.IDENTIFIER,
      "Expected identifier at start of compound statement"
    );
    const left = new Identifier(startToken, startToken.literal);

    const operatorToken = context.getCurrentToken();
    const operator = this.getBaseOperator(operatorToken);
    context.consumeCurrentToken(operatorToken.type);

    const right = this.expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );

    const endToken = context.consumeCurrentToken(
      TokenType.SEMICOLON,
      "Expected ';' after compound statement"
    );

    const infixExpr = new InfixExpression(
      operatorToken,
      left,
      operator,
      right,
      right.endToken
    );
    const assignExpr = new AssignmentExpression(
      operatorToken,
      left,
      infixExpr,
      infixExpr.endToken
    );

    return new ExpressionStatement(startToken, assignExpr, endToken);
  }

  /**
   * 🎯 Check if a token is a compound assignment operator
   *
   * @param tokenType The token type to check
   * @return True if the token is a compound assignment operator, false otherwise
   */
  private isCompoundAssignmentOperator(tokenType: TokenType): boolean {
    return (
      tokenType === TokenType.PLUS_ASSIGN ||
      tokenType === TokenType.MINUS_ASSIGN ||
      tokenType === TokenType.ASTERISK_ASSIGN ||
      tokenType === TokenType.SLASH_ASSIGN
    );
  }

  /**
   * 🎯 Get the base operator for a compound assignment operator
   *
   * @param token The token to get the base operator for
   * @return The base operator
   */
  private getBaseOperator(token: Token): Operator {
    switch (token.type) {
      case TokenType.PLUS_ASSIGN:
        return "+";
      case TokenType.MINUS_ASSIGN:
        return "-";
      case TokenType.ASTERISK_ASSIGN:
        return "*";
      case TokenType.SLASH_ASSIGN:
        return "/";
      case TokenType.MODULUS_ASSIGN:
        return "%";
      default:
        throw new ParserException(
          `Invalid base operator for token type: ${token.type}`,
          token
        );
    }
  }
}
