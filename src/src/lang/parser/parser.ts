import Lexer from "../lexer/lexer";
import { Token, TokenType } from "../token/token";
import {
  ArrayLiteral,
  FunctionLiteral,
  HashLiteral,
  IntegerLiteral,
  StringLiteral,
} from "../ast/literal.ts";
import { Expression, Identifier, Program, Statement } from "../ast/ast.ts";
import {
  BlockStatement,
  BreakStatement,
  ContinueStatement,
  ExpressionStatement,
  LetStatement,
  ReturnStatement,
  WhileStatement,
} from "../ast/statement.ts";
import { getPrecedence, Precedence } from "./precedence.ts";
import {
  AssignmentExpression,
  BooleanExpression,
  CallExpression,
  IfExpression,
  IndexExpression,
  InfixExpression,
  PrefixExpression,
} from "../ast/expression.ts";

/**
 * Represents a function that parses a prefix expression.
 * @returns {Expression | null} The parsed expression or null if parsing fails.
 */
type PrefixParseFunction = () => Expression | null;

/**
 * Represents a function that parses an infix expression.
 * @param {Expression} expression The left-hand side expression.
 * @returns {Expression | null} The parsed expression or null if parsing fails.
 */
type InfixParseFunction = (expression: Expression) => Expression | null;

/**
 * Parser class responsible for parsing tokens into an Abstract Syntax Tree (AST).
 */
export class Parser {
  private lexer: Lexer;
  private currentToken!: Token;
  private peekToken!: Token;
  private errors: string[] = [];
  private loopDepth: number = 0;
  private prefixParseFunctions: Record<TokenType, PrefixParseFunction>;
  private infixParseFunctions: Record<TokenType, InfixParseFunction>;

  /**
   * Creates a new Parser instance.
   * @param {Lexer} lexer The lexer to use for tokenization.
   */
  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.prefixParseFunctions = {} as Record<TokenType, PrefixParseFunction>;
    this.infixParseFunctions = {} as Record<TokenType, InfixParseFunction>;
    this.createPrefixFnMap();
    this.createInfixFnMap();

    this.forward();
    this.forward();
  }

  /**
   * Parses the entire program and returns the AST.
   * @returns {Program} The parsed program as an AST.
   */
  public parseProgram(): Program {
    const program = new Program();
    while (this.currentToken.type !== TokenType.EOF) {
      const stmt = this.parseStatement();
      if (stmt !== null) program.statements.push(stmt);

      this.forward();
    }

    return program;
  }

  /**
   * Returns any parsing errors that occurred during parsing.
   * @returns {string[]} An array of error messages.
   */
  public parserErrors(): string[] {
    return this.errors;
  }

  /**
   * Parses a single statement.
   * @returns {Statement | null} The parsed statement or null if parsing fails.
   * @private
   */
  private parseStatement(): Statement | null {
    switch (this.currentToken.type) {
      case TokenType.LET:
        return this.parseLetStatement();

      case TokenType.RETURN:
        return this.parseReturnStatement();

      case TokenType.WHILE:
        return this.parseWhileStatement();

      case TokenType.BREAK:
        return this.parseBreakStatement();

      case TokenType.CONTINUE:
        return this.parseContinueStatement();

      default:
        return this.parseExpressionStatement();
    }
  }

  /**
   * Parses a let statement.
   * @returns {LetStatement | null} The parsed let statement or null if parsing fails.
   * @private
   */
  private parseLetStatement(): LetStatement | null {
    const letToken = this.currentToken;
    if (!this.expectPeekToken(TokenType.IDENTIFIER)) return null;

    const name = new Identifier(this.currentToken, this.currentToken.literal);
    if (!this.expectPeekToken(TokenType.ASSIGN)) return null;

    this.forward();
    const value = this.parseExpression(Precedence.LOWEST);
    if (value === null) return null;

    if (!this.expectPeekToken(TokenType.SEMICOLON)) return null;
    this.forward();

    return new LetStatement(letToken, name, value);
  }

  /**
   * Parses a return statement.
   * @returns {ReturnStatement | null} The parsed return statement or null if parsing fails.
   * @private
   */
  private parseReturnStatement(): ReturnStatement | null {
    const returnToken = this.currentToken;
    this.forward();

    const returnValue = this.parseExpression(Precedence.LOWEST);
    if (returnValue === null) return null;

    if (!this.expectPeekToken(TokenType.SEMICOLON)) return null;
    this.forward();

    return new ReturnStatement(returnToken, returnValue);
  }

  /**
   * Parses a while statement.
   * @returns {WhileStatement | null} The parsed while statement or null if parsing fails.
   * @private
   */
  private parseWhileStatement(): WhileStatement | null {
    const whileToken = this.currentToken;

    if (!this.expectPeekToken(TokenType.LPAREN)) return null;
    this.forward();

    const condition = this.parseExpression(Precedence.LOWEST);
    if (condition == null || !this.expectPeekToken(TokenType.RPAREN))
      return null;

    if (!this.expectPeekToken(TokenType.LBRACE)) return null;

    this.loopDepth++;
    const body = this.parseBlockStatement();
    this.loopDepth--;

    return new WhileStatement(whileToken, condition, body);
  }

  /**
   * Parses a break statement.
   * @returns {BreakStatement | null} The parsed break statement or null if parsing fails.
   * @private
   */
  private parseBreakStatement(): BreakStatement | null {
    if (this.loopDepth === 0) {
      this.errors.push(`Break statement must be inside a loop.`);
      return null;
    }

    const breakToken = this.currentToken;
    if (!this.handleEnd()) return null;

    return new BreakStatement(breakToken);
  }

  /**
   * Parses a continue statement.
   * @returns {ContinueStatement | null} The parsed continue statement or null if parsing fails.
   * @private
   */
  private parseContinueStatement(): ContinueStatement | null {
    if (this.loopDepth === 0) {
      this.errors.push(`Continue statement must be inside a loop.`);
      return null;
    }

    const continueToken = this.currentToken;
    if (!this.handleEnd()) return null;

    return new ContinueStatement(continueToken);
  }

  /**
   * Parses an expression statement.
   * @returns {ExpressionStatement | null} The parsed expression statement or null if parsing fails.
   * @private
   */
  private parseExpressionStatement(): ExpressionStatement | null {
    const token = this.currentToken;

    if (
      this.isCurrentToken(TokenType.IDENTIFIER) &&
      this.isCompoundAssignmentOperator(this.peekToken.type)
    ) {
      return this.parseCompoundStatement();
    }

    const expression = this.parseExpression(Precedence.LOWEST);

    if (expression === null) return null;

    if (this.isPeekTokenOfType(TokenType.SEMICOLON)) this.forward();

    return new ExpressionStatement(token, expression);
  }

  /**
   * Parses a compound assignment statement (e.g., +=, -=, *=, /=).
   * This method handles the parsing of statements like "x += 5" or "y *= 2".
   *
   * @returns {ExpressionStatement | null} The parsed compound assignment statement as an ExpressionStatement,
   *                                       or null if parsing fails.
   * @private
   */
  private parseCompoundStatement(): ExpressionStatement | null {
    const startToken = this.currentToken;
    const left = new Identifier(startToken, startToken.literal);
    this.forward();

    const operatorToken = this.currentToken;
    const operator = this.getBaseOperator(operatorToken.type);
    this.forward();

    const right = this.parseExpression(Precedence.LOWEST);
    if (right === null) return null;

    if (!this.handleEnd()) return null;

    const infixExpr = new InfixExpression(operatorToken, left, operator, right);
    const assignExpr = new AssignmentExpression(operatorToken, left, infixExpr);

    return new ExpressionStatement(startToken, assignExpr);
  }

  /**
   * Advances the parser to the next token.
   * @private
   */
  private forward(): void {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  /**
   * Checks if the peek token is of the specified type.
   * @param {TokenType} type The token type to check for.
   * @returns {boolean} True if the peek token matches the specified type, false otherwise.
   * @private
   */
  private isPeekTokenOfType(type: TokenType): boolean {
    return this.peekToken.type === type;
  }

  /**
   * Expects the peek token to be of the specified type and advances if it is.
   * @param {TokenType} type The expected token type.
   * @returns {boolean} True if the peek token matches and the parser advanced, false otherwise.
   * @private
   */
  private expectPeekToken(type: TokenType): boolean {
    if (this.isPeekTokenOfType(type)) {
      this.forward();
      return true;
    } else {
      this.addTokenTypeError(type);
      return false;
    }
  }

  /**
   * Adds a token type error to the error list.
   * @param {TokenType} type The expected token type.
   * @private
   */
  private addTokenTypeError(type: TokenType): void {
    const message = `Expected next token to be ${type}, got ${this.peekToken.type} instead`;
    this.errors.push(message);
  }

  /**
   * Parses an expression with the given precedence.
   * @param {Precedence} precedence The precedence level to parse at.
   * @returns {Expression | null} The parsed expression or null if parsing fails.
   * @private
   */
  private parseExpression(precedence: Precedence): Expression | null {
    const prefixFn = this.prefixParseFunctions[this.currentToken.type];

    if (!prefixFn) {
      this.noPrefixParseFnError(this.currentToken.type);
      return null;
    }

    let leftExpression = prefixFn.call(this);
    if (leftExpression === null) return null;

    while (
      !this.isPeekTokenOfType(TokenType.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const infixFn = this.infixParseFunctions[this.peekToken.type];

      if (!infixFn) return leftExpression;

      this.forward();

      leftExpression = infixFn.call(this, leftExpression);
      if (leftExpression === null) return null;
    }

    return leftExpression;
  }

  /**
   * Parses an identifier.
   * @returns {Expression} The parsed identifier expression.
   * @private
   */
  private parseIdentifier(): Expression {
    return new Identifier(this.currentToken, this.currentToken.literal);
  }

  /**
   * Parses a boolean expression.
   * @returns {Expression} The parsed boolean expression.
   * @private
   */
  private parseBoolean(): Expression {
    return new BooleanExpression(
      this.currentToken,
      this.isCurrentToken(TokenType.TRUE)
    );
  }

  /**
   * Parses a string literal.
   * @returns {Expression} The parsed string literal expression.
   * @private
   */
  private parseStringLiteral(): Expression {
    return new StringLiteral(this.currentToken, this.currentToken.literal);
  }

  /**
   * Parses an integer literal.
   * @returns {Expression | null} The parsed integer literal expression or null if parsing fails.
   * @private
   */
  private parseIntegerLiteral(): Expression | null {
    const value = parseInt(this.currentToken.literal, 10);
    if (isNaN(value)) {
      const message = `Could not parse ${this.currentToken.literal} as integer`;
      this.errors.push(message);
      return null;
    }

    return new IntegerLiteral(this.currentToken, value);
  }

  /**
   * Parses a function literal.
   * @returns {Expression | null} The parsed function literal expression or null if parsing fails.
   * @private
   */
  private parseFunctionLiteral(): Expression | null {
    const token = this.currentToken;

    if (!this.expectPeekToken(TokenType.LPAREN)) return null;

    const parameters = this.parseFunctionParameters();

    if (parameters === null) return null;

    if (!this.expectPeekToken(TokenType.LBRACE)) return null;
    const body = this.parseBlockStatement();

    return new FunctionLiteral(token, parameters, body);
  }

  /**
   * Parses function parameters.
   * @returns {Identifier[]} An array of parsed parameter identifiers.
   * @private
   */
  private parseFunctionParameters(): Identifier[] | null {
    const identifiers: Identifier[] = [];

    // No parameters
    if (this.isPeekTokenOfType(TokenType.RPAREN)) {
      this.forward();
      return identifiers;
    }

    this.forward();

    const ident = new Identifier(this.currentToken, this.currentToken.literal);
    identifiers.push(ident);

    while (this.isPeekTokenOfType(TokenType.COMMA)) {
      this.forward(); // Skip comma
      this.forward();

      const ident = new Identifier(
        this.currentToken,
        this.currentToken.literal
      );
      identifiers.push(ident);
    }

    if (!this.expectPeekToken(TokenType.RPAREN)) return null;
    return identifiers;
  }

  /**
   * Parses an array literal.
   * @returns {Expression | null} The parsed array literal expression or null if parsing fails.
   * @private
   */
  private parseArrayLiteral(): Expression | null {
    const token = this.currentToken;
    const elements = this.parseExpressionList(TokenType.RBRACKET);
    return new ArrayLiteral(token, elements);
  }

  /**
   * Parses a list of expressions.
   * @param {TokenType} end The token type that marks the end of the list.
   * @returns {Expression[]} An array of parsed expressions.
   * @private
   */
  private parseExpressionList(end: TokenType): Expression[] {
    const list: Expression[] = [];

    if (this.isPeekTokenOfType(end)) {
      this.forward();
      return list;
    }

    this.forward();
    const exp = this.parseExpression(Precedence.LOWEST);
    if (exp !== null) list.push(exp);

    while (this.isPeekTokenOfType(TokenType.COMMA)) {
      this.forward();
      this.forward();

      const exp = this.parseExpression(Precedence.LOWEST);
      if (exp !== null) list.push(exp);
    }

    if (!this.expectPeekToken(end)) return [];
    return list;
  }

  /**
   * Parses a hash literal.
   * @returns {Expression | null} The parsed hash literal expression or null if parsing fails.
   * @private
   */
  private parseHashLiteral(): Expression | null {
    const token = this.currentToken;
    const pairs = new Map<Expression, Expression>();

    while (!this.isPeekTokenOfType(TokenType.RBRACE)) {
      this.forward(); // Skip { or ,

      const key = this.parseExpression(Precedence.LOWEST);
      if (key == null || !this.expectPeekToken(TokenType.COLON)) return null;

      this.forward(); // Skip : (colon)

      const value = this.parseExpression(Precedence.LOWEST);
      if (value == null) return null;

      pairs.set(key, value);

      const isUnexpectedEnd =
        !this.isPeekTokenOfType(TokenType.RBRACE) &&
        !this.expectPeekToken(TokenType.COMMA);

      if (isUnexpectedEnd) {
        this.addTokenTypeError(TokenType.RBRACE);
        return null;
      }
    }

    if (!this.expectPeekToken(TokenType.RBRACE)) return null;
    return new HashLiteral(token, pairs);
  }

  /**
   * Parses an index expression.
   * @param {Expression} left The left-hand side expression.
   * @returns {Expression | null} The parsed index expression or null if parsing fails.
   * @private
   */
  private parseIndexExpression(left: Expression): Expression | null {
    const token = this.currentToken;
    this.forward();
    const index = this.parseExpression(Precedence.LOWEST);

    if (index == null || !this.expectPeekToken(TokenType.RBRACKET)) return null;

    return new IndexExpression(token, left, index);
  }

  /**
   * Parses a prefix expression.
   * @returns {Expression | null} The parsed prefix expression or null if parsing fails.
   * @private
   */
  private parsePrefixExpression(): Expression | null {
    const token = this.currentToken;
    const operator = token.literal;

    this.forward();

    const right = this.parseExpression(Precedence.PREFIX);
    if (right === null) return null;

    return new PrefixExpression(token, operator, right);
  }

  /**
   * Parses an infix expression.
   * @param {Expression} left The left-hand side expression.
   * @returns {Expression | null} The parsed infix expression or null if parsing fails.
   * @private
   */
  private parseInfixExpression(left: Expression): Expression | null {
    const token = this.currentToken;
    const operator = token.literal;
    const precedence = this.currentPrecedence();

    this.forward();

    const right = this.parseExpression(precedence);
    if (right === null) return null;

    return new InfixExpression(token, left, operator, right);
  }

  /**
   * Parses a grouped expression.
   * @returns {Expression | null} The parsed grouped expression or null if parsing fails.
   * @private
   */
  private parseGroupedExpression(): Expression | null {
    this.forward();
    const expression = this.parseExpression(Precedence.LOWEST);

    if (!this.expectPeekToken(TokenType.RPAREN)) return null;
    return expression;
  }

  /**
   * Parses an if expression.
   * @returns {Expression | null} The parsed if expression or null if parsing fails.
   * @private
   */
  private parseIfExpression(): Expression | null {
    const ifToken = this.currentToken;
    if (!this.expectPeekToken(TokenType.LPAREN)) return null;

    this.forward();
    const condition = this.parseExpression(Precedence.LOWEST);

    if (condition == null || !this.expectPeekToken(TokenType.RPAREN))
      return null;

    if (!this.expectPeekToken(TokenType.LBRACE)) return null;

    const consequence = this.parseBlockStatement();

    let alternative: BlockStatement | null = null;
    if (this.isPeekTokenOfType(TokenType.ELSE)) {
      this.forward();

      if (!this.expectPeekToken(TokenType.LBRACE)) return null;
      alternative = this.parseBlockStatement();
    }

    return new IfExpression(ifToken, condition, consequence, alternative);
  }

  /**
   * Parses an assignment expression.
   * @param {Expression} left The left-hand side of the assignment.
   * @returns {Expression | null} The parsed assignment expression or null if parsing fails.
   * @private
   */
  private parseAssignmentExpression(left: Expression): Expression | null {
    if (!(left instanceof Identifier)) {
      this.errors.push("Invalid assignment target.");
      return null;
    }

    const token = this.currentToken;
    this.forward();

    const value = this.parseExpression(Precedence.LOWEST);
    if (value === null) return null;

    return new AssignmentExpression(token, left, value);
  }

  /**
   * Parses a call expression.
   * @param {Expression} functionName The function name expression.
   * @returns {Expression | null} The parsed call expression or null if parsing fails.
   * @private
   */
  private parseCallExpression(functionName: Expression): Expression | null {
    const token = this.currentToken;
    const args = this.parseExpressionList(TokenType.RPAREN);

    return new CallExpression(token, functionName, args);
  }

  /**
   * Parses a block statement.
   * @returns {BlockStatement} The parsed block statement.
   * @private
   */
  private parseBlockStatement(): BlockStatement {
    const token = this.currentToken;
    const statements: Statement[] = [];

    this.forward();

    while (
      !this.isCurrentToken(TokenType.RBRACE) &&
      !this.isCurrentToken(TokenType.EOF)
    ) {
      const statement = this.parseStatement();
      if (statement !== null) statements.push(statement);

      this.forward();
    }

    return new BlockStatement(token, statements);
  }

  /**
   * Adds an error for a missing prefix parse function.
   * @param {TokenType} type The token type that's missing a prefix parse function.
   * @private
   */
  private noPrefixParseFnError(type: TokenType): void {
    const message = `No prefix parse function for ${type} found`;
    this.errors.push(message);
  }

  /**
   * Gets the precedence of the peek token.
   * @returns {Precedence} The precedence of the peek token.
   * @private
   */
  private peekPrecedence(): Precedence {
    return getPrecedence(this.peekToken.type) || Precedence.LOWEST;
  }

  /**
   * Gets the precedence of the current token.
   * @returns {Precedence} The precedence of the current token.
   * @private
   */
  private currentPrecedence(): Precedence {
    return getPrecedence(this.currentToken.type) || Precedence.LOWEST;
  }

  /**
   * Checks if the current token is of the specified type.
   * @param {TokenType} type The token type to check for.
   * @returns {boolean} True if the current token matches the specified type, false otherwise.
   * @private
   */
  private isCurrentToken(type: TokenType): boolean {
    return this.currentToken.type === type;
  }

  /**
   * Creates the map of prefix parse functions.
   * @private
   */
  private createPrefixFnMap(): void {
    this.prefixParseFunctions = {
      [TokenType.IDENTIFIER]: this.parseIdentifier,
      [TokenType.INT]: this.parseIntegerLiteral,
      [TokenType.STRING]: this.parseStringLiteral,
      [TokenType.BANG]: this.parsePrefixExpression,
      [TokenType.MINUS]: this.parsePrefixExpression,
      [TokenType.TRUE]: this.parseBoolean,
      [TokenType.FALSE]: this.parseBoolean,
      [TokenType.LPAREN]: this.parseGroupedExpression,
      [TokenType.IF]: this.parseIfExpression,
      [TokenType.FUNCTION]: this.parseFunctionLiteral,
      [TokenType.LBRACKET]: this.parseArrayLiteral,
      [TokenType.LBRACE]: this.parseHashLiteral,
    } as Record<TokenType, PrefixParseFunction>;

    // Bind this to all functions
    Object.keys(this.prefixParseFunctions).forEach((key) => {
      const tokenType = key as TokenType;
      this.prefixParseFunctions[tokenType] =
        this.prefixParseFunctions[tokenType].bind(this);
    });
  }

  /**
   * Creates the map of infix parse functions.
   * @private
   */
  private createInfixFnMap(): void {
    this.infixParseFunctions = {
      [TokenType.PLUS]: this.parseInfixExpression,
      [TokenType.MINUS]: this.parseInfixExpression,
      [TokenType.SLASH]: this.parseInfixExpression,
      [TokenType.ASTERISK]: this.parseInfixExpression,
      [TokenType.EQ]: this.parseInfixExpression,
      [TokenType.NOT_EQ]: this.parseInfixExpression,
      [TokenType.LESS_THAN]: this.parseInfixExpression,
      [TokenType.GREATER_THAN]: this.parseInfixExpression,
      [TokenType.LPAREN]: this.parseCallExpression,
      [TokenType.LBRACKET]: this.parseIndexExpression,
      [TokenType.ASSIGN]: this.parseAssignmentExpression,
    } as Record<TokenType, InfixParseFunction>;

    // Bind all functions to 'this'
    Object.keys(this.infixParseFunctions).forEach((key) => {
      const tokenType = key as TokenType;
      this.infixParseFunctions[tokenType] =
        this.infixParseFunctions[tokenType].bind(this);
    });
  }

  /**
   * Handles the end of a statement by checking for a semicolon and advancing the parser.
   *
   * @returns {boolean} True if the statement ends correctly with a semicolon, false otherwise.
   * @private
   */
  private handleEnd(): boolean {
    if (!this.expectPeekToken(TokenType.SEMICOLON)) return false;
    this.forward();
    return true;
  }

  /**
   * Returns the base operator for a compound assignment operator.
   * @param {TokenType} tt - The token type of the compound assignment operator.
   * @returns {string} The base operator as a string.
   * @throws {Error} If an invalid token type is provided.
   * @private
   */
  private getBaseOperator(tt: TokenType): string {
    switch (tt) {
      case TokenType.PLUS_ASSIGN:
        return "+";

      case TokenType.MINUS_ASSIGN:
        return "-";

      case TokenType.ASTERISK_ASSIGN:
        return "*";

      case TokenType.SLASH_ASSIGN:
        return "/";

      default:
        throw new Error(`Invalid base operator for token type: ${tt}`);
    }
  }

  /**
   * Checks if a token type is a compound assignment operator.
   * @param {TokenType} tokenType - The token type to check.
   * @returns {boolean} - True if the token type is a compound assignment operator, false otherwise.
   * @private
   */
  private isCompoundAssignmentOperator(tokenType: TokenType): boolean {
    return (
      tokenType === TokenType.PLUS_ASSIGN ||
      tokenType === TokenType.MINUS_ASSIGN ||
      tokenType === TokenType.ASTERISK_ASSIGN ||
      tokenType === TokenType.SLASH_ASSIGN
    );
  }
}
