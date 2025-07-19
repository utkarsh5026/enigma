import {
  LetStatementParser,
  ConstStatementParser,
  ReturnStatementParser,
  WhileStatementParser,
  ForStatementParser,
  BreakStatementParser,
  ContinueStatementParser,
  BlockStatementParser,
  ExpressionStatementParser,
} from "@/lang/parser/parsers/statements";
import {
  ExpressionParser,
  Parser,
  ParsingContext,
  StatementParse,
} from "../core";
import { Statement } from "@/lang/ast/ast";
import { LanguageExpressionParser } from "../parsers/laguage-expression";

export class StatementParserRegistry implements StatementParse {
  private parsers: Parser<Statement>[] = [];
  private expressionParser: ExpressionParser;

  constructor() {
    this.expressionParser = new LanguageExpressionParser(this);
    this.registerDefaultParsers();
  }

  private registerDefaultParsers(): void {
    this.addParser(new LetStatementParser(this.expressionParser));
    this.addParser(new ConstStatementParser(this.expressionParser));
    this.addParser(new ReturnStatementParser(this.expressionParser));

    // Control flow
    this.addParser(new WhileStatementParser(this, this.expressionParser));
    this.addParser(new ForStatementParser(this, this.expressionParser));
    this.addParser(new BreakStatementParser());
    this.addParser(new ContinueStatementParser());

    this.addParser(new BlockStatementParser(this));
  }

  findParser(context: ParsingContext): Parser<Statement> | null {
    return this.parsers.find((parser) => parser.canParse(context)) || null;
  }

  addParser(parser: Parser<Statement>): void {
    this.parsers.push(parser);
  }

  removeParser(parserType: new () => Parser<Statement>): void {
    this.parsers = this.parsers.filter(
      (parser) => !(parser instanceof parserType)
    );
  }

  parseStatement(context: ParsingContext): Statement {
    const parser = this.findParser(context);

    if (parser) {
      return parser.parse(context);
    }

    const expressionStatementParser = new ExpressionStatementParser(
      this.expressionParser
    );
    return expressionStatementParser.parse(context);
  }
}
