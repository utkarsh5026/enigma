import Lexer from "../lexer/lexer";
import { Operator, Token, TokenType } from "../token/token";
import * as literals from "../ast/literal.ts";
import * as ast from "../ast/ast.ts";
import * as statements from "../ast/statement.ts";
import { getPrecedence, Precedence } from "./precedence.ts";
import * as expressions from "../ast/expression.ts";

export interface ErrorMessage {
  message: string;
  line: number;
  column: number;
}

/**
 * Represents a function that parses a prefix expression.
 * @returns {Expression | null} The parsed expression or null if parsing fails.
 */
type PrefixParseFunction = () => ast.Expression | null;

/**
 * Represents a function that parses an infix expression.
 * @param {Expression} expression The left-hand side expression.
 * @returns {Expression | null} The parsed expression or null if parsing fails.
 */
type InfixParseFunction = (expression: ast.Expression) => ast.Expression | null;

/**
 * Parser class responsible for parsing tokens into an Abstract Syntax Tree (AST).
 */
export class Parser {
  private readonly lexer: Lexer;
  private currentToken!: Token;
  private peekToken!: Token;
  private readonly errors: ErrorMessage[] = [];
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
   * @returns {ast.Program} The parsed program as an AST.
   *
   * @example
   * const program = parser.parseProgram();
   * console.log(program.toString());
   * // Output: let x = (5 + 3);
   */
  public parseProgram(): ast.Program {
    const program = new ast.Program();
    while (this.currentToken.type !== TokenType.EOF) {
      try {
        const stmt = this.parseStatement();
        if (stmt !== null) program.statements.push(stmt);
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error(error.message);
        } else {
          this.error("An unknown error occurred");
        }
        this.synchronize();
      }
      this.forward();
    }

