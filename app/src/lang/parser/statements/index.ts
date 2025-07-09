import { Parser } from "../core";
import * as ast from "@/lang/ast/ast";
import { ParsingContext } from "../core";
import { LetStatementParser } from "./let-statement";
import { ConstStatementParser } from "./const-statement";
import { ReturnStatementParser } from "./return-statement";
import { WhileStatementParser } from "./while-loop-statement";
import { ForStatementParser } from "./for-loop-statement";
import { BreakStatementParser, ContinueStatementParser } from "./loop-control";
import { BlockStatementParser } from "./block-statement";
import { ExpressionStatementParser } from "./expression-statement";

export class StatementParserRegistry {
  private parsers: Parser<ast.Statement>[] = [];

  constructor() {
    this.registerDefaultParsers();
  }

  private registerDefaultParsers(): void {
    // Core statements
    this.addParser(new LetStatementParser(this.parseStatement.bind(this)));
    this.addParser(new ConstStatementParser(this.parseStatement.bind(this)));
    this.addParser(new ReturnStatementParser(this.parseStatement.bind(this)));

    // Control flow
    this.addParser(new WhileStatementParser(this.parseStatement.bind(this)));
    this.addParser(new ForStatementParser(this.parseStatement.bind(this)));
    this.addParser(new BreakStatementParser());
    this.addParser(new ContinueStatementParser());

    this.addParser(new BlockStatementParser(this.parseStatement.bind(this)));
  }

  findParser(context: ParsingContext): Parser<ast.Statement> | null {
    return this.parsers.find((parser) => parser.canParse(context)) || null;
  }

  addParser(parser: Parser<ast.Statement>): void {
    this.parsers.push(parser);
  }

  removeParser(parserType: new () => Parser<ast.Statement>): void {
    this.parsers = this.parsers.filter(
      (parser) => !(parser instanceof parserType)
    );
  }

  parseStatement(context: ParsingContext): ast.Statement | null {
    const parser = this.findParser(context);

    if (parser) {
      return parser.parse(context);
    }

    // Default to expression statement
    const expressionStatementParser = new ExpressionStatementParser(
      this.parseStatement.bind(this)
    );
    return expressionStatementParser.parse(context);
  }
}

export {
  LetStatementParser,
  ConstStatementParser,
  ReturnStatementParser,
  WhileStatementParser,
  ForStatementParser,
  BreakStatementParser,
  ContinueStatementParser,
  BlockStatementParser,
  ExpressionStatementParser,
};
