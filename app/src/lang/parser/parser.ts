import {
  ExpressionParser,
  ParseError,
  Parser,
  ParserException,
  ParsingContext,
  Precedence,
} from "./core";
import Lexer from "@/lang/lexer/lexer";
import { TokenType } from "@/lang/token/token";
import { StatementParserRegistry } from "./registry";
import { LanguageExpressionParser } from "./parsers/laguage-expression";
import { Expression, Program, Statement } from "@/lang/ast/ast";

/**
 * Main Parser class that coordinates the entire parsing process.
 *
 * This is the main entry point for parsing. It:
 * 1. Takes a Lexer as input
 * 2. Creates a parsing context
 * 3. Uses the statement parser registry to parse the program
 * 4. Handles errors and recovery
 */
export class LanguageParser {
  private context: ParsingContext;
  private statementRegistry: StatementParserRegistry;
  private expressionParser: ExpressionParser;

  constructor(lexer: Lexer) {
    this.context = new ParsingContext(lexer);
    this.statementRegistry = new StatementParserRegistry();
    this.expressionParser = new LanguageExpressionParser(
      this.statementRegistry
    );
  }

  /**
   * Parses the entire program.
   *
   * @return A Program AST node containing all parsed statements
   */
  public parseProgram(): Program {
    const statements: Statement[] = [];

    while (!this.context.isAtEnd()) {
      try {
        const statement = this.parseStatement();
        if (statement != null) {
          statements.push(statement);
        }
      } catch (e) {
        if (e instanceof ParserException) {
          const token = e.getToken();
          if (token !== undefined) {
            this.context.errors.addError(e.message, token);
          }
        }
        this.synchronize();
      }
    }

    return new Program();
  }

  /**
   * Parses a single statement.
   */
  private parseStatement(): Statement {
    return this.statementRegistry.parseStatement(this.context);
  }

  /**
   * Error recovery: skip tokens until we find a safe point to resume parsing.
   */
  private synchronize() {
    console.log("Synchronizing...");
    this.context.tokens.advance();

    while (!this.context.isAtEnd()) {
      // If we see a semicolon, we're probably at the end of a statement
      if (this.context.isCurrentToken(TokenType.SEMICOLON)) {
        this.context.tokens.advance();
        return;
      }

      // If we see the start of a new statement, we can resume
      switch (this.context.getPeekToken().type) {
        case TokenType.CLASS:
        case TokenType.FUNCTION:
        case TokenType.LET:
        case TokenType.CONST:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.RETURN:
          return;
        default:
          this.context.tokens.advance();
      }
    }
  }
  /**
   * Checks if any parsing errors occurred.
   */
  public hasErrors(): boolean {
    return this.context.errors.hasErrors();
  }

  /**
   * Adds a custom statement parser.
   */
  public addStatementParser(parser: Parser<Statement>) {
    this.statementRegistry.addParser(parser);
  }

  /**
   * Removes a statement parser.
   */
  public removeStatementParser(parserType: new () => Parser<Statement>) {
    this.statementRegistry.removeParser(parserType);
  }

  /**
   * Parses a single expression (useful for REPL or testing).
   */
  public parseExpression(): Expression {
    return this.expressionParser.parseExpression(
      this.context,
      Precedence.LOWEST
    );
  }

  /**
   * Gets all parsing errors.
   */
  public getErrors(): ParseError[] {
    return this.context.errors.getErrors();
  }

  /**
   * Parses expressions from a string (convenience method).
   */
  public static parseExpressionFromString(input: string): Expression {
    const lexer = new Lexer(input);
    const parser = new LanguageParser(lexer);
    return parser.parseExpression();
  }

  /**
   * Parses a program from a string (convenience method).
   */
  public static parseProgramFromString(input: string): Program {
    const lexer = new Lexer(input);
    const parser = new LanguageParser(lexer);
    return parser.parseProgram();
  }
}
