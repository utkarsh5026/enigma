import { TokenType } from "@/lang/token/token";
import { Parser, ParsingContext, Precedence } from "../core";
import * as statements from "@/lang/ast/statement";
import { ExpressionParser } from "../expression-parser";
import { BlockStatementParser } from "./block-statement";
import * as ast from "@/lang/ast/ast";

export class WhileStatementParser implements Parser<statements.WhileStatement> {
  constructor(
    private parseStatement: (context: ParsingContext) => ast.Statement | null
  ) {}

  canParse(context: ParsingContext): boolean {
    return context.tokens.isCurrentToken(TokenType.WHILE);
  }

  parse(context: ParsingContext): statements.WhileStatement | null {
    const whileToken = context.tokens.getCurrentToken();

    if (!context.tokens.expect(TokenType.LPAREN)) {
      context.errors.addTokenError(
        TokenType.LPAREN,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    context.tokens.advance();
    const expressionParser = new ExpressionParser(
      this.parseStatement.bind(this)
    );
    const condition = expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );

    if (!condition) return null;

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

    if (!body) return null;

    return new statements.WhileStatement(whileToken, condition, body);
  }
}
