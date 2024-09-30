import Lexer from "../lexer/lexer";
import {Token, TokenType} from "../token/token";
import {ArrayLiteral, FunctionLiteral, HashLiteral, IntegerLiteral, StringLiteral,} from "../ast/literal.ts";
import {Expression, Identifier, Program, Statement} from "../ast/ast.ts";
import {BlockStatement, ExpressionStatement, LetStatement, ReturnStatement,} from "../ast/statement.ts";
import {getPrecedence, Precedence} from "./precedence.ts";
import {
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
type infixParseFunction = (expression: Expression) => Expression | null;

/**
 * Parser class responsible for parsing tokens into an Abstract Syntax Tree (AST).
 */
export class Parser {
    private lexer: Lexer;
    private currentToken!: Token;
    private peekToken!: Token;
    private errors: string[] = [];

    private prefixParseFunctions: Record<TokenType, PrefixParseFunction>;
    private infixParseFunctions: Record<TokenType, infixParseFunction>;

    /**
     * Creates a new Parser instance.
     * @param {Lexer} lexer The lexer to use for tokenization.
     */
    constructor(lexer: Lexer) {
        this.lexer = lexer;
        this.prefixParseFunctions = {} as Record<TokenType, PrefixParseFunction>;
        this.infixParseFunctions = {} as Record<TokenType, infixParseFunction>;
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
     * Parses an expression statement.
     * @returns {ExpressionStatement | null} The parsed expression statement or null if parsing fails.
     * @private
     */
    private parseExpressionStatement(): ExpressionStatement | null {
        const token = this.currentToken;
        const expression = this.parseExpression(Precedence.LOWEST);

        if (expression === null) return null;

        if (this.isPeekTokenOfType(TokenType.SEMICOLON)) this.forward();

        return new ExpressionStatement(token, expression);
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
        this.prefixParseFunctions = {} as Record<TokenType, PrefixParseFunction>;
        this.prefixParseFunctions[TokenType.IDENTIFIER] =
            this.parseIdentifier.bind(this);
        this.prefixParseFunctions[TokenType.INT] =
            this.parseIntegerLiteral.bind(this);
        this.prefixParseFunctions[TokenType.STRING] =
            this.parseStringLiteral.bind(this);
        this.prefixParseFunctions[TokenType.BANG] =
            this.parsePrefixExpression.bind(this);
        this.prefixParseFunctions[TokenType.MINUS] =
            this.parsePrefixExpression.bind(this);
        this.prefixParseFunctions[TokenType.TRUE] = this.parseBoolean.bind(this);
        this.prefixParseFunctions[TokenType.FALSE] = this.parseBoolean.bind(this);
        this.prefixParseFunctions[TokenType.LPAREN] =
            this.parseGroupedExpression.bind(this);
        this.prefixParseFunctions[TokenType.IF] = this.parseIfExpression.bind(this);
        this.prefixParseFunctions[TokenType.FUNCTION] =
            this.parseFunctionLiteral.bind(this);
        this.prefixParseFunctions[TokenType.LBRACKET] =
            this.parseArrayLiteral.bind(this);
        this.prefixParseFunctions[TokenType.LBRACE] =
            this.parseHashLiteral.bind(this);
    }

    /**
     * Creates the map of infix parse functions.
     * @private
     */
    private createInfixFnMap(): void {
        this.infixParseFunctions = {} as Record<TokenType, infixParseFunction>;

        this.infixParseFunctions[TokenType.PLUS] =
            this.parseInfixExpression.bind(this);
        this.infixParseFunctions[TokenType.MINUS] =
            this.parseInfixExpression.bind(this);
        this.infixParseFunctions[TokenType.SLASH] =
            this.parseInfixExpression.bind(this);
        this.infixParseFunctions[TokenType.ASTERISK] =
            this.parseInfixExpression.bind(this);
        this.infixParseFunctions[TokenType.EQ] =
            this.parseInfixExpression.bind(this);
        this.infixParseFunctions[TokenType.NOT_EQ] =
            this.parseInfixExpression.bind(this);
        this.infixParseFunctions[TokenType.LESS_THAN] =
            this.parseInfixExpression.bind(this);
        this.infixParseFunctions[TokenType.GREATER_THAN] =
            this.parseInfixExpression.bind(this);
        this.infixParseFunctions[TokenType.LPAREN] =
            this.parseCallExpression.bind(this);
        this.infixParseFunctions[TokenType.LBRACKET] =
            this.parseIndexExpression.bind(this);
    }
}