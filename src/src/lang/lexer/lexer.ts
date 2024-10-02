import {lookupIdentifier, Token, TokenType} from "../token/token.ts";

/**
 * Lexer class for tokenizing input strings.
 * This class is responsible for breaking down the input into individual tokens
 * that can be used by a parser.
 */
export default class Lexer {
    private readonly input: string;
    private position: number = 0;
    private readPosition: number = 0;
    private currCh: string = "";

    /**
     * Creates a new Lexer instance.
     * @param input The input string to be tokenized.
     */
    constructor(input: string) {
        this.input = input;
        this.readCurrChar();
    }

    /**
     * Checks if a character is a letter or underscore.
     * @param ch The character to check.
     * @returns True if the character is a letter or underscore, false otherwise.
     */
    private static isLetter(ch: string): boolean {
        return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_";
    }

    /**
     * Checks if a character is a digit.
     * @param ch The character to check.
     * @returns True if the character is a digit, false otherwise.
     */
    private static isDigit(ch: string): boolean {
        return ch >= "0" && ch <= "9";
    }

    /**
     * Reads the next token from the input.
     * @returns The next token in the input.
     */
    public nextToken(): Token {
        let token: Token;
        this.skipWhitespace();

        switch (this.currCh) {
            case "=":
                token = this.handleDoubleLiteral(TokenType.EQ, TokenType.ASSIGN);
                break;

            case "!":
                token = this.handleDoubleLiteral(TokenType.NOT_EQ, TokenType.BANG);
                break;

            case ";":
                token = this.createTok(TokenType.SEMICOLON, this.currCh);
                break;

            case "(":
                token = this.createTok(TokenType.LPAREN, this.currCh);
                break;

            case ")":
                token = this.createTok(TokenType.RPAREN, this.currCh);
                break;

            case ",":
                token = this.createTok(TokenType.COMMA, this.currCh);
                break;

            case "+":
                token = this.handleDoubleLiteral(TokenType.PLUS_ASSIGN, TokenType.PLUS);
                break;

            case "-":
                token = this.handleDoubleLiteral(
                    TokenType.MINUS_ASSIGN,
                    TokenType.MINUS
                );
                break;

            case "*":
                token = this.handleDoubleLiteral(
                    TokenType.ASTERISK_ASSIGN,
                    TokenType.ASTERISK
                );
                break;

            case "&":
                token = this.handleDoubleLiteral(TokenType.AND, TokenType.BITWISE_AND, "&");
                break;

            case "|":
                token = this.handleDoubleLiteral(TokenType.OR, TokenType.BITWISE_OR, "|");
                break;

            case "^":
                token = this.createTok(TokenType.BITWISE_XOR, this.currCh);
                break;

            case "~":
                token = this.createTok(TokenType.BITWISE_NOT, this.currCh);
                break;

            case "/":
                token = this.handleDoubleLiteral(
                    TokenType.SLASH_ASSIGN,
                    TokenType.SLASH
                );
                break;

            case "<":
                token = this.createTok(TokenType.LESS_THAN, this.currCh);
                break;

            case ">":
                token = this.createTok(TokenType.GREATER_THAN, this.currCh);
                break;

            case "{":
                token = this.createTok(TokenType.LBRACE, this.currCh);
                break;

            case "}":
                token = this.createTok(TokenType.RBRACE, this.currCh);
                break;

            case "[":
                token = this.createTok(TokenType.LBRACKET, this.currCh);
                break;

            case "]":
                token = this.createTok(TokenType.RBRACKET, this.currCh);
                break;

            case ":":
                token = this.createTok(TokenType.COLON, this.currCh);
                break;

            case '"':
                token = this.createTok(TokenType.STRING, this.readString());
                break;

            case "\0":
                token = this.createTok(TokenType.EOF, "");
                break;

            default:
                token = this.handleIdentifier();
                break;
        }

        this.readCurrChar();
        return token;
    }

