import { Token, TokenType } from "@/lang/token/token";
import { type Parser, ParsingContext, type ExpressionParser } from "../core";
import { AssignmentStatementParser } from "./assignment-parser";
import { ConstStatement } from "@/lang/ast/statement";
import { Expression, Identifier } from "@/lang/ast/ast";

export class ConstStatementParser implements Parser<ConstStatement> {
  private delegate: AssignmentStatementParser<ConstStatement>;

  constructor(expressionParser: ExpressionParser) {
    this.delegate = new AssignmentStatementParser(
      TokenType.CONST,
      {
        create: (token: Token, name: Identifier, value: Expression) =>
          new ConstStatement(token, name, value),
      },
      expressionParser
    );
  }

  canParse(context: ParsingContext): boolean {
    return this.delegate.canParse(context);
  }

  parse(context: ParsingContext): ConstStatement {
    return this.delegate.parse(context);
  }
}
