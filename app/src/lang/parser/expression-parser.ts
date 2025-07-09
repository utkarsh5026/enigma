import { TokenType, Operator } from "../token/token";
import { ParsingContext, Precedence } from "./core";
import * as ast from "../ast/ast";
import * as expressions from "../ast/expression";
import * as literals from "../ast/literal";
import * as statements from "../ast/statement";
import { BlockStatementParser } from "./statements/block-statement";
import { AstValidator } from "../ast";

export class ExpressionParser {
  private prefixParsers = new Map<
    TokenType,
    (context: ParsingContext) => ast.Expression | null
  >();
  private infixParsers = new Map<
    TokenType,
    (context: ParsingContext, left: ast.Expression) => ast.Expression | null
  >();

  constructor(
    private parseStatement: (context: ParsingContext) => ast.Statement | null
  ) {
    this.setupPrefixParsers();
    this.setupInfixParsers();
  }

  parseExpression(
    context: ParsingContext,
    precedence: Precedence
  ): ast.Expression | null {
    const prefixParser = this.prefixParsers.get(
      context.tokens.getCurrentToken().type
    );

    if (!prefixParser) {
      context.errors.addPrefixError(
        context.tokens.getCurrentToken().type,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    let leftExpression = prefixParser(context);
    if (!leftExpression) return null;

    while (
      !context.tokens.isPeekToken(TokenType.SEMICOLON) &&
      precedence <
        context.precedence.getPrecedence(context.tokens.getPeekToken().type)
    ) {
      const infixParser = this.infixParsers.get(
        context.tokens.getPeekToken().type
      );

      if (!infixParser) return leftExpression;

      context.tokens.advance();
      leftExpression = infixParser(context, leftExpression);
      if (!leftExpression) return null;
    }

    return leftExpression;
  }

  private setupPrefixParsers(): void {
    // Literals
    this.prefixParsers.set(
      TokenType.IDENTIFIER,
      this.parseIdentifier.bind(this)
    );
    this.prefixParsers.set(TokenType.INT, this.parseIntegerLiteral.bind(this));
    this.prefixParsers.set(
      TokenType.STRING,
      this.parseStringLiteral.bind(this)
    );
    this.prefixParsers.set(TokenType.TRUE, this.parseBoolean.bind(this));
    this.prefixParsers.set(TokenType.FALSE, this.parseBoolean.bind(this));

    // Prefix operators
    this.prefixParsers.set(
      TokenType.BANG,
      this.parsePrefixExpression.bind(this)
    );
    this.prefixParsers.set(
      TokenType.MINUS,
      this.parsePrefixExpression.bind(this)
    );

    // Grouped expressions
    this.prefixParsers.set(
      TokenType.LPAREN,
      this.parseGroupedExpression.bind(this)
    );

    // Control flow
    this.prefixParsers.set(TokenType.IF, this.parseIfExpression.bind(this));

    // Complex literals
    this.prefixParsers.set(
      TokenType.FUNCTION,
      this.parseFunctionLiteral.bind(this)
    );
    this.prefixParsers.set(
      TokenType.LBRACKET,
      this.parseArrayLiteral.bind(this)
    );
    this.prefixParsers.set(TokenType.LBRACE, this.parseHashLiteral.bind(this));
  }

  private setupInfixParsers(): void {
    // Arithmetic operators
    this.infixParsers.set(TokenType.PLUS, this.parseInfixExpression.bind(this));
    this.infixParsers.set(
      TokenType.MINUS,
      this.parseInfixExpression.bind(this)
    );
    this.infixParsers.set(
      TokenType.SLASH,
      this.parseInfixExpression.bind(this)
    );
    this.infixParsers.set(
      TokenType.ASTERISK,
      this.parseInfixExpression.bind(this)
    );
    this.infixParsers.set(
      TokenType.MODULUS,
      this.parseInfixExpression.bind(this)
    );

    // Comparison operators
    this.infixParsers.set(TokenType.EQ, this.parseInfixExpression.bind(this));
    this.infixParsers.set(
      TokenType.NOT_EQ,
      this.parseInfixExpression.bind(this)
    );
    this.infixParsers.set(
      TokenType.LESS_THAN,
      this.parseInfixExpression.bind(this)
    );
    this.infixParsers.set(
      TokenType.GREATER_THAN,
      this.parseInfixExpression.bind(this)
    );

    this.infixParsers.set(
      TokenType.LESS_THAN_OR_EQUAL,
      this.parseInfixExpression.bind(this)
    );
    this.infixParsers.set(
      TokenType.GREATER_THAN_OR_EQUAL,
      this.parseInfixExpression.bind(this)
    );

    // Logical operators
    this.infixParsers.set(TokenType.AND, this.parseInfixExpression.bind(this));
    this.infixParsers.set(TokenType.OR, this.parseInfixExpression.bind(this));

    // Assignment
    this.infixParsers.set(
      TokenType.ASSIGN,
      this.parseAssignmentExpression.bind(this)
    );

    // Function calls and indexing
    this.infixParsers.set(
      TokenType.LPAREN,
      this.parseCallExpression.bind(this)
    );
    this.infixParsers.set(
      TokenType.LBRACKET,
      this.parseIndexExpression.bind(this)
    );
  }

  // Prefix Parsers
  private parseIdentifier(context: ParsingContext): ast.Expression {
    return new ast.Identifier(
      context.tokens.getCurrentToken(),
      context.tokens.getCurrentToken().literal
    );
  }

  private parseIntegerLiteral(context: ParsingContext): ast.Expression | null {
    const token = context.tokens.getCurrentToken();
    const value = parseInt(token.literal, 10);

    if (isNaN(value)) {
      context.errors.addError(
        `Could not parse ${token.literal} as integer`,
        token
      );
      return null;
    }

    return new literals.IntegerLiteral(token, value);
  }

  private parseStringLiteral(context: ParsingContext): ast.Expression {
    return new literals.StringLiteral(
      context.tokens.getCurrentToken(),
      context.tokens.getCurrentToken().literal
    );
  }

  private parseBoolean(context: ParsingContext): ast.Expression {
    return new expressions.BooleanExpression(
      context.tokens.getCurrentToken(),
      context.tokens.isCurrentToken(TokenType.TRUE)
    );
  }

  private parsePrefixExpression(
    context: ParsingContext
  ): ast.Expression | null {
    const token = context.tokens.getCurrentToken();
    const operator = token.literal;

    context.tokens.advance();

    const right = this.parseExpression(context, Precedence.PREFIX);
    if (!right) return null;

    return new expressions.PrefixExpression(token, operator, right);
  }

  private parseGroupedExpression(
    context: ParsingContext
  ): ast.Expression | null {
    context.tokens.advance(); // consume '('

    const expression = this.parseExpression(context, Precedence.LOWEST);

    if (!context.tokens.expect(TokenType.RPAREN)) {
      context.errors.addTokenError(
        TokenType.RPAREN,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    return expression;
  }

  private parseIfExpression(context: ParsingContext): ast.Expression | null {
    const token = context.tokens.getCurrentToken();
    const conditions: ast.Expression[] = [];
    const consequences: statements.BlockStatement[] = [];

    // Parse initial if condition
    const ifPart = this.parseIfPart(context);
    if (!ifPart) return null;

    conditions.push(ifPart[0]);
    consequences.push(ifPart[1]);

    // Parse elif conditions
    while (context.tokens.isPeekToken(TokenType.ELIF)) {
      context.tokens.advance();

      const elifPart = this.parseIfPart(context);
      if (!elifPart) return null;

      conditions.push(elifPart[0]);
      consequences.push(elifPart[1]);
    }

    // Parse else block
    let alternative: statements.BlockStatement | null = null;
    if (context.tokens.isPeekToken(TokenType.ELSE)) {
      context.tokens.advance();

      if (!context.tokens.expect(TokenType.LBRACE)) {
        context.errors.addTokenError(
          TokenType.LBRACE,
          context.tokens.getCurrentToken()
        );
        return null;
      }

      const blockParser = new BlockStatementParser(
        this.parseStatement.bind(this)
      );
      alternative = blockParser.parse(context);
      if (!alternative) return null;
    }

    return new expressions.IfExpression(
      token,
      conditions,
      consequences,
      alternative
    );
  }

  private parseIfPart(
    context: ParsingContext
  ): [ast.Expression, statements.BlockStatement] | null {
    if (!context.tokens.expect(TokenType.LPAREN)) {
      context.errors.addTokenError(
        TokenType.LPAREN,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    context.tokens.advance();
    const condition = this.parseExpression(context, Precedence.LOWEST);

    if (!condition) return null;

    if (!context.tokens.expect(TokenType.RPAREN)) {
      context.errors.addTokenError(
        TokenType.RPAREN,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    if (!context.tokens.expect(TokenType.LBRACE)) {
      context.errors.addTokenError(
        TokenType.LBRACE,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    const consequence = this.parseStatement(context);

    if (!consequence) return null;

    if (AstValidator.isBlockStatement(consequence)) {
      return [condition, consequence];
    }

    return [
      condition,
      new statements.BlockStatement(context.tokens.getCurrentToken(), [
        consequence,
      ]),
    ];
  }

  private parseFunctionLiteral(context: ParsingContext): ast.Expression | null {
    const token = context.tokens.getCurrentToken();

    if (!context.tokens.expect(TokenType.LPAREN)) {
      context.errors.addTokenError(
        TokenType.LPAREN,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    const parameters = this.parseFunctionParameters(context);
    if (!parameters) return null;

    if (!context.tokens.expect(TokenType.LBRACE)) {
      context.errors.addTokenError(
        TokenType.LBRACE,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    const body = this.parseStatement(context);
    if (!body) return null;

    if (AstValidator.isBlockStatement(body)) {
      return new literals.FunctionLiteral(token, parameters, body);
    }

    return new literals.FunctionLiteral(
      token,
      parameters,
      new statements.BlockStatement(token, [body])
    );
  }

  private parseFunctionParameters(
    context: ParsingContext
  ): ast.Identifier[] | null {
    const identifiers: ast.Identifier[] = [];

    if (context.tokens.isPeekToken(TokenType.RPAREN)) {
      context.tokens.advance();
      return identifiers;
    }

    context.tokens.advance();

    identifiers.push(
      new ast.Identifier(
        context.tokens.getCurrentToken(),
        context.tokens.getCurrentToken().literal
      )
    );

    while (context.tokens.isPeekToken(TokenType.COMMA)) {
      context.tokens.advance(); // skip comma
      context.tokens.advance(); // move to next identifier

      identifiers.push(
        new ast.Identifier(
          context.tokens.getCurrentToken(),
          context.tokens.getCurrentToken().literal
        )
      );
    }

    if (!context.tokens.expect(TokenType.RPAREN)) {
      context.errors.addTokenError(
        TokenType.RPAREN,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    return identifiers;
  }

  private parseArrayLiteral(context: ParsingContext): ast.Expression | null {
    const token = context.tokens.getCurrentToken();
    const elements = this.parseExpressionList(context, TokenType.RBRACKET);
    return new literals.ArrayLiteral(token, elements);
  }

  private parseHashLiteral(context: ParsingContext): ast.Expression | null {
    const token = context.tokens.getCurrentToken();
    const pairs = new Map<ast.Expression, ast.Expression>();

    while (!context.tokens.isPeekToken(TokenType.RBRACE)) {
      context.tokens.advance();

      const key = this.parseExpression(context, Precedence.LOWEST);
      if (!key) return null;

      if (!context.tokens.expect(TokenType.COLON)) {
        context.errors.addTokenError(
          TokenType.COLON,
          context.tokens.getCurrentToken()
        );
        return null;
      }

      context.tokens.advance();

      const value = this.parseExpression(context, Precedence.LOWEST);
      if (!value) return null;

      pairs.set(key, value);

      if (
        !context.tokens.isPeekToken(TokenType.RBRACE) &&
        !context.tokens.expect(TokenType.COMMA)
      ) {
        context.errors.addTokenError(
          TokenType.RBRACE,
          context.tokens.getCurrentToken()
        );
        return null;
      }
    }

    if (!context.tokens.expect(TokenType.RBRACE)) {
      context.errors.addTokenError(
        TokenType.RBRACE,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    return new literals.HashLiteral(token, pairs);
  }

  // Infix Parsers
  private parseInfixExpression(
    context: ParsingContext,
    left: ast.Expression
  ): ast.Expression | null {
    const token = context.tokens.getCurrentToken();
    const operator = token.literal as Operator;
    const precedence = context.precedence.getPrecedence(token.type);

    context.tokens.advance();

    let right: ast.Expression | null;
    if (token.type === TokenType.AND || token.type === TokenType.OR) {
      // Right-associative for logical operators
      right = this.parseExpression(context, precedence - 1);
    } else {
      right = this.parseExpression(context, precedence);
    }

    if (!right) return null;

    return new expressions.InfixExpression(token, left, operator, right);
  }

  private parseAssignmentExpression(
    context: ParsingContext,
    left: ast.Expression
  ): ast.Expression | null {
    if (!(left instanceof ast.Identifier)) {
      context.errors.addError(
        "Invalid assignment target",
        context.tokens.getCurrentToken()
      );
      return null;
    }

    const token = context.tokens.getCurrentToken();
    context.tokens.advance();

    const value = this.parseExpression(context, Precedence.LOWEST);
    if (!value) return null;

    return new expressions.AssignmentExpression(token, left, value);
  }

  private parseCallExpression(
    context: ParsingContext,
    functionName: ast.Expression
  ): ast.Expression | null {
    const token = context.tokens.getCurrentToken();
    const args = this.parseExpressionList(context, TokenType.RPAREN);
    return new expressions.CallExpression(token, functionName, args);
  }

  private parseIndexExpression(
    context: ParsingContext,
    left: ast.Expression
  ): ast.Expression | null {
    const token = context.tokens.getCurrentToken();
    context.tokens.advance();

    const index = this.parseExpression(context, Precedence.LOWEST);
    if (!index) return null;

    if (!context.tokens.expect(TokenType.RBRACKET)) {
      context.errors.addTokenError(
        TokenType.RBRACKET,
        context.tokens.getCurrentToken()
      );
      return null;
    }

    return new expressions.IndexExpression(token, left, index);
  }

  // Helper Methods
  private parseExpressionList(
    context: ParsingContext,
    end: TokenType
  ): ast.Expression[] {
    const list: ast.Expression[] = [];

    if (context.tokens.isPeekToken(end)) {
      context.tokens.advance();
      return list;
    }

    context.tokens.advance();
    const exp = this.parseExpression(context, Precedence.LOWEST);
    if (exp) list.push(exp);

    while (context.tokens.isPeekToken(TokenType.COMMA)) {
      context.tokens.advance();
      context.tokens.advance();

      const exp = this.parseExpression(context, Precedence.LOWEST);
      if (exp) list.push(exp);
    }

    if (!context.tokens.expect(end)) {
      context.errors.addTokenError(end, context.tokens.getCurrentToken());
      return [];
    }

    return list;
  }
}