    /**
     * Resets the lexer to the beginning of the input.
     */
    public reset(): void {
        this.position = 0;
        this.readPosition = 0;
        this.currCh = "";
        this.readCurrChar();
    }

    /**
     * Skips whitespace characters in the input.
     */
    private skipWhitespace(): void {
        while (
            this.currCh === " " ||
            this.currCh === "\t" ||
            this.currCh === "\n" ||
            this.currCh === "\r"
            ) {
            this.readCurrChar();
        }
    }

    /**
     * Reads the current character and advances the position.
     */
    private readCurrChar(): void {
        this.currCh = this.isOut() ? "\0" : this.input[this.readPosition];
        this.advance();
    }

    /**
     * Checks if the read position is out of bounds.
     * @returns True if the read position is out of bounds, false otherwise.
     */
    private isOut(): boolean {
        return this.readPosition >= this.input.length;
    }

    /**
     * Advances the position and read position.
     */
    private advance(): void {
        this.position = this.readPosition;
        this.readPosition++;
    }

    /**
     * Peeks at the next character without advancing the position.
     * @returns The next character in the input.
     */
    private peekChar(): string {
        return this.isOut() ? "\0" : this.input[this.readPosition];
    }

    /**
     * Creates a new token.
     * @param type The type of the token.
     * @param literal The literal value of the token.
     * @returns A new Token object.
     */
    private createTok(type: string, literal: string): Token {
        return <Token>{type, literal};
    }

    /**
     * Reads a string literal from the input.
     * @returns The string literal without quotes.
     */
    private readString(): string {
        const startPos = this.position + 1; // skip the opening quote
        while (true) {
            this.readCurrChar();
            if (this.currCh === '"' || this.currCh === "\0") {
                break;
            }
        }

        const endPos = this.position;
        return this.input.substring(startPos, endPos);
    }

    /**
     * Handles identifiers and numbers in the input.
     * @returns A token representing an identifier, number, or illegal character.
     */
    private handleIdentifier(): Token {
        if (Lexer.isLetter(this.currCh)) {
            const literal = this.readIdentifier();
            const identType = lookupIdentifier(literal);
            return this.createTok(identType, literal);
        } else if (Lexer.isDigit(this.currCh)) {
            const literal = this.readNumber();
            return this.createTok(TokenType.INT, literal);
        }

        return this.createTok(TokenType.ILLEGAL, this.currCh);
    }

    /**
     * Reads an identifier from the input.
     * @returns The identifier as a string.
     */
    private readIdentifier(): string {
        const position = this.position;
        while (Lexer.isLetter(this.currCh)) {
            this.readCurrChar();
        }

        const literal = this.input.slice(position, this.position);
        this.moveBack(1);
        return literal;
    }

    /**
     * Reads a number from the input.
     * @returns The number as a string.
     */
    private readNumber(): string {
        const position = this.position;
        while (Lexer.isDigit(this.currCh)) {
            this.readCurrChar();
        }

        const literal = this.input.slice(position, this.position);
        this.moveBack(1);
        return literal;
    }

    /**
     * Handles double-character literals like '==' and '!='.
     * @param tokTypeIfDouble The token type if it's a double-character literal.
     * @param defaultTokType The default token type if it's a single-character literal.
     * @param peekChar The character to peek for. Defaults to "=".
     * @returns A token representing the literal.
     */
    private handleDoubleLiteral(
        tokTypeIfDouble: TokenType,
        defaultTokType: TokenType,
        peekChar: string = "="
    ): Token {
        const curr = this.currCh;
        if (this.peekChar() === peekChar) {
            this.readCurrChar();
            return this.createTok(tokTypeIfDouble, curr + peekChar);
        }

        return this.createTok(defaultTokType, curr);
    }

    /**
     * Moves the position back by a specified number of steps.
     * @param steps The number of steps to move back.
     */
    private moveBack(steps: number): void {
        this.position = this.position - steps;
        this.readPosition = this.readPosition - steps;
        this.currCh = this.input[this.position];
    }
}