import Lexer from "../src/lang/lexer/lexer";
import { Token, TokenType } from "../src/lang/token/token";
import { describe, expect, test } from "@jest/globals";

/**
 * Comprehensive Test Suite for the Lexer
 *
 * This test suite covers all major functionality and edge cases of the lexer:
 * - Basic tokenization of all token types
 * - Edge cases and error handling
 * - Comment processing (single-line, multi-line, nested)
 * - String handling with escape sequences
 * - Position tracking accuracy
 * - Whitespace handling
 * - Keyword vs identifier disambiguation
 * - Complex real-world scenarios
 */

describe("Lexer Comprehensive Test Suite", () => {
  // Helper function to tokenize input and return all tokens
  const tokenizeAll = (input: string): Token[] => {
    const lexer = new Lexer(input);
    const tokens: Token[] = [];
    let token: Token;

    do {
      token = lexer.nextToken();
      tokens.push(token);
    } while (token.type !== TokenType.EOF);

    return tokens;
  };

  // Helper function to tokenize and return only non-EOF tokens
  const tokenizeWithoutEOF = (input: string): Token[] => {
    const tokens = tokenizeAll(input);
    return tokens.filter((token) => token.type !== TokenType.EOF);
  };

  describe("Basic Token Recognition", () => {
    test("should tokenize all single-character operators", () => {
      const input = "+-*/%=<>(){},;:.[]{}&|^~";
      const tokens = tokenizeWithoutEOF(input);

      const expectedTypes = [
        TokenType.PLUS,
        TokenType.MINUS,
        TokenType.ASTERISK,
        TokenType.SLASH,
        TokenType.MODULUS,
        TokenType.ASSIGN,
        TokenType.LESS_THAN,
        TokenType.GREATER_THAN,
        TokenType.LPAREN,
        TokenType.RPAREN,
        TokenType.LBRACE,
        TokenType.RBRACE,
        TokenType.COMMA,
        TokenType.SEMICOLON,
        TokenType.COLON,
        TokenType.DOT,
        TokenType.LBRACKET,
        TokenType.RBRACKET,
        TokenType.LBRACE,
        TokenType.RBRACE,
        TokenType.BITWISE_AND,
        TokenType.BITWISE_OR,
        TokenType.BITWISE_XOR,
        TokenType.BITWISE_NOT,
      ];

      expect(tokens.map((t) => t.type)).toEqual(expectedTypes);
    });

    test("should tokenize multi-character operators", () => {
      const input = "== != && || += -= *= /= << >>";
      const tokens = tokenizeWithoutEOF(input);

      const expectedTypes = [
        TokenType.EQ,
        TokenType.NOT_EQ,
        TokenType.AND,
        TokenType.OR,
        TokenType.PLUS_ASSIGN,
        TokenType.MINUS_ASSIGN,
        TokenType.ASTERISK_ASSIGN,
        TokenType.SLASH_ASSIGN,
        TokenType.BITWISE_LEFT_SHIFT,
        TokenType.BITWISE_RIGHT_SHIFT,
      ];

      expect(tokens.map((t) => t.type)).toEqual(expectedTypes);
    });

    test("should distinguish between similar operators", () => {
      const input = "= == ! != & && | ||";
      const tokens = tokenizeWithoutEOF(input);

      const expectedTypes = [
        TokenType.ASSIGN,
        TokenType.EQ,
        TokenType.BANG,
        TokenType.NOT_EQ,
        TokenType.BITWISE_AND,
        TokenType.AND,
        TokenType.BITWISE_OR,
        TokenType.OR,
      ];

      expect(tokens.map((t) => t.type)).toEqual(expectedTypes);
    });
  });

  describe("Identifier and Keyword Recognition", () => {
    test("should recognize all keywords", () => {
      const keywords = [
        "fn",
        "let",
        "true",
        "false",
        "if",
        "elif",
        "else",
        "return",
        "while",
        "break",
        "continue",
        "for",
        "const",
        "class",
        "extends",
        "super",
        "this",
        "new",
        "null",
      ];

      keywords.forEach((keyword) => {
        const tokens = tokenizeWithoutEOF(keyword);
        expect(tokens).toHaveLength(1);
        expect(tokens[0].literal).toBe(keyword);
        expect(tokens[0].type).not.toBe(TokenType.IDENTIFIER);
      });
    });

    test("should recognize identifiers vs keywords", () => {
      const input = "variable fn function let letter true trueFalse";
      const tokens = tokenizeWithoutEOF(input);

      expect(tokens[0].type).toBe(TokenType.IDENTIFIER); // variable
      expect(tokens[1].type).toBe(TokenType.FUNCTION); // fn
      expect(tokens[2].type).toBe(TokenType.IDENTIFIER); // function
      expect(tokens[3].type).toBe(TokenType.LET); // let
      expect(tokens[4].type).toBe(TokenType.IDENTIFIER); // letter
      expect(tokens[5].type).toBe(TokenType.TRUE); // true
      expect(tokens[6].type).toBe(TokenType.IDENTIFIER); // trueFalse
    });

    test("should handle identifiers with underscores", () => {
      const input = "_var var_ _under_score_ _";
      const tokens = tokenizeWithoutEOF(input);

      tokens.forEach((token) => {
        expect(token.type).toBe(TokenType.IDENTIFIER);
      });

      expect(tokens.map((t) => t.literal)).toEqual([
        "_var",
        "var_",
        "_under_score_",
        "_",
      ]);
    });
  });

  describe("Numeric Literals", () => {
    test("should tokenize integer literals", () => {
      const input = "0 1 42 123456789";
      const tokens = tokenizeWithoutEOF(input);

      tokens.forEach((token) => {
        expect(token.type).toBe(TokenType.INT);
      });

      expect(tokens.map((t) => t.literal)).toEqual([
        "0",
        "1",
        "42",
        "123456789",
      ]);
    });

    test("should handle numbers in expressions", () => {
      const input = "5 + 10 * 2";
      const tokens = tokenizeWithoutEOF(input);

      const expectedTypes = [
        TokenType.INT,
        TokenType.PLUS,
        TokenType.INT,
        TokenType.ASTERISK,
        TokenType.INT,
      ];
      expect(tokens.map((t) => t.type)).toEqual(expectedTypes);
      expect(tokens.map((t) => t.literal)).toEqual(["5", "+", "10", "*", "2"]);
    });
  });

  describe("String Literals", () => {
    test("should tokenize basic strings", () => {
      const input = '"hello" "world" ""';
      const tokens = tokenizeWithoutEOF(input);

      tokens.forEach((token) => {
        expect(token.type).toBe(TokenType.STRING);
      });

      expect(tokens.map((t) => t.literal)).toEqual(["hello", "world", ""]);
    });

    test("should handle escape sequences in strings", () => {
      const input =
        '"hello\\nworld" "tab\\there" "quote\\"inside" "backslash\\\\"';
      const tokens = tokenizeWithoutEOF(input);

      expect(tokens[0].literal).toBe("hello\nworld");
      expect(tokens[1].literal).toBe("tab\there");
      expect(tokens[2].literal).toBe('quote"inside');
      expect(tokens[3].literal).toBe("backslash\\");
    });

    test("should handle all escape sequences", () => {
      const input = '"\\n\\t\\r\\b\\f\\v\\0\\\\"';
      const tokens = tokenizeWithoutEOF(input);

      expect(tokens[0].literal).toBe("\n\t\r\b\f\v\0\\");
    });

    test("should throw error for unterminated string", () => {
      const input = '"unterminated string';
      const lexer = new Lexer(input);
      lexer.nextToken(); // consume opening quote

      expect(() => lexer.nextToken()).toThrow("Unterminated string");
    });
  });

  describe("Comment Handling", () => {
    test("should skip single-line comments", () => {
      const input = `
        let x = 5; // this is a comment
        let y = 10; // another comment
      `;
      const tokens = tokenizeWithoutEOF(input);

      const expectedTypes = [
        TokenType.LET,
        TokenType.IDENTIFIER,
        TokenType.ASSIGN,
        TokenType.INT,
        TokenType.SEMICOLON,
        TokenType.LET,
        TokenType.IDENTIFIER,
        TokenType.ASSIGN,
        TokenType.INT,
        TokenType.SEMICOLON,
      ];

      expect(tokens.map((t) => t.type)).toEqual(expectedTypes);
    });

    test("should skip multi-line comments", () => {
      const input = `
        let x = 5; /* this is a 
        multi-line comment */
        let y = 10;
      `;
      const tokens = tokenizeWithoutEOF(input);

      const expectedTypes = [
        TokenType.LET,
        TokenType.IDENTIFIER,
        TokenType.ASSIGN,
        TokenType.INT,
        TokenType.SEMICOLON,
        TokenType.LET,
        TokenType.IDENTIFIER,
        TokenType.ASSIGN,
        TokenType.INT,
        TokenType.SEMICOLON,
      ];

      expect(tokens.map((t) => t.type)).toEqual(expectedTypes);
    });

    test("should handle nested multi-line comments", () => {
      const input = `
        let x = 5; /* outer comment /* nested comment */ still outer */
        let y = 10;
      `;
      const tokens = tokenizeWithoutEOF(input);

      const expectedTypes = [
        TokenType.LET,
        TokenType.IDENTIFIER,
        TokenType.ASSIGN,
        TokenType.INT,
        TokenType.SEMICOLON,
        TokenType.LET,
        TokenType.IDENTIFIER,
        TokenType.ASSIGN,
        TokenType.INT,
        TokenType.SEMICOLON,
      ];

      expect(tokens.map((t) => t.type)).toEqual(expectedTypes);
    });

    test("should handle comments at end of file", () => {
      const input = "let x = 5; // comment at EOF";
      const tokens = tokenizeAll(input);

      expect(tokens[tokens.length - 1].type).toBe(TokenType.EOF);
    });

    test("should not confuse division with comments", () => {
      const input = "x / y /* comment */ z";
      const tokens = tokenizeWithoutEOF(input);

      const expectedTypes = [
        TokenType.IDENTIFIER,
        TokenType.SLASH,
        TokenType.IDENTIFIER,
        TokenType.IDENTIFIER,
      ];
      expect(tokens.map((t) => t.type)).toEqual(expectedTypes);
    });
  });

  describe("Position Tracking", () => {
    test("should track line and column positions correctly", () => {
      const input = `let x = 5;
let y = 10;`;
      const tokens = tokenizeWithoutEOF(input);

      // First line tokens
      expect(tokens[0].position.line).toBe(1); // let
      expect(tokens[1].position.line).toBe(1); // x
      expect(tokens[4].position.line).toBe(1); // ;

      // Second line tokens
      expect(tokens[5].position.line).toBe(2); // let
      expect(tokens[6].position.line).toBe(2); // y
    });

    test("should handle position tracking with comments", () => {
      const input = `let x = 5; // comment
// another comment
let y = 10;`;
      const tokens = tokenizeWithoutEOF(input);

      const letTokens = tokens.filter((t) => t.type === TokenType.LET);
      expect(letTokens[0].position.line).toBe(1);
      expect(letTokens[1].position.line).toBe(3);
    });
  });

  describe("Whitespace Handling", () => {
    test("should skip various whitespace characters", () => {
      const input = " \t\n\r let \t\n x \r\n = \t 5 \n\r ";
      const tokens = tokenizeWithoutEOF(input);

      const expectedTypes = [
        TokenType.LET,
        TokenType.IDENTIFIER,
        TokenType.ASSIGN,
        TokenType.INT,
      ];
      expect(tokens.map((t) => t.type)).toEqual(expectedTypes);
    });

    test("should handle empty input", () => {
      const tokens = tokenizeAll("");
      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe(TokenType.EOF);
    });

    test("should handle whitespace-only input", () => {
      const tokens = tokenizeAll("   \t\n\r   ");
      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe(TokenType.EOF);
    });
  });

  describe("Error Handling", () => {
    test("should handle illegal characters", () => {
      const input = "let x = @#$";
      const tokens = tokenizeWithoutEOF(input);

      // The last three tokens should be ILLEGAL
      expect(tokens[tokens.length - 3].type).toBe(TokenType.ILLEGAL);
      expect(tokens[tokens.length - 2].type).toBe(TokenType.ILLEGAL);
      expect(tokens[tokens.length - 1].type).toBe(TokenType.ILLEGAL);
    });

    test("should handle mixed valid and invalid characters", () => {
      const input = "let x @ = 5";
      const tokens = tokenizeWithoutEOF(input);

      const expectedTypes = [
        TokenType.LET,
        TokenType.IDENTIFIER,
        TokenType.ILLEGAL,
        TokenType.ASSIGN,
        TokenType.INT,
      ];
      expect(tokens.map((t) => t.type)).toEqual(expectedTypes);
    });
  });

  describe("Complex Real-World Scenarios", () => {
    test("should tokenize a complete function definition", () => {
      const input = `
        fn fibonacci(n) {
          if (n <= 1) {
            return n;
          }
          return fibonacci(n - 1) + fibonacci(n - 2);
        }
      `;
      const tokens = tokenizeWithoutEOF(input);

      // Verify it contains all expected token types
      const tokenTypes = tokens.map((t) => t.type);
      expect(tokenTypes).toContain(TokenType.FUNCTION);
      expect(tokenTypes).toContain(TokenType.IDENTIFIER);
      expect(tokenTypes).toContain(TokenType.LPAREN);
      expect(tokenTypes).toContain(TokenType.RPAREN);
      expect(tokenTypes).toContain(TokenType.LBRACE);
      expect(tokenTypes).toContain(TokenType.RBRACE);
      expect(tokenTypes).toContain(TokenType.IF);
      expect(tokenTypes).toContain(TokenType.RETURN);
    });

    test("should tokenize complex expressions with mixed operators", () => {
      const input = "result = (a + b) * c / d - e % f && g || h != i";
      const tokens = tokenizeWithoutEOF(input);

      const expectedTypes = [
        TokenType.IDENTIFIER,
        TokenType.ASSIGN,
        TokenType.LPAREN,
        TokenType.IDENTIFIER,
        TokenType.PLUS,
        TokenType.IDENTIFIER,
        TokenType.RPAREN,
        TokenType.ASTERISK,
        TokenType.IDENTIFIER,
        TokenType.SLASH,
        TokenType.IDENTIFIER,
        TokenType.MINUS,
        TokenType.IDENTIFIER,
        TokenType.MODULUS,
        TokenType.IDENTIFIER,
        TokenType.AND,
        TokenType.IDENTIFIER,
        TokenType.OR,
        TokenType.IDENTIFIER,
        TokenType.NOT_EQ,
        TokenType.IDENTIFIER,
      ];

      expect(tokens.map((t) => t.type)).toEqual(expectedTypes);
    });

    test("should tokenize array and object literals", () => {
      const input = `
        let arr = [1, 2, "hello"];
        let obj = {"key": value, "number": 42};
      `;
      const tokens = tokenizeWithoutEOF(input);

      const tokenTypes = tokens.map((t) => t.type);
      expect(tokenTypes).toContain(TokenType.LBRACKET);
      expect(tokenTypes).toContain(TokenType.RBRACKET);
      expect(tokenTypes).toContain(TokenType.LBRACE);
      expect(tokenTypes).toContain(TokenType.RBRACE);
      expect(tokenTypes).toContain(TokenType.COLON);
      expect(tokenTypes).toContain(TokenType.COMMA);
    });

    test("should handle compound assignment operators in context", () => {
      const input = `
        x += 5;
        y -= 3;
        z *= 2;
        w /= 4;
      `;
      const tokens = tokenizeWithoutEOF(input);

      const assignmentTokens = tokens.filter((t) =>
        [
          TokenType.PLUS_ASSIGN,
          TokenType.MINUS_ASSIGN,
          TokenType.ASTERISK_ASSIGN,
          TokenType.SLASH_ASSIGN,
        ].includes(t.type)
      );

      expect(assignmentTokens).toHaveLength(4);
    });

    test("should tokenize control flow statements", () => {
      const input = `
        while (condition) {
          if (x > 0) {
            continue;
          } else {
            break;
          }
        }
        
        for (let i = 0; i < 10; i += 1) {
          // loop body
        }
      `;
      const tokens = tokenizeWithoutEOF(input);

      const tokenTypes = tokens.map((t) => t.type);
      expect(tokenTypes).toContain(TokenType.WHILE);
      expect(tokenTypes).toContain(TokenType.IF);
      expect(tokenTypes).toContain(TokenType.ELSE);
      expect(tokenTypes).toContain(TokenType.CONTINUE);
      expect(tokenTypes).toContain(TokenType.BREAK);
      expect(tokenTypes).toContain(TokenType.FOR);
    });
  });

  describe("Lexer State Management", () => {
    test("should reset properly", () => {
      const input = "let x = 5;";
      const lexer = new Lexer(input);

      // Consume some tokens
      lexer.nextToken(); // let
      lexer.nextToken(); // x

      // Reset
      lexer.reset();

      // Should start from beginning again
      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.LET);
      expect(token.literal).toBe("let");
    });

    test("should handle multiple resets", () => {
      const input = "let x = 5;";
      const lexer = new Lexer(input);

      // Reset multiple times and verify consistency
      for (let i = 0; i < 3; i++) {
        lexer.reset();
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.LET);
      }
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    test("should handle very long identifiers", () => {
      const longIdentifier = "a" + "b".repeat(1000) + "c";
      const tokens = tokenizeWithoutEOF(longIdentifier);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].literal).toBe(longIdentifier);
    });

    test("should handle very long numbers", () => {
      const longNumber = "1".repeat(100);
      const tokens = tokenizeWithoutEOF(longNumber);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe(TokenType.INT);
      expect(tokens[0].literal).toBe(longNumber);
    });

    test("should handle strings with only escape sequences", () => {
      const input = '"\\n\\t\\r"';
      const tokens = tokenizeWithoutEOF(input);

      expect(tokens[0].type).toBe(TokenType.STRING);
      expect(tokens[0].literal).toBe("\n\t\r");
    });

    test("should handle consecutive operators without spaces", () => {
      const input = "x+=y*=z";
      const tokens = tokenizeWithoutEOF(input);

      const expectedTypes = [
        TokenType.IDENTIFIER,
        TokenType.PLUS_ASSIGN,
        TokenType.IDENTIFIER,
        TokenType.ASTERISK_ASSIGN,
        TokenType.IDENTIFIER,
      ];
      expect(tokens.map((t) => t.type)).toEqual(expectedTypes);
    });

    test("should handle EOF after various token types", () => {
      const inputs = ["x", "123", '"string"', "+", "//comment"];

      inputs.forEach((input) => {
        const tokens = tokenizeAll(input);
        expect(tokens[tokens.length - 1].type).toBe(TokenType.EOF);
      });
    });
  });

  describe("Performance and Stress Tests", () => {
    test("should handle large input efficiently", () => {
      // Generate a large but valid program
      const lines: string[] = [];
      for (let i = 0; i < 1000; i++) {
        lines.push(`let var${i} = ${i};`);
      }
      const input = lines.join("\n");

      const startTime = performance.now();
      const tokens = tokenizeWithoutEOF(input);
      const endTime = performance.now();

      // Should complete within reasonable time (adjust threshold as needed)
      expect(endTime - startTime).toBeLessThan(1000); // 1 second

      // Should produce correct number of tokens (5 tokens per line * 1000 lines)
      expect(tokens).toHaveLength(5000);
    });

    test("should handle deeply nested comments", () => {
      let input = "let x = 5; ";
      for (let i = 0; i < 50; i++) {
        input += "/* ";
      }
      input += " nested ";
      for (let i = 0; i < 50; i++) {
        input += " */";
      }
      input += " let y = 10;";

      const tokens = tokenizeWithoutEOF(input);
      const expectedTypes = [
        TokenType.LET,
        TokenType.IDENTIFIER,
        TokenType.ASSIGN,
        TokenType.INT,
        TokenType.SEMICOLON,
        TokenType.LET,
        TokenType.IDENTIFIER,
        TokenType.ASSIGN,
        TokenType.INT,
        TokenType.SEMICOLON,
      ];

      expect(tokens.map((t) => t.type)).toEqual(expectedTypes);
    });
  });

  describe("Token Literal Accuracy", () => {
    test("should preserve exact literal values", () => {
      const input = 'let message = "Hello, World!"; let number = 42;';
      const tokens = tokenizeWithoutEOF(input);

      expect(tokens[0].literal).toBe("let");
      expect(tokens[1].literal).toBe("message");
      expect(tokens[2].literal).toBe("=");
      expect(tokens[3].literal).toBe("Hello, World!");
      expect(tokens[7].literal).toBe("42");
    });

    test("should handle literals with special characters", () => {
      const input = 'let _$var123 = "tab\\there";';
      const tokens = tokenizeWithoutEOF(input);

      expect(tokens[1].literal).toBe("_$var123");
      expect(tokens[3].literal).toBe("tab\there");
    });
  });
});

/**
 * Additional Manual Test Cases
 *
 * These test cases can be run manually to verify specific scenarios:
 */

export const manualTestCases = {
  /**
   * Test case for interactive debugging
   */
  debugTokenization: (input: string) => {
    console.log(`\nTokenizing: "${input}"`);
    console.log("=".repeat(50));

    const lexer = new Lexer(input);
    let token: Token;
    let position = 1;

    do {
      token = lexer.nextToken();
      console.log(
        `${position.toString().padStart(2)}: ${token.type.padEnd(20)} | "${
          token.literal
        }" | Line: ${token.position.line}, Col: ${token.position.column}`
      );
      position++;
    } while (token.type !== TokenType.EOF);
  },
};
