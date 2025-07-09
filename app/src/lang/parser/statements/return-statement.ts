import { TokenType } from "@/lang/token/token";
import { Parser, ParsingContext, Precedence } from "../core";
import * as statements from "@/lang/ast/statement";
import { ExpressionParser } from "../expression-parser";
import * as ast from "@/lang/ast/ast";

export class ReturnStatementParser
  implements Parser<statements.ReturnStatement>
{
  constructor(
    private parseStatement: (context: ParsingContext) => ast.Statement | null
  ) {}

  canParse(context: ParsingContext): boolean {
    return context.tokens.isCurrentToken(TokenType.RETURN);
  }

  parse(context: ParsingContext): statements.ReturnStatement | null {
    const returnToken = context.tokens.getCurrentToken();
    context.tokens.advance();

    const expressionParser = new ExpressionParser(
      this.parseStatement.bind(this)
    );
    const returnValue = expressionParser.parseExpression(
      context,
      Precedence.LOWEST
    );

    if (!returnValue) return null;

    if (!context.tokens.expect(TokenType.SEMICOLON)) {
      context.errors.addTokenError(
        TokenType.SEMICOLON,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    return new statements.ReturnStatement(returnToken, returnValue);
  }
}
