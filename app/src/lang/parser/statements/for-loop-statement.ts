import { TokenType } from "@/lang/token/token";
import { Parser, ParsingContext, Precedence } from "../core";
import * as statements from "@/lang/ast/statement";
import { ExpressionParser } from "../expression-parser";
import * as ast from "@/lang/ast/ast";
import { BlockStatementParser } from "./block-statement";

export class ForStatementParser implements Parser<statements.ForStatement> {
  constructor(
    private parseStatement: (context: ParsingContext) => ast.Statement | null
  ) {}

  canParse(context: ParsingContext): boolean {
    return context.tokens.isCurrentToken(TokenType.FOR);
  }

  parse(context: ParsingContext): statements.ForStatement | null {
    const forToken = context.tokens.getCurrentToken();

    if (!context.tokens.expect(TokenType.LPAREN)) {
      context.errors.addTokenError(
        TokenType.LPAREN,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    context.tokens.advance(); // Move past '('

    const init = this.parseStatement(context);
    if (!init) {
      context.errors.addError(
        "Expected initialization statement",
        context.tokens.getCurrentToken()
      );
      return null;
    }

    // Parse condition expression
    const expressionParser = new ExpressionParser(
      this.parseStatement.bind(this)
    );
    const condition = expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );
    if (!condition) {
      context.errors.addError(
        "Expected condition expression",
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

    context.tokens.advance();

    // Parse update expression
    const update = expressionParser.parseExpression(context, Precedence.LOWEST);
    if (!update) {
      context.errors.addError(
        "Expected update expression",
        context.tokens.getCurrentToken()
      );
      return null;
    }

    if (!context.tokens.expect(TokenType.RPAREN)) {
      context.errors.addTokenError(
        TokenType.RPAREN,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    if (!context.tokens.expect(TokenType.LBRACE)) {
      context.errors.addTokenError(
        TokenType.LBRACE,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    context.enterLoop();
    const blockParser = new BlockStatementParser(
      this.parseStatement.bind(this)
    );
    const body = blockParser.parse(context);
    context.exitLoop();

    if (!body) {
      context.errors.addError(
        "Expected body statement",
        context.tokens.getCurrentToken()
      );
      return null;
    }

    return new statements.ForStatement(forToken, init, condition, update, body);
  }
}