    return program;
  }

  /**
   * Returns any parsing errors that occurred during parsing.
   * @returns {string[]} An array of error messages.
   */
  public parserErrors(): ErrorMessage[] {
    return this.errors;
  }

  /**
   * Parses a single statement.
   * @returns {Statement | null} The parsed statement or null if parsing fails.
   * @private
   */
  private parseStatement(): ast.Statement | null {
    switch (this.currentToken.type) {
      case TokenType.LET:
        return this.parseLetStatement();

      case TokenType.CONST:
        return this.parseConstStatement();

      case TokenType.RETURN:
        return this.parseReturnStatement();

      case TokenType.WHILE:
        return this.parseWhileStatement();

      case TokenType.BREAK:
        return this.parseBreakStatement();

      case TokenType.FOR:
        return this.parseForLoopStatement();

      case TokenType.CONTINUE:
        return this.parseContinueStatement();

      case TokenType.LBRACE:
        return this.parseBlockStatement();

      // case TokenType.CLASS:
      //   return this.parseClassDeclaration();

      default:
        return this.parseExpressionStatement();
    }
  }

  /**
   * Parses a let statement.
   * @returns {statements.LetStatement | null} The parsed let statement or null if parsing fails.
   * @private
   *
   * @example
   * // Assuming the current token is 'let'
   * const letStatement = parser.parseLetStatement();
   * if (letStatement) {
   *     console.log(letStatement.toString());
   *     // Output: let x = 5;
   * }
   */
  private parseLetStatement(): statements.LetStatement | null {
    const letToken = this.currentToken;
    if (!this.consume(TokenType.IDENTIFIER)) return null;

    const name = new ast.Identifier(
      this.currentToken,
      this.currentToken.literal
    );
    if (!this.consume(TokenType.ASSIGN)) return null;

    this.forward();
    const value = this.parseExpression(Precedence.LOWEST);
    if (value === null) return null;

    if (!this.consume(TokenType.SEMICOLON)) return null;

    return new statements.LetStatement(letToken, name, value);
  }

  /**
   * Parses a return statement.
   * @returns {statements.ReturnStatement | null} The parsed return statement or null if parsing fails.
   * @private
   *
   * @example
   * // Assuming the current token is 'return'
   * const returnStatement = parser.parseReturnStatement();
   * if (returnStatement) {
   *     console.log(returnStatement.toString());
   *     // Output: return 42;
   * }
   */
  private parseReturnStatement(): statements.ReturnStatement | null {
    const returnToken = this.currentToken;
    this.forward();

    const returnValue = this.parseExpression(Precedence.LOWEST);
    if (returnValue === null) return null;

    if (!this.consume(TokenType.SEMICOLON)) return null;

    return new statements.ReturnStatement(returnToken, returnValue);
  }

  /**
   * Parses a while statement.
   * @returns {WhileStatement | null} The parsed while statement or null if parsing fails.
   * @private
   */
  private parseWhileStatement(): statements.WhileStatement | null {
    const whileToken = this.currentToken;

    if (!this.consume(TokenType.LPAREN)) return null;
    this.forward();

    const condition = this.parseExpression(Precedence.LOWEST);
    if (condition == null || !this.consume(TokenType.RPAREN)) return null;

    if (!this.consume(TokenType.LBRACE)) return null;

    this.loopDepth++;
    const body = this.parseBlockStatement();
    this.loopDepth--;

    return new statements.WhileStatement(whileToken, condition, body);
  }

  private parseConstStatement(): statements.ConstStatement | null {
    const constToken = this.currentToken;

    if (!this.consume(TokenType.IDENTIFIER)) return null;
    const name = new ast.Identifier(
      this.currentToken,
      this.currentToken.literal
    );

    if (!this.consume(TokenType.ASSIGN)) return null;
    this.forward();

    const value = this.parseExpression(Precedence.LOWEST);
    if (value === null) return null;

    if (!this.consume(TokenType.SEMICOLON)) return null;

    return new statements.ConstStatement(constToken, name, value);
  }

  /**
   * Parses a break statement.
   * @returns {BreakStatement | null} The parsed break statement or null if parsing fails.
   * @private
   */
  private parseBreakStatement(): statements.BreakStatement | null {
    if (this.loopDepth === 0) {
      this.error(`Break statement must be inside a loop.`);
      return null;
    }

    const breakToken = this.currentToken;
    if (!this.handleEnd()) return null;

    return new statements.BreakStatement(breakToken);
  }

  /**
   * Parses a continue statement.
   * @returns {ContinueStatement | null} The parsed continue statement or null if parsing fails.
   * @private
   */
  private parseContinueStatement(): statements.ContinueStatement | null {
    if (this.loopDepth === 0) {
      this.error("Continue statement must be inside a loop.");
      return null;
    }

    const continueToken = this.currentToken;
    if (!this.handleEnd()) return null;

    return new statements.ContinueStatement(continueToken);
  }

  /**
   * Parses an expression statement.
   * @returns {ExpressionStatement | null} The parsed expression statement or null if parsing fails.
   * @private
   */
  private parseExpressionStatement(): statements.ExpressionStatement | null {
    const token = this.currentToken;

    if (
      this.isCurrentToken(TokenType.IDENTIFIER) &&
      this.isCompoundAssignmentOperator(this.peekToken.type)
    ) {
      return this.parseCompoundStatement();
    }

    const expression = this.parseExpression(Precedence.LOWEST);

    if (expression === null) {
      this.error("Expected expression");
      return null;
    }

    if (this.isPeekTokenOfType(TokenType.SEMICOLON)) this.forward();

    return new statements.ExpressionStatement(token, expression);
  }

  /**
   * Parses a compound assignment statement (e.g., +=, -=, *=, /=).
   * This method handles the parsing of statements like "x += 5" or "y *= 2".
   *
   * @returns {ExpressionStatement | null} The parsed compound assignment statement as an ExpressionStatement,
   *                                       or null if parsing fails.
   * @private
   */
  private parseCompoundStatement(): statements.ExpressionStatement | null {
    const startToken = this.currentToken;
    const left = new ast.Identifier(startToken, startToken.literal);
    this.forward();

    const operatorToken = this.currentToken;
    const operator = this.getBaseOperator(operatorToken.type);
    this.forward();

    const right = this.parseExpression(Precedence.LOWEST);
    if (right === null) {
      this.error("Expected expression");
      return null;
    }

    if (!this.handleEnd()) return null;

    const infixExpr = new expressions.InfixExpression(
      operatorToken,
      left,
      operator,
      right
    );
    const assignExpr = new expressions.AssignmentExpression(
      operatorToken,
      left,
      infixExpr
    );

    return new statements.ExpressionStatement(startToken, assignExpr);
  }

  private parseForLoopStatement(): statements.ForStatement | null {
    const forToken = this.currentToken;

    if (!this.consume(TokenType.LPAREN)) return null;

    this.forward(); // Move past '('
    const init = this.parseStatement();
    if (init === null) {
      this.error("Expected initialization statement");
      return null;
    }

    const condition = this.parseExpression(Precedence.LOWEST);
    if (condition === null) {
      this.error("Expected condition expression");
      return null;
    }

    const update = this.parseExpression(Precedence.LOWEST);
    if (update === null) {
      this.error("Expected update expression");
      return null;
    }

    const body = this.parseBlockStatement();
    if (body === null) {
      this.error("Expected body statement");
      return null;
    }

    return new statements.ForStatement(forToken, init, condition, update, body);
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
  private consume(type: TokenType): boolean {
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
    const peek = this.peekToken;
    const message = `Expected next token to be ${type}, got ${peek.type} instead`;
    this.error(message, peek);
  }

  /**
   * Parses an expression with the given precedence.
   * @param {Precedence} precedence The precedence level to parse at.
   * @returns {Expression | null} The parsed expression or null if parsing fails.
   * @private
   */
  private parseExpression(precedence: Precedence): ast.Expression | null {
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
  private parseIdentifier(): ast.Expression {
    return new ast.Identifier(this.currentToken, this.currentToken.literal);
  }

  /**
   * Parses a boolean expression.
   * @returns {Expression} The parsed boolean expression.
   * @private
   */
  private parseBoolean(): ast.Expression {
    return new expressions.BooleanExpression(
      this.currentToken,
      this.isCurrentToken(TokenType.TRUE)
    );
  }

  /**
   * Parses a string literal.
   * @returns {Expression} The parsed string literal expression.
   * @private
   */
  private parseStringLiteral(): ast.Expression {
    return new literals.StringLiteral(
      this.currentToken,
      this.currentToken.literal
    );
  }

  /**
   * Parses an integer literal.
   * @returns {Expression | null} The parsed integer literal expression or null if parsing fails.
   * @private
   */
  private parseIntegerLiteral(): ast.Expression | null {
    const tok = this.currentToken;
    const value = parseInt(tok.literal, 10);
    if (isNaN(value)) {
      const message = `Could not parse ${tok.literal} as integer`;
      this.error(message);
      return null;
    }

    return new literals.IntegerLiteral(this.currentToken, value);
  }

  /**
   * Parses a function literal.
   * @returns {Expression | null} The parsed function literal expression or null if parsing fails.
   * @private
   */
  private parseFunctionLiteral(): ast.Expression | null {
    const token = this.currentToken;

    if (!this.consume(TokenType.LPAREN)) return null;

    const parameters = this.parseFunctionParameters();

    if (parameters === null) {
      this.error("Failed to parse function parameters");
      return null;
    }

    if (!this.consume(TokenType.LBRACE)) return null;

    const body = this.parseBlockStatement();
    return new literals.FunctionLiteral(token, parameters, body);
  }

  /**
   * Parses function parameters.
   * @returns {Identifier[]} An array of parsed parameter identifiers.
   * @private
   */
  private parseFunctionParameters(): ast.Identifier[] | null {
    const identifiers: ast.Identifier[] = [];

    // No parameters
    if (this.isPeekTokenOfType(TokenType.RPAREN)) {
      this.forward();
      return identifiers;
    }

    this.forward();

    const ident = new ast.Identifier(
      this.currentToken,
      this.currentToken.literal
    );
    identifiers.push(ident);

    while (this.isPeekTokenOfType(TokenType.COMMA)) {
      this.forward(); // Skip comma
      this.forward();

      const ident = new ast.Identifier(
        this.currentToken,
        this.currentToken.literal
      );
      identifiers.push(ident);
    }

    if (!this.consume(TokenType.RPAREN)) return null;
    return identifiers;
  }

  /**
   * Parses an array literal.
   * @returns {Expression | null} The parsed array literal expression or null if parsing fails.
   * @private
   */
  private parseArrayLiteral(): ast.Expression | null {
    const token = this.currentToken;
    const elements = this.parseExpressionList(TokenType.RBRACKET);
    return new literals.ArrayLiteral(token, elements);
  }

  /**
   * Parses a list of expressions.
   * @param {TokenType} end The token type that marks the end of the list.
   * @returns {Expression[]} An array of parsed expressions.
   * @private
   */
  private parseExpressionList(end: TokenType): ast.Expression[] {
    const list: ast.Expression[] = [];

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

    if (!this.consume(end)) return [];
    return list;
  }

  /**
   * Parses a hash literal.
   * @returns {Expression | null} The parsed hash literal expression or null if parsing fails.
   * @private
   */
  private parseHashLiteral(): ast.Expression | null {
    const token = this.currentToken;
    const pairs = new Map<ast.Expression, ast.Expression>();

    while (!this.isPeekTokenOfType(TokenType.RBRACE)) {
      this.forward(); // Skip { or ,

      const key = this.parseExpression(Precedence.LOWEST);
      if (key == null || !this.consume(TokenType.COLON)) return null;

      this.forward(); // Skip : (colon)

      const value = this.parseExpression(Precedence.LOWEST);
      if (value == null) return null;

      pairs.set(key, value);

      const isUnexpectedEnd =
        !this.isPeekTokenOfType(TokenType.RBRACE) &&
        !this.consume(TokenType.COMMA);

      if (isUnexpectedEnd) {
        this.addTokenTypeError(TokenType.RBRACE);
        return null;
      }
    }

    if (!this.consume(TokenType.RBRACE)) return null;
    return new literals.HashLiteral(token, pairs);
  }

  /**
   * Parses an index expression.
   * @param {Expression} left The left-hand side expression.
   * @returns {Expression | null} The parsed index expression or null if parsing fails.
   * @private
   */
  private parseIndexExpression(left: ast.Expression): ast.Expression | null {
    const token = this.currentToken;
    this.forward();
    const index = this.parseExpression(Precedence.LOWEST);

    if (index == null || !this.consume(TokenType.RBRACKET)) return null;

    return new expressions.IndexExpression(token, left, index);
  }

  /**
   * Parses a prefix expression.
   * @returns {Expression | null} The parsed prefix expression or null if parsing fails.
   * @private
   */
  private parsePrefixExpression(): ast.Expression | null {
    const token = this.currentToken;
    const operator = token.literal;

    this.forward();

    const right = this.parseExpression(Precedence.PREFIX);
    if (right === null) return null;

    return new expressions.PrefixExpression(token, operator, right);
  }

  /**
   * Parses an infix expression.
   * @param {Expression} left The left-hand side expression.
   * @returns {Expression | null} The parsed infix expression or null if parsing fails.
   * @private
   */
  private parseInfixExpression(left: ast.Expression): ast.Expression | null {
    const token = this.currentToken;
    const operator = token.literal as Operator;
    const precedence = this.currentPrecedence();

    this.forward();

    let right: ast.Expression | null;
    if (token.type === TokenType.AND || token.type === TokenType.OR)
      right = this.parseExpression(precedence - 1);
    else right = this.parseExpression(precedence);

    if (right === null) return null;

    return new expressions.InfixExpression(token, left, operator, right);
  }

  /**
   * Parses a grouped expression.
   * @returns {Expression | null} The parsed grouped expression or null if parsing fails.
   * @private
   */
  private parseGroupedExpression(): ast.Expression | null {
    this.forward();
    const expression = this.parseExpression(Precedence.LOWEST);

    if (!this.consume(TokenType.RPAREN)) return null;
    return expression;
  }

  /**
   * Parses an if expression.
   * @returns {Expression | null} The parsed if expression or null if parsing fails.
   * @private
   */
  private parseIfExpression(): ast.Expression | null {
    const token = this.currentToken;
    const conditions: ast.Expression[] = [];
    const consequences: statements.BlockStatement[] = [];

    const ifPart = this.parseIfPart();
    if (ifPart === null) return null;

    conditions.push(ifPart[0]);
    consequences.push(ifPart[1]);

    while (this.isPeekTokenOfType(TokenType.ELIF)) {
      this.forward();

      const elifPart = this.parseIfPart();
      if (elifPart === null) return null;

      conditions.push(elifPart[0]);
      consequences.push(elifPart[1]);
    }

    let alternative: statements.BlockStatement | null = null;
    if (this.isPeekTokenOfType(TokenType.ELSE)) {
      this.forward();

      if (!this.consume(TokenType.LBRACE)) return null;
      alternative = this.parseBlockStatement();
    }

    return new expressions.IfExpression(
      token,
      conditions,
      consequences,
      alternative
    );
  }

  /**
   * Parses a single if-part (condition and consequence) of an if-expression.
   * This method handles the parsing of the condition in parentheses and the
   * consequence block in braces.
   *
   * @returns {[ast.Expression, statements.BlockStatement] | null} A tuple containing
   * the parsed condition expression and consequence block statement, or null if parsing fails.
   * @private
   */
  private parseIfPart(): [ast.Expression, statements.BlockStatement] | null {
    if (!this.consume(TokenType.LPAREN)) return null;
    this.forward();

    const condition = this.parseExpression(Precedence.LOWEST);
    if (!condition) {
      this.error("Expected condition expression");
      return null;
    }

    if (!this.consume(TokenType.RPAREN)) return null;
    if (!this.consume(TokenType.LBRACE)) return null;

    const consequence = this.parseBlockStatement();
    return [condition, consequence];
  }

  /**
   * Parses an assignment expression.
   * @param {Expression} left The left-hand side of the assignment.
   * @returns {Expression | null} The parsed assignment expression or null if parsing fails.
   * @private
   */
  private parseAssignmentExpression(
    left: ast.Expression
  ): ast.Expression | null {
    if (!(left instanceof ast.Identifier)) {
      this.error("Invalid assignment target.");
      return null;
    }

    const token = this.currentToken;
    this.forward();

    const value = this.parseExpression(Precedence.LOWEST);
    if (value === null) return null;

    return new expressions.AssignmentExpression(token, left, value);
  }

  /**
   * Parses a call expression.
   * @param {Expression} functionName The function name expression.
   * @returns {Expression | null} The parsed call expression or null if parsing fails.
   * @private
   */
  private parseCallExpression(
    functionName: ast.Expression
  ): ast.Expression | null {
    const token = this.currentToken;
    const args = this.parseExpressionList(TokenType.RPAREN);

    return new expressions.CallExpression(token, functionName, args);
  }

  /**
   * Parses a block statement.
   * @returns {BlockStatement} The parsed block statement.
   * @private
   */
  private parseBlockStatement(): statements.BlockStatement {
    const token = this.currentToken;
    const stmts: ast.Statement[] = [];

    this.forward();

    while (
      !this.isCurrentToken(TokenType.RBRACE) &&
      !this.isCurrentToken(TokenType.EOF)
    ) {
      const statement = this.parseStatement();
      if (statement !== null) stmts.push(statement);

      this.forward();
    }

    return new statements.BlockStatement(token, stmts);
  }

  /**
   * Adds an error for a missing prefix parse function.
   * @param {TokenType} type The token type that's missing a prefix parse function.
   * @private
   */
  private noPrefixParseFnError(type: TokenType): void {
    const message = `No prefix parse function for ${type} found`;
    this.error(message);
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
      [TokenType.MODULUS]: this.parseInfixExpression,
      [TokenType.EQ]: this.parseInfixExpression,
      [TokenType.NOT_EQ]: this.parseInfixExpression,
      [TokenType.LESS_THAN]: this.parseInfixExpression,
      [TokenType.GREATER_THAN]: this.parseInfixExpression,
      [TokenType.LPAREN]: this.parseCallExpression,
      [TokenType.LBRACKET]: this.parseIndexExpression,
      [TokenType.ASSIGN]: this.parseAssignmentExpression,
      [TokenType.AND]: this.parseInfixExpression,
      [TokenType.OR]: this.parseInfixExpression,
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
    return this.consume(TokenType.SEMICOLON);
  }

  /**
   * Returns the base operator for a compound assignment operator.
   * @param {TokenType} tt - The token type of the compound assignment operator.
   * @returns {string} The base operator as a string.
   * @throws {Error} If an invalid token type is provided.
   * @private
   */
  private getBaseOperator(tt: TokenType): Operator {
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

  /**
   * Adds an error message to the errors array.
   *
   * @param {string} message - The error message to be added.
   * @param {Token} [token] - The token associated with the error. If not provided, the current token is used.
   * @private
   */
  private error(message: string, token?: Token): void {
    if (!token) token = this.currentToken;
    const errorMsg = {
      message,
      line: token.position.line,
      column: token.position.column,
    };
    this.errors.push(errorMsg);
  }

  /**
   * Synchronizes the parser state after encountering an error.
   * This method advances the parser to a point where it can safely continue parsing.
   * It stops at a semicolon or at the beginning of a new statement or declaration.
   *
   * @private
   */
  private synchronize(): void {
    this.forward();
    while (!this.isCurrentToken(TokenType.EOF)) {
      if (this.isCurrentToken(TokenType.SEMICOLON)) {
        this.forward();
        return;
      }

      switch (this.peekToken.type) {
        case TokenType.CLASS:
        case TokenType.FUNCTION:
        case TokenType.LET:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.RETURN:
          return;
      }

      this.forward();
    }
  }

  // private parseClassDeclaration(): statements.ClassDeclaration | null {
  //   const token = this.currentToken;
  //   if (!this.consume(TokenType.IDENTIFIER)) return null;

  //   const name = new ast.Identifier(
  //     this.currentToken,
  //     this.currentToken.literal
  //   );

  //   let superClass: ast.Identifier | null = null;
  //   if (this.isPeekTokenOfType(TokenType.EXTENDS)) {
  //     this.forward();
  //     if (!this.consume(TokenType.IDENTIFIER)) return null;
  //     superClass = new ast.Identifier(
  //       this.currentToken,
  //       this.currentToken.literal
  //     );
  //   }

  //   if (!this.consume(TokenType.LBRACE)) return null;
  //   const constructorMethod: statements.ConstructorDefinition | null = null;
  //   const methods: statements.MethodDefinition[] = [];

  //   while (
  //     !this.isCurrentToken(TokenType.RBRACE) &&
  //     !this.isCurrentToken(TokenType.EOF)
  //   ) {
  //     if (
  //       this.isCurrentToken(TokenType.IDENTIFIER) &&
  //       this.isPeekTokenOfType(TokenType.LPAREN)
  //     ) {
  //       if (this.currentToken.literal === "init") {
  //         if (constructorMethod !== null)
  //           throw new Error("Cannot have multiple constructors");

  //         constructorMethod = this.parseConstructorDefinition();
  //       } else {
  //         const method = this.parseMethodDefinition();
  //         if (method !== null) methods.push(method);
  //       }
  //     } else {
  //       throw new Error(
  //         `Unexpected token inside class: ${this.currentToken.literal}`
  //       );
  //     }
  //   }

  //   return new statements.ClassDeclaration(
  //     token,
  //     name,
  //     constructorMethod,
  //     methods,
  //     superClass
  //   );
  // }
}
