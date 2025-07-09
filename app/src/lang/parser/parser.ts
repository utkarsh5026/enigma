import { ParsingContext } from "./core";
import Lexer from "@/lang/lexer/lexer";
import { TokenType } from "@/lang/token/token";
import * as ast from "@/lang/ast/ast";
import { Parser, ParseError } from "./core";
import { StatementParserRegistry } from "./statements";

export class EnigmaParser {
  private context: ParsingContext;
  private statementRegistry: StatementParserRegistry;

  constructor(lexer: Lexer) {
    this.context = new ParsingContext(lexer);
    this.statementRegistry = new StatementParserRegistry();
  }

  parseProgram(): ast.Program {
    const program = new ast.Program();

    while (!this.context.tokens.isCurrentToken(TokenType.EOF)) {
      try {
        const statement = this.parseStatement();
        if (statement) {
          program.statements.push(statement);
        }
      } catch (error) {
        if (error instanceof Error) {
          this.context.errors.addError(
            error.message,
            this.context.tokens.getCurrentToken()
          );
        }
        this.synchronize();
      }

      this.context.tokens.advance();
    }

    return program;
  }

  private parseStatement(): ast.Statement | null {
    return this.statementRegistry.parseStatement(this.context);
  }

  private synchronize(): void {
    this.context.tokens.advance();

    while (!this.context.tokens.isCurrentToken(TokenType.EOF)) {
      if (this.context.tokens.isCurrentToken(TokenType.SEMICOLON)) {
        this.context.tokens.advance();
        return;
      }

      switch (this.context.tokens.getPeekToken().type) {
        case TokenType.CLASS:
        case TokenType.FUNCTION:
        case TokenType.LET:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.RETURN:
          return;
      }

      this.context.tokens.advance();
    }
  }

  getErrors(): ParseError[] {
    return this.context.errors.getErrors();
  }

  // Extension API
  addStatementParser(parser: Parser<ast.Statement>): void {
    this.statementRegistry.addParser(parser);
  }

  removeStatementParser(parserType: new () => Parser<ast.Statement>): void {
    this.statementRegistry.removeParser(parserType);
  }

  // Get parsing context for custom parsers
  getContext(): ParsingContext {
    return this.context;
  }
}
