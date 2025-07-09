import { TokenType } from "@/lang/token/token";
import { Parser, ParsingContext } from "../core";
import * as statements from "@/lang/ast/statement";
import * as ast from "@/lang/ast/ast";

export class BlockStatementParser implements Parser<statements.BlockStatement> {
  canParse(context: ParsingContext): boolean {
    return context.tokens.isCurrentToken(TokenType.LBRACE);
  }

  constructor(
    private parseStatement: (context: ParsingContext) => ast.Statement | null
  ) {}

  parse(context: ParsingContext): statements.BlockStatement | null {
    const token = context.tokens.getCurrentToken();
    const stmts: ast.Statement[] = [];

    context.tokens.advance();

    while (
      !context.tokens.isCurrentToken(TokenType.RBRACE) &&
      !context.tokens.isCurrentToken(TokenType.EOF)
    ) {
      const statement = this.parseStatement(context);
      if (statement) stmts.push(statement);
      context.tokens.advance();
    }

    return new statements.BlockStatement(token, stmts);
  }
}
