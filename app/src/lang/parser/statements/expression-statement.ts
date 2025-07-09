import { Parser, ParsingContext, Precedence } from "../core";
import * as statements from "@/lang/ast/statement";
import * as ast from "@/lang/ast/ast";
import { ExpressionParser } from "../expression-parser";
import * as expressions from "@/lang/ast/expression";
import { TokenType, Operator } from "@/lang/token/token";

export class ExpressionStatementParser
  implements Parser<statements.ExpressionStatement>
{
  canParse(context: ParsingContext): boolean {
    return (
      context.tokens.isCurrentToken(TokenType.IDENTIFIER) ||
      context.tokens.isCurrentToken(TokenType.LPAREN)
    );
  }

  constructor(
    private parseStatement: (context: ParsingContext) => ast.Statement | null
  ) {}

  parse(context: ParsingContext): statements.ExpressionStatement | null {
    const token = context.tokens.getCurrentToken();

    // Handle compound assignment operators
    if (
      context.tokens.isCurrentToken(TokenType.IDENTIFIER) &&
      this.isCompoundAssignmentOperator(context.tokens.getPeekToken().type)
    ) {
      return this.parseCompoundStatement(context);
    }

    const expressionParser = new ExpressionParser(
      this.parseStatement.bind(this)
    );
    const expression = expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );

    if (!expression) {
      context.errors.addError(
        "Expected expression",
        context.tokens.getCurrentToken()
      );
      return null;
    }

    if (context.tokens.isPeekToken(TokenType.SEMICOLON)) {
      context.tokens.advance();
    }

    return new statements.ExpressionStatement(token, expression);
  }

  private parseCompoundStatement(
    context: ParsingContext
  ): statements.ExpressionStatement | null {
    const startToken = context.tokens.getCurrentToken();
    const left = new ast.Identifier(startToken, startToken.literal);
    context.tokens.advance();

    const operatorToken = context.tokens.getCurrentToken();
    const operator = this.getBaseOperator(operatorToken.type);
    context.tokens.advance();

    const expressionParser = new ExpressionParser(
      this.parseStatement.bind(this)
    );
    const right = expressionParser.parseExpression(context, Precedence.LOWEST);
    if (!right) {
      context.errors.addError(
        "Expected expression",
        context.tokens.getCurrentToken()
      );
      return null;
    }

    if (!context.tokens.expect(TokenType.SEMICOLON)) {
      context.errors.addTokenError(
        TokenType.SEMICOLON,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    const infixExpr = new expressions.InfixExpression(
      operatorToken,
      left,
      operator,
      right
    );
    const assignExpr = new expressions.AssignmentExpression(
      operatorToken,
      left,
      infixExpr
    );

    return new statements.ExpressionStatement(startToken, assignExpr);
  }

  private isCompoundAssignmentOperator(tokenType: TokenType): boolean {
    return (
      tokenType === TokenType.PLUS_ASSIGN ||
      tokenType === TokenType.MINUS_ASSIGN ||
      tokenType === TokenType.ASTERISK_ASSIGN ||
      tokenType === TokenType.SLASH_ASSIGN
    );
  }

  private getBaseOperator(tokenType: TokenType): Operator {
    switch (tokenType) {
      case TokenType.PLUS_ASSIGN:
        return "+";
      case TokenType.MINUS_ASSIGN:
        return "-";
      case TokenType.ASTERISK_ASSIGN:
        return "*";
      case TokenType.SLASH_ASSIGN:
        return "/";
      default:
        throw new Error(`Invalid base operator for token type: ${tokenType}`);
    }
  }
}
