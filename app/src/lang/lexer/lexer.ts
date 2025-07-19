import { lookupIdentifier, Token, TokenType } from "../token/token";

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
  private currLine: number = 1;
  private currColumn: number = 0;

  /**
   * Creates a new Lexer instance.
   * @param input The input string to be tokenized.
   */
  constructor(input: string) {
    this.input = input;
    this.readCurrChar();
  }

  /**
   * Gets the current character.
   * @returns The current character.
   */
  public getCurrCh(): string {
    return this.currCh;
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
    this.skipComments();
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

      case "%":
        token = this.createTok(TokenType.MODULUS, this.currCh);
        break;

      case "&":
        token = this.handleDoubleLiteral(
          TokenType.AND,
          TokenType.BITWISE_AND,
          "&"
        );
        break;

      case "|":
        token = this.handleDoubleLiteral(
          TokenType.OR,
          TokenType.BITWISE_OR,
          "|"
        );
        break;

      case "^":
        token = this.createTok(TokenType.BITWISE_XOR, this.currCh);
        break;

      case "~":
        token = this.createTok(TokenType.BITWISE_NOT, this.currCh);
        break;

      case "/":
        token = this.handleDoubleLiteral(
          TokenType.INTEGER_DIVISION,
          TokenType.SLASH,
          "/"
        );

        if (token.type === TokenType.SLASH) {
          token = this.handleDoubleLiteral(
            TokenType.SLASH_ASSIGN,
            TokenType.SLASH
          );
        }
        break;

      case "<":
        token = this.handleDoubleLiteral(
          TokenType.LESS_THAN_OR_EQUAL,
          TokenType.LESS_THAN
        );
        break;

      case ">":
        token = this.handleDoubleLiteral(
          TokenType.GREATER_THAN_OR_EQUAL,
          TokenType.GREATER_THAN
        );
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

      case ".":
        token = this.createTok(TokenType.DOT, this.currCh);
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
    this.currLine = 1;
    this.currColumn = 1;
  }

  /**
   * Skips whitespace characters in the input.
   */
  public skipWhitespace(): void {
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
  public readCurrChar(): void {
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

    if (this.currCh === "\n") {
      this.currLine++;
      this.currColumn = 0;
    } else {
      this.currColumn++;
    }
  }

  /**
   * Peeks at the next character without advancing the position.
   * @returns The next character in the input.
   */
  public peekChar(): string {
    return this.isOut() ? "\0" : this.input[this.readPosition];
  }

  /**
   * Creates a new token.
   * @param type The type of the token.
   * @param literal The literal value of the token.
   * @returns A new Token object.
   */
  private createTok(type: string, literal: string): Token {
    return <Token>{
      type,
      literal,
      position: { line: this.currLine, column: this.currColumn },
    };
  }

  /**
   * Reads a string literal from the input.
   * @returns The string literal without quotes.
   */
  private readString(): string {
    const result = [];
    while (true) {
      this.readCurrChar();
      if (this.currCh === "\0") throw new Error("Unterminated string");
      if (this.currCh === '"') break;

      if (this.currCh === "\\") {
        this.readCurrChar();
        result.push(this.handleEscapeSequence());
        continue;
      }

      result.push(this.currCh);
    }

    return result.join("");
  }

  /**
   * Handles identifiers and numbers in the input.
   * @returns A token representing an identifier, number, or illegal character.
   */
  private handleIdentifier(): Token {
    if (Lexer.isLetter(this.currCh)) {
      const literal = this.readIdentifier();
      if (literal === "f" && this.peekChar() == '"') {
        this.readCurrChar();
        const fstr = this.readFString();
        return this.createTok(TokenType.F_STRING, fstr);
      }

      const identType = lookupIdentifier(literal);
      return this.createTok(identType, literal);
    }

    if (Lexer.isDigit(this.currCh)) {
      const result = this.readNumber();
      const tokenType = result.isFloat ? TokenType.FLOAT : TokenType.INT;
      return this.createTok(tokenType, result.numberStr);
    }

    if (this.currCh == "." && Lexer.isDigit(this.peekChar())) {
      const result = this.readNumber();
      return this.createTok(TokenType.FLOAT, result.numberStr);
    }

    return this.createTok(TokenType.ILLEGAL, this.currCh);
  }

  /**
   * Reads an identifier from the input.
   * @returns The identifier as a string.
   */
  private readIdentifier(): string {
    const position = this.position;
    while (Lexer.isLetter(this.currCh) || Lexer.isDigit(this.currCh)) {
      this.readCurrChar();
    }

    const literal = this.input.slice(position, this.position);
    this.moveBack(1);
    return literal;
  }

  /**
   * 🔢 Enhanced readNumber method that handles both integers and floats
   *
   * From first principles, a number can be:
   * - Integer: sequence of digits (123, 0, 999)
   * - Float: digits + decimal point + digits (12.34, 0.5, 999.0)
   * - Float starting with decimal: .5 becomes 0.5
   * - Float ending with decimal: 5. becomes 5.0
   *
   * Algorithm:
   * 1. Read initial digits
   * 2. Check for decimal point
   * 3. If decimal found, read fractional part
   * 4. Return result indicating integer or float
   *
   * @return NumberParseResult containing the number string and type
   */
  private readNumber() {
    const startPosition = this.position;
    let isFloat = false;

    // Handle numbers starting with decimal point (like .5)
    if (this.currCh == ".") {
      isFloat = true;
      this.readCurrChar();

      // Must have digits after decimal point
      if (!Lexer.isDigit(this.currCh)) {
        // This is just a dot, not a number - backtrack
        this.moveBack(1);
        return { numberStr: "", isFloat: false };
      }

      // Read fractional part
      while (Lexer.isDigit(this.currCh)) {
        this.readCurrChar();
      }

      const numberStr = this.input.substring(startPosition, this.position);
      this.moveBack(1);
      return { numberStr, isFloat };
    }

    // Read integer part
    while (Lexer.isDigit(this.currCh)) {
      this.readCurrChar();
    }

    // Check for decimal point
    if (this.currCh == "." && Lexer.isDigit(this.peekChar())) {
      isFloat = true;
      this.readCurrChar(); // consume the '.'

      // Read fractional part
      while (Lexer.isDigit(this.currCh)) {
        this.readCurrChar();
      }
    }

    const numberStr = this.input.substring(startPosition, this.position);
    this.moveBack(1);
    return { numberStr, isFloat };
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

  /**
   * Skips over any comments in the input.
   * This method handles both single-line and multi-line comments.
   */
  private skipComments(): void {
    while (true) {
      this.skipWhitespace();
      if (this.currCh === "#") this.skipSingleLineComment();
      else if (this.currCh === "/" && this.peekChar() === "*")
        this.skipMultiLineComment();
      else break;
    }
  }

  /**
   * Skips over a single-line comment.
   * A single-line comment starts with '//' and continues until the end of the line.
   */
  private skipSingleLineComment(): void {
    while (this.currCh !== "\n" && this.currCh !== "\0") {
      this.readCurrChar();
    }
  }

  /**
   * Skips over a multi-line comment.
   * A multi-line comment starts with '/*' and ends with '*\/'.
   * This method also handles nested multi-line comments.
   */
  private skipMultiLineComment(): void {
    this.readCurrChar(); // skip the first '/'
    this.readCurrChar(); // skip the '*'
    let depth = 1;

    while (depth > 0 && this.currCh !== "\0") {
      if (this.currCh === "/" && this.peekChar() === "*") {
        depth++;
        this.readCurrChar();
        this.readCurrChar();
      } else if (this.currCh === "*" && this.peekChar() === "/") {
        depth--;
        this.readCurrChar();
        this.readCurrChar();
      } else {
        this.readCurrChar();
      }
    }
  }

  /**
   * 🎯 Reads an f-string literal from the input
   *
   * F-strings start with 'f"' and contain both static text and expressions in
   * braces.
   * Example: f"Hello {name}, you are {age} years old!"
   *
   * The lexer treats the entire f-string as one token - the parser will handle
   * the internal structure of static parts and expressions.
   *
   * @return The complete f-string content (without the f" and closing ")
   * @throws RuntimeException if f-string is not properly closed
   */
  private readFString() {
    let sb = "";
    let braceDepth = 0;

    while (true) {
      this.readCurrChar();

      if (this.currCh == "\0") {
        throw new Error("Unterminated f-string");
      }

      if (this.currCh == '"' && braceDepth == 0) {
        break; // End of f-string
      }

      if (this.currCh == "{") {
        braceDepth++;
      } else if (this.currCh == "}") {
        braceDepth--;
        if (braceDepth < 0) {
          throw new Error("Unmatched '}' in f-string");
        }
      }

      if (this.currCh == "\\") {
        this.readCurrChar();
        sb += this.handleEscapeSequence();
        continue;
      }

      sb += this.currCh;
    }

    if (braceDepth > 0) {
      throw new Error("Unclosed '{' in f-string");
    }

    return sb;
  }

  private handleEscapeSequence(): string {
    const escapeMap = {
      n: "\n",
      t: "\t",
      r: "\r",
      b: "\b",
      f: "\f",
      v: "\v",
      "0": "\0",
    };

    if (this.currCh in escapeMap) {
      const char = escapeMap[this.currCh as keyof typeof escapeMap];
      return char;
    }

    return this.currCh;
  }
}
