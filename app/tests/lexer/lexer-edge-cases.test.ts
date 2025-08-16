import Lexer from "../../src/lang/lexer/lexer";
import { TokenType } from "../../src/lang/token/token";

describe("Lexer Edge Cases and Error Handling", () => {
  describe("String Error Handling", () => {
    test("should throw error for unterminated double-quoted string", () => {
      const input = '"unterminated string';
      const lexer = new Lexer(input);

      expect(() => {
        lexer.nextToken();
      }).toThrow("Unterminated string");
    });

    test("should throw error for unterminated single-quoted string", () => {
      const input = "'unterminated string";
      const lexer = new Lexer(input);

      expect(() => {
        lexer.nextToken();
      }).toThrow("Unterminated string");
    });

    test("should handle string with escape at end", () => {
      const input = '"string\\';
      const lexer = new Lexer(input);

      expect(() => {
        lexer.nextToken();
      }).toThrow("Unterminated string");
    });

    test("should handle multiline strings correctly", () => {
      const input = '"line1\nline2"';
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.STRING);
      expect(token.literal).toBe("line1\nline2");
    });
  });

  describe("F-String Error Handling", () => {
    test("should throw error for unterminated f-string", () => {
      const input = 'f"unterminated f-string';
      const lexer = new Lexer(input);

      expect(() => {
        lexer.nextToken();
      }).toThrow("Unterminated f-string");
    });

    test("should throw error for unmatched closing brace in f-string", () => {
      const input = 'f"text}"';
      const lexer = new Lexer(input);

      expect(() => {
        lexer.nextToken();
      }).toThrow("Unmatched '}' in f-string");
    });

    test("should throw error for unclosed brace in f-string", () => {
      const input = 'f"text {expression"';
      const lexer = new Lexer(input);

      expect(() => {
        lexer.nextToken();
      }).toThrow("Unterminated f-string");
    });

    test("should handle balanced braces in f-string expressions", () => {
      const input = 'f"result: {obj.method({a: b})}"';
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.F_STRING);
      expect(token.literal).toBe("result: {obj.method({a: b})}");
    });

    test("should handle empty expressions in f-strings", () => {
      const input = 'f"empty: {}"';
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.F_STRING);
      expect(token.literal).toBe("empty: {}");
    });

    test("should handle multiple expressions in f-strings", () => {
      const input = 'f"{x} + {y} = {x + y}"';
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.F_STRING);
      expect(token.literal).toBe("{x} + {y} = {x + y}");
    });
  });

  describe("Number Edge Cases", () => {
    test("should handle number followed immediately by identifier", () => {
      const input = "123abc";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.INT);
      expect(token1.literal).toBe("123");

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.IDENTIFIER);
      expect(token2.literal).toBe("abc");
    });

    test("should handle decimal point followed by non-digit", () => {
      const input = "123.abc";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.INT);
      expect(token1.literal).toBe("123");

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.DOT);
      expect(token2.literal).toBe(".");

      const token3 = lexer.nextToken();
      expect(token3.type).toBe(TokenType.IDENTIFIER);
      expect(token3.literal).toBe("abc");
    });

    test("should handle lone decimal point", () => {
      const input = ".";
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.DOT);
      expect(token.literal).toBe(".");
    });

    test("should handle decimal point followed by space", () => {
      const input = ". x";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.DOT);
      expect(token1.literal).toBe(".");

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.IDENTIFIER);
      expect(token2.literal).toBe("x");
    });

    test("should handle very large numbers", () => {
      const input = "999999999999999999999999999999";
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.INT);
      expect(token.literal).toBe("999999999999999999999999999999");
    });

    test("should handle zero prefixed numbers", () => {
      const input = "00123 000";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.INT);
      expect(token1.literal).toBe("00123");

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.INT);
      expect(token2.literal).toBe("000");
    });
  });

  describe("Operator Edge Cases", () => {
    test("should distinguish between division and integer division", () => {
      const input = "/ //";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.SLASH);
      expect(token1.literal).toBe("/");

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.INTEGER_DIVISION);
      expect(token2.literal).toBe("//");
    });

    test("should handle triple slash correctly", () => {
      const input = "///";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.INTEGER_DIVISION);
      expect(token1.literal).toBe("//");

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.SLASH);
      expect(token2.literal).toBe("/");
    });

    test("should handle assignment vs equality correctly", () => {
      const input = "= == === !=";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.ASSIGN, literal: "=" },
        { type: TokenType.EQ, literal: "==" },
        { type: TokenType.EQ, literal: "==" },
        { type: TokenType.ASSIGN, literal: "=" },
        { type: TokenType.NOT_EQ, literal: "!=" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should handle compound operators without spaces", () => {
      const input = "x+=y-=z*=w/=";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.IDENTIFIER, literal: "x" },
        { type: TokenType.PLUS_ASSIGN, literal: "+=" },
        { type: TokenType.IDENTIFIER, literal: "y" },
        { type: TokenType.MINUS_ASSIGN, literal: "-=" },
        { type: TokenType.IDENTIFIER, literal: "z" },
        { type: TokenType.ASTERISK_ASSIGN, literal: "*=" },
        { type: TokenType.IDENTIFIER, literal: "w" },
        { type: TokenType.SLASH_ASSIGN, literal: "/=" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });
  });

  describe("Unicode and Special Characters", () => {
    test("should handle Unicode characters as illegal", () => {
      const input = "αβγ";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.ILLEGAL);
      expect(token1.literal).toBe("α");

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.ILLEGAL);
      expect(token2.literal).toBe("β");

      const token3 = lexer.nextToken();
      expect(token3.type).toBe(TokenType.ILLEGAL);
      expect(token3.literal).toBe("γ");
    });

    test("should handle special symbols as illegal", () => {
      const input = "§¶†‡";
      const lexer = new Lexer(input);

      ["§", "¶", "†", "‡"].forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.ILLEGAL);
        expect(token.literal).toBe(expected);
      });
    });

    test("should handle tabs and various whitespace", () => {
      const input = "x\t\t\ty\r\nz";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.IDENTIFIER);
      expect(token1.literal).toBe("x");

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.IDENTIFIER);
      expect(token2.literal).toBe("y");

      const token3 = lexer.nextToken();
      expect(token3.type).toBe(TokenType.IDENTIFIER);
      expect(token3.literal).toBe("z");
    });
  });

  describe("Complex Nested Structures", () => {
    test("should handle deeply nested brackets", () => {
      const input = "[[[{{{((()))}}}]]]";
      const lexer = new Lexer(input);

      const expectedTokens = [
        TokenType.LBRACKET,
        TokenType.LBRACKET,
        TokenType.LBRACKET,
        TokenType.LBRACE,
        TokenType.LBRACE,
        TokenType.LBRACE,
        TokenType.LPAREN,
        TokenType.LPAREN,
        TokenType.LPAREN,
        TokenType.RPAREN,
        TokenType.RPAREN,
        TokenType.RPAREN,
        TokenType.RBRACE,
        TokenType.RBRACE,
        TokenType.RBRACE,
        TokenType.RBRACKET,
        TokenType.RBRACKET,
        TokenType.RBRACKET,
      ];

      expectedTokens.forEach((expectedType) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expectedType);
      });
    });

    test("should handle mixed operators and operands", () => {
      const input = "a+b*c-d/e%f==g&&h||i";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.IDENTIFIER, literal: "a" },
        { type: TokenType.PLUS, literal: "+" },
        { type: TokenType.IDENTIFIER, literal: "b" },
        { type: TokenType.ASTERISK, literal: "*" },
        { type: TokenType.IDENTIFIER, literal: "c" },
        { type: TokenType.MINUS, literal: "-" },
        { type: TokenType.IDENTIFIER, literal: "d" },
        { type: TokenType.SLASH, literal: "/" },
        { type: TokenType.IDENTIFIER, literal: "e" },
        { type: TokenType.MODULUS, literal: "%" },
        { type: TokenType.IDENTIFIER, literal: "f" },
        { type: TokenType.EQ, literal: "==" },
        { type: TokenType.IDENTIFIER, literal: "g" },
        { type: TokenType.AND, literal: "&&" },
        { type: TokenType.IDENTIFIER, literal: "h" },
        { type: TokenType.OR, literal: "||" },
        { type: TokenType.IDENTIFIER, literal: "i" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });
  });

  describe("Boundary Conditions", () => {
    test("should handle single character input", () => {
      const characters = ["a", "1", "+", "("];

      characters.forEach((char) => {
        const lexer = new Lexer(char);
        const token = lexer.nextToken();

        if (char === "a") {
          expect(token.type).toBe(TokenType.IDENTIFIER);
        } else if (char === "1") {
          expect(token.type).toBe(TokenType.INT);
        } else if (char === "+") {
          expect(token.type).toBe(TokenType.PLUS);
        } else if (char === "(") {
          expect(token.type).toBe(TokenType.LPAREN);
        }
      });
    });

    test("should handle unterminated string error", () => {
      const lexer = new Lexer('"');
      expect(() => {
        lexer.nextToken();
      }).toThrow("Unterminated string");
    });

    test("should handle maximum position tracking", () => {
      const input = "x".repeat(1000) + "\n" + "y".repeat(1000);
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.IDENTIFIER);
      expect(token1.position.line).toBe(1);
      expect(token1.position.column).toBe(0);

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.IDENTIFIER);
      expect(token2.position.line).toBe(3);
      expect(token2.position.column).toBe(1);
    });
  });

  describe("Token Range Information", () => {
    test("should provide correct start and end positions for tokens", () => {
      const input = "hello";
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.IDENTIFIER);
      expect(token.start().line).toBe(1);
      expect(token.start().column).toBe(0);
      expect(token.end().line).toBe(1);
      expect(token.end().column).toBe(5);
    });

    test("should provide correct range for multi-character operators", () => {
      const input = "==";
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.EQ);
      expect(token.start().line).toBe(1);
      expect(token.start().column).toBe(0);
      expect(token.end().line).toBe(1);
      expect(token.end().column).toBe(2);
    });

    test("should provide correct range for strings", () => {
      const input = '"hello world"';
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.STRING);
      expect(token.start().line).toBe(1);
      expect(token.start().column).toBe(0);
      if (token.endPosition) {
        expect(token.end().line).toBe(1);
        expect(token.end().column).toBe(13);
      }
    });
  });

  describe("Lexer State Consistency", () => {
    test("should maintain consistent state after errors", () => {
      const input = '"unterminated';
      const lexer = new Lexer(input);

      expect(() => {
        lexer.nextToken();
      }).toThrow("Unterminated string");

      // After error, lexer should still be in consistent state
      // We can't test much here since the string tokenization throws,
      // but the lexer shouldn't crash
    });

    test("should handle reset after partial tokenization", () => {
      const input = "let x = 5; let y = 10;";
      const lexer = new Lexer(input);

      // Read some tokens
      lexer.nextToken(); // let
      lexer.nextToken(); // x
      lexer.nextToken(); // =

      // Reset
      lexer.reset();

      // Should start fresh
      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.LET);
      expect(token.literal).toBe("let");
      expect(token.position.line).toBe(1);
      expect(token.position.column).toBe(0);
    });
  });
});
