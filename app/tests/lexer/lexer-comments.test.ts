import Lexer from "../../src/lang/lexer/lexer";
import { TokenType } from "../../src/lang/token/token";

describe("Lexer Comment Handling", () => {
  describe("Single Line Comments", () => {
    test("should skip single line comments with #", () => {
      const input = "# This is a comment\nlet x = 5";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.IDENTIFIER);
      expect(token2.literal).toBe("x");
    });

    test("should skip inline single line comments", () => {
      const input = "let x = 5 # inline comment";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.LET, literal: "let" },
        { type: TokenType.IDENTIFIER, literal: "x" },
        { type: TokenType.ASSIGN, literal: "=" },
        { type: TokenType.INT, literal: "5" },
        { type: TokenType.EOF, literal: "" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should handle multiple consecutive single line comments", () => {
      const input = `# Comment 1
# Comment 2
# Comment 3
let x = 5`;
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });

    test("should handle single line comment at end of file", () => {
      const input = "let x = 5 # final comment";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.LET, literal: "let" },
        { type: TokenType.IDENTIFIER, literal: "x" },
        { type: TokenType.ASSIGN, literal: "=" },
        { type: TokenType.INT, literal: "5" },
        { type: TokenType.EOF, literal: "" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should handle empty single line comment", () => {
      const input = "#\nlet x = 5";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });

    test("should handle single line comment with special characters", () => {
      const input =
        "# Comment with special chars: !@#$%^&*()_+-={}[]|\\:\";'<>?,./ \nlet x = 5";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });
  });

  describe("Multi-Line Comments", () => {
    test("should skip basic multi-line comments", () => {
      const input = `/* This is a 
multi-line comment */
let x = 5`;
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.IDENTIFIER);
      expect(token2.literal).toBe("x");
    });

    test("should skip inline multi-line comments", () => {
      const input = "let x = /* comment */ 5";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.LET, literal: "let" },
        { type: TokenType.IDENTIFIER, literal: "x" },
        { type: TokenType.ASSIGN, literal: "=" },
        { type: TokenType.INT, literal: "5" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should handle nested multi-line comments", () => {
      const input = `/* Outer comment
/* Inner comment */
Still in outer comment */
let x = 5`;
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });

    test("should handle deeply nested multi-line comments", () => {
      const input = `/* Level 1 /* Level 2 /* Level 3 */ Level 2 */ Level 1 */
let x = 5`;
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });

    test("should handle multiple separate multi-line comments", () => {
      const input = `/* Comment 1 */
/* Comment 2 */
let x = 5`;
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });

    test("should handle empty multi-line comment", () => {
      const input = "/**/ let x = 5";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });

    test("should handle multi-line comment with special characters", () => {
      const input = `/* Comment with special chars: 
!@#$%^&*()_+-={}[]|\\:";'<>?,./
*/
let x = 5`;
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });

    test("should handle unclosed multi-line comment gracefully", () => {
      const input = "/* This comment is not closed\nlet x = 5";
      const lexer = new Lexer(input);

      // Should reach EOF without finding closing comment
      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.EOF);
    });

    test("should handle unclosed nested multi-line comment", () => {
      const input =
        "/* Outer /* Inner comment */ but outer not closed\nlet x = 5";
      const lexer = new Lexer(input);

      // Should reach EOF since outer comment is not closed
      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.EOF);
    });
  });

  describe("Mixed Comment Types", () => {
    test("should handle single line comment inside multi-line comment", () => {
      const input = `/* Multi-line comment
# This single line comment is inside
Still in multi-line */
let x = 5`;
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });

    test("should handle both comment types in sequence", () => {
      const input = `# Single line comment
/* Multi-line comment */
# Another single line
let x = 5`;
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });

    test("should handle comments between tokens", () => {
      const input = `let /* comment */ x /* comment */ = /* comment */ 5 # final comment`;
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.LET, literal: "let" },
        { type: TokenType.IDENTIFIER, literal: "x" },
        { type: TokenType.ASSIGN, literal: "=" },
        { type: TokenType.INT, literal: "5" },
        { type: TokenType.EOF, literal: "" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });
  });

  describe("Comments with Code-like Content", () => {
    test("should ignore code syntax in single line comments", () => {
      const input = `# let fake = "not real code";
let x = 5`;
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });

    test("should ignore code syntax in multi-line comments", () => {
      const input = `/* 
fn fake() {
  return "not real";
}
*/
let x = 5`;
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });

    test("should ignore string literals in comments", () => {
      const input = `# "This string is in a comment"
/* "This one too" */
let x = "real string"`;
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.LET, literal: "let" },
        { type: TokenType.IDENTIFIER, literal: "x" },
        { type: TokenType.ASSIGN, literal: "=" },
        { type: TokenType.STRING, literal: "real string" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should ignore operators in comments", () => {
      const input = `# + - * / == != && ||
/* += -= *= /= <= >= */
let x = 5`;
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });
  });

  describe("Comments and Position Tracking", () => {
    test("should correctly track line numbers across comments", () => {
      const input = `# Line 1 comment
let x = 5
/* Multi-line comment
   Line 4
*/
let y = 10`;
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.position.line).toBe(2);

      // Skip x, =, 5
      lexer.nextToken();
      lexer.nextToken();
      lexer.nextToken();

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.LET);
      expect(token2.position.line).toBe(7);
    });

    test("should handle comments with various line endings", () => {
      const input =
        "# Comment with \\r\\n\r\nlet x = 5\n# Comment with \\n\nlet y = 10";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");

      // Skip x, =, 5
      lexer.nextToken();
      lexer.nextToken();
      lexer.nextToken();

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.LET);
      expect(token2.literal).toBe("let");
    });
  });

  describe("Edge Cases with Comments", () => {
    test("should handle comment-like sequences in strings", () => {
      const input = 'let x = "This # is not a comment"';
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.LET, literal: "let" },
        { type: TokenType.IDENTIFIER, literal: "x" },
        { type: TokenType.ASSIGN, literal: "=" },
        { type: TokenType.STRING, literal: "This # is not a comment" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should handle multi-line comment markers in strings", () => {
      const input = 'let x = "/* not a comment */"';
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.LET, literal: "let" },
        { type: TokenType.IDENTIFIER, literal: "x" },
        { type: TokenType.ASSIGN, literal: "=" },
        { type: TokenType.STRING, literal: "/* not a comment */" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should handle division operator vs comment start", () => {
      const input = "x / y /* real comment */";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.IDENTIFIER, literal: "x" },
        { type: TokenType.SLASH, literal: "/" },
        { type: TokenType.IDENTIFIER, literal: "y" },
        { type: TokenType.EOF, literal: "" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should handle only comments in input", () => {
      const input = `# Just comments
/* Nothing but
   comments here */
# More comments`;
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.EOF);
    });

    test("should handle alternating code and comments", () => {
      const input = `let # comment
x # comment
= # comment
5 # comment`;
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.LET, literal: "let" },
        { type: TokenType.IDENTIFIER, literal: "x" },
        { type: TokenType.ASSIGN, literal: "=" },
        { type: TokenType.INT, literal: "5" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });
  });

  describe("Comment Boundary Cases", () => {
    test("should handle comment at very start of input", () => {
      const input = "# First character is comment\nlet x = 5";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });

    test("should handle comment at very end of input", () => {
      const input = "let x = 5 # Last characters";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.LET, literal: "let" },
        { type: TokenType.IDENTIFIER, literal: "x" },
        { type: TokenType.ASSIGN, literal: "=" },
        { type: TokenType.INT, literal: "5" },
        { type: TokenType.EOF, literal: "" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should handle very long comments", () => {
      const longComment = "x".repeat(10000);
      const input = `# ${longComment}\nlet x = 5`;
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.LET);
      expect(token1.literal).toBe("let");
    });
  });
});
