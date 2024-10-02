import Lexer from "../src/lang/lexer/lexer.ts";
import { Token, TokenType } from "../src/lang/token/token.ts";
import { describe, expect, it } from "@jest/globals";

describe("Lexer", () => {
  it("nextToken", () => {
    const input = `let five = 5;
      let ten = 10;
      let add = fn(x, y) {
        x + y;
      };
      let result = add(five, ten);
      !-/*5;
      5 < 10 > 5;
      if (5 < 10) {
        return true;
      } else {
        return false;
      }
      10 == 10;
      10 != 9;
      "foobar"
      "foo bar"
      [1, 2];
      {"foo": "bar"}
    `;

    const tests: Token[] = [
      { type: TokenType.LET, literal: "let" },
      { type: TokenType.IDENTIFIER, literal: "five" },
      { type: TokenType.ASSIGN, literal: "=" },
      { type: TokenType.INT, literal: "5" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.LET, literal: "let" },
      { type: TokenType.IDENTIFIER, literal: "ten" },
      { type: TokenType.ASSIGN, literal: "=" },
      { type: TokenType.INT, literal: "10" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.LET, literal: "let" },
      { type: TokenType.IDENTIFIER, literal: "add" },
      { type: TokenType.ASSIGN, literal: "=" },
      { type: TokenType.FUNCTION, literal: "fn" },
      { type: TokenType.LPAREN, literal: "(" },
      { type: TokenType.IDENTIFIER, literal: "x" },
      { type: TokenType.COMMA, literal: "," },
      { type: TokenType.IDENTIFIER, literal: "y" },
      { type: TokenType.RPAREN, literal: ")" },
      { type: TokenType.LBRACE, literal: "{" },
      { type: TokenType.IDENTIFIER, literal: "x" },
      { type: TokenType.PLUS, literal: "+" },
      { type: TokenType.IDENTIFIER, literal: "y" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.RBRACE, literal: "}" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.LET, literal: "let" },
      { type: TokenType.IDENTIFIER, literal: "result" },
      { type: TokenType.ASSIGN, literal: "=" },
      { type: TokenType.IDENTIFIER, literal: "add" },
      { type: TokenType.LPAREN, literal: "(" },
      { type: TokenType.IDENTIFIER, literal: "five" },
      { type: TokenType.COMMA, literal: "," },
      { type: TokenType.IDENTIFIER, literal: "ten" },
      { type: TokenType.RPAREN, literal: ")" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.BANG, literal: "!" },
      { type: TokenType.MINUS, literal: "-" },
      { type: TokenType.SLASH, literal: "/" },
      { type: TokenType.ASTERISK, literal: "*" },
      { type: TokenType.INT, literal: "5" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.INT, literal: "5" },
      { type: TokenType.LESS_THAN, literal: "<" },
      { type: TokenType.INT, literal: "10" },
      { type: TokenType.GREATER_THAN, literal: ">" },
      { type: TokenType.INT, literal: "5" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.IF, literal: "if" },
      { type: TokenType.LPAREN, literal: "(" },
      { type: TokenType.INT, literal: "5" },
      { type: TokenType.LESS_THAN, literal: "<" },
      { type: TokenType.INT, literal: "10" },
      { type: TokenType.RPAREN, literal: ")" },
      { type: TokenType.LBRACE, literal: "{" },
      { type: TokenType.RETURN, literal: "return" },
      { type: TokenType.TRUE, literal: "true" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.RBRACE, literal: "}" },
      { type: TokenType.ELSE, literal: "else" },
      { type: TokenType.LBRACE, literal: "{" },
      { type: TokenType.RETURN, literal: "return" },
      { type: TokenType.FALSE, literal: "false" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.RBRACE, literal: "}" },
      { type: TokenType.INT, literal: "10" },
      { type: TokenType.EQ, literal: "==" },
      { type: TokenType.INT, literal: "10" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.INT, literal: "10" },
      { type: TokenType.NOT_EQ, literal: "!=" },
      { type: TokenType.INT, literal: "9" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.STRING, literal: "foobar" },
      { type: TokenType.STRING, literal: "foo bar" },
      { type: TokenType.LBRACKET, literal: "[" },
      { type: TokenType.INT, literal: "1" },
      { type: TokenType.COMMA, literal: "," },
      { type: TokenType.INT, literal: "2" },
      { type: TokenType.RBRACKET, literal: "]" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.LBRACE, literal: "{" },
      { type: TokenType.STRING, literal: "foo" },
      { type: TokenType.COLON, literal: ":" },
      { type: TokenType.STRING, literal: "bar" },
      { type: TokenType.RBRACE, literal: "}" },
      { type: TokenType.EOF, literal: "" },
    ];

    const l = new Lexer(input);

    tests.forEach((tt) => {
      const tok = l.nextToken();
      expect(tok.type).toBe(tt.type);
      expect(tok.literal).toBe(tt.literal);
    });
  });
});

describe("Lexer double tokens", () => {
  it("handles double tokens", () => {
    const input = `== != += -= *= /= && ||`;

    const tests: Token[] = [
      { type: TokenType.EQ, literal: "==" },
      { type: TokenType.NOT_EQ, literal: "!=" },
      { type: TokenType.PLUS_ASSIGN, literal: "+=" },
      { type: TokenType.MINUS_ASSIGN, literal: "-=" },
      { type: TokenType.ASTERISK_ASSIGN, literal: "*=" },
      { type: TokenType.SLASH_ASSIGN, literal: "/=" },
      { type: TokenType.AND, literal: "&&" },
      { type: TokenType.OR, literal: "||" },
      { type: TokenType.EOF, literal: "" },
    ];

    const l = new Lexer(input);

    tests.forEach((tt) => {
      const tok = l.nextToken();
      expect(tok.type).toBe(tt.type);
      expect(tok.literal).toBe(tt.literal);
    });
  });
});
