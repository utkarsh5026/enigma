import { TokenType } from "@/lang/token/token";
import { Parser, ParsingContext, Precedence } from "../core";
import * as statements from "@/lang/ast/statement";
import * as ast from "@/lang/ast/ast";
import { ExpressionParser } from "../expression-parser";

export class ConstStatementParser implements Parser<statements.ConstStatement> {
  canParse(context: ParsingContext): boolean {
    return context.tokens.isCurrentToken(TokenType.CONST);
  }

  constructor(
    private parseStatement: (context: ParsingContext) => ast.Statement | null
  ) {}

  parse(context: ParsingContext): statements.ConstStatement | null {
    const constToken = context.tokens.getCurrentToken();

    if (!context.tokens.expect(TokenType.IDENTIFIER)) {
      context.addTokenError(
        TokenType.IDENTIFIER,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    const name = new ast.Identifier(
      context.tokens.getCurrentToken(),
      context.tokens.getCurrentToken().literal
    );

    if (!context.tokens.expect(TokenType.ASSIGN)) {
      context.errors.addTokenError(
        TokenType.ASSIGN,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    context.tokens.advance();

    const expressionParser = new ExpressionParser(
      this.parseStatement.bind(this)
    );
    const value = expressionParser.parseExpression(context, Precedence.LOWEST);

    if (!value) return null;

    if (!context.tokens.expect(TokenType.SEMICOLON)) {
      context.errors.addTokenError(
        TokenType.SEMICOLON,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    return new statements.ConstStatement(constToken, name, value);
  }
}
