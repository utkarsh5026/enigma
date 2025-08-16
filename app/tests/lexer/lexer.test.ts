import Lexer from "../../src/lang/lexer/lexer";
import { TokenType } from "../../src/lang/token/token";

describe("Lexer", () => {
  describe("Basic Token Types", () => {
    test("should tokenize single character operators", () => {
      const input = "=+(){},;";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.ASSIGN, literal: "=" },
        { type: TokenType.PLUS, literal: "+" },
        { type: TokenType.LPAREN, literal: "(" },
        { type: TokenType.RPAREN, literal: ")" },
        { type: TokenType.LBRACE, literal: "{" },
        { type: TokenType.RBRACE, literal: "}" },
        { type: TokenType.COMMA, literal: "," },
        { type: TokenType.SEMICOLON, literal: ";" },
        { type: TokenType.EOF, literal: "" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should tokenize arithmetic operators", () => {
      const input = "+-*/%";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.PLUS, literal: "+" },
        { type: TokenType.MINUS, literal: "-" },
        { type: TokenType.ASTERISK, literal: "*" },
        { type: TokenType.SLASH, literal: "/" },
        { type: TokenType.MODULUS, literal: "%" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should tokenize comparison operators", () => {
      const input = "< > <= >=";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.LESS_THAN, literal: "<" },
        { type: TokenType.GREATER_THAN, literal: ">" },
        { type: TokenType.LESS_THAN_OR_EQUAL, literal: "<=" },
        { type: TokenType.GREATER_THAN_OR_EQUAL, literal: ">=" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should tokenize equality operators", () => {
      const input = "== !=";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.EQ, literal: "==" },
        { type: TokenType.NOT_EQ, literal: "!=" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should tokenize logical operators", () => {
      const input = "&& ||";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.AND, literal: "&&" },
        { type: TokenType.OR, literal: "||" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should tokenize bitwise operators", () => {
      const input = "& | ^ ~";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.BITWISE_AND, literal: "&" },
        { type: TokenType.BITWISE_OR, literal: "|" },
        { type: TokenType.BITWISE_XOR, literal: "^" },
        { type: TokenType.BITWISE_NOT, literal: "~" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should tokenize assignment operators", () => {
      const input = "+= -= *= /=";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.PLUS_ASSIGN, literal: "+=" },
        { type: TokenType.MINUS_ASSIGN, literal: "-=" },
        { type: TokenType.ASTERISK_ASSIGN, literal: "*=" },
        { type: TokenType.SLASH_ASSIGN, literal: "/=" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should tokenize brackets and delimiters", () => {
      const input = "[]{}():.,";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.LBRACKET, literal: "[" },
        { type: TokenType.RBRACKET, literal: "]" },
        { type: TokenType.LBRACE, literal: "{" },
        { type: TokenType.RBRACE, literal: "}" },
        { type: TokenType.LPAREN, literal: "(" },
        { type: TokenType.RPAREN, literal: ")" },
        { type: TokenType.COLON, literal: ":" },
        { type: TokenType.DOT, literal: "." },
        { type: TokenType.COMMA, literal: "," },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should tokenize integer division operator", () => {
      const input = "//";
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.INTEGER_DIVISION);
      expect(token.literal).toBe("//");
    });
  });

  describe("Keywords", () => {
    test("should tokenize all language keywords", () => {
      const input =
        "fn let true false if elif else return while break continue for const class extends super this new null";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.FUNCTION, literal: "fn" },
        { type: TokenType.LET, literal: "let" },
        { type: TokenType.TRUE, literal: "true" },
        { type: TokenType.FALSE, literal: "false" },
        { type: TokenType.IF, literal: "if" },
        { type: TokenType.ELIF, literal: "elif" },
        { type: TokenType.ELSE, literal: "else" },
        { type: TokenType.RETURN, literal: "return" },
        { type: TokenType.WHILE, literal: "while" },
        { type: TokenType.BREAK, literal: "break" },
        { type: TokenType.CONTINUE, literal: "continue" },
        { type: TokenType.FOR, literal: "for" },
        { type: TokenType.CONST, literal: "const" },
        { type: TokenType.CLASS, literal: "class" },
        { type: TokenType.EXTENDS, literal: "extends" },
        { type: TokenType.SUPER, literal: "super" },
        { type: TokenType.THIS, literal: "this" },
        { type: TokenType.NEW, literal: "new" },
        { type: TokenType.NULL, literal: "null" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });
  });

  describe("Identifiers", () => {
    test("should tokenize valid identifiers", () => {
      const input = "variable _private myFunction myVariable123 _test";
      const lexer = new Lexer(input);

      const expectedIdentifiers = [
        "variable",
        "_private",
        "myFunction",
        "myVariable123",
        "_test",
      ];

      expectedIdentifiers.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.IDENTIFIER);
        expect(token.literal).toBe(expected);
      });
    });

    test("should distinguish keywords from identifiers", () => {
      const input = "letVar function returnValue";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.IDENTIFIER, literal: "letVar" },
        { type: TokenType.IDENTIFIER, literal: "function" },
        { type: TokenType.IDENTIFIER, literal: "returnValue" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });
  });

  describe("Numbers", () => {
    test("should tokenize integers", () => {
      const input = "0 123 456789";
      const lexer = new Lexer(input);

      const expectedNumbers = ["0", "123", "456789"];

      expectedNumbers.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.INT);
        expect(token.literal).toBe(expected);
      });
    });

    test("should tokenize floating point numbers", () => {
      const input = "3.14 0.5 123.456 999.0";
      const lexer = new Lexer(input);

      const expectedNumbers = ["3.14", "0.5", "123.456", "999.0"];

      expectedNumbers.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.FLOAT);
        expect(token.literal).toBe(expected);
      });
    });

    test("should handle dot followed by digits as separate tokens", () => {
      const input = ".5 .123 .0";
      const lexer = new Lexer(input);

      // .5 should be tokenized as DOT then INT
      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.DOT);
      expect(token1.literal).toBe(".");

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.INT);
      expect(token2.literal).toBe("5");

      // .123 should be tokenized as DOT then INT
      const token3 = lexer.nextToken();
      expect(token3.type).toBe(TokenType.DOT);
      expect(token3.literal).toBe(".");

      const token4 = lexer.nextToken();
      expect(token4.type).toBe(TokenType.INT);
      expect(token4.literal).toBe("123");

      // .0 should be tokenized as DOT then INT
      const token5 = lexer.nextToken();
      expect(token5.type).toBe(TokenType.DOT);
      expect(token5.literal).toBe(".");

      const token6 = lexer.nextToken();
      expect(token6.type).toBe(TokenType.INT);
      expect(token6.literal).toBe("0");
    });

    test("should handle dot operator separate from decimal numbers", () => {
      const input = "obj.method";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.IDENTIFIER, literal: "obj" },
        { type: TokenType.DOT, literal: "." },
        { type: TokenType.IDENTIFIER, literal: "method" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });
  });

  describe("Strings", () => {
    test("should tokenize double-quoted strings", () => {
      const input = '"hello" "world" "test string"';
      const lexer = new Lexer(input);

      const expectedStrings = ["hello", "world", "test string"];

      expectedStrings.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.STRING);
        expect(token.literal).toBe(expected);
      });
    });

    test("should tokenize single-quoted strings", () => {
      const input = "'hello' 'world' 'test string'";
      const lexer = new Lexer(input);

      const expectedStrings = ["hello", "world", "test string"];

      expectedStrings.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.STRING);
        expect(token.literal).toBe(expected);
      });
    });

    test("should handle escape sequences in strings", () => {
      const input = '"hello\\nworld" "tab\\there" "quote\\"test"';
      const lexer = new Lexer(input);

      const expectedStrings = ["hello\nworld", "tab\there", 'quote"test'];

      expectedStrings.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.STRING);
        expect(token.literal).toBe(expected);
      });
    });

    test("should handle various escape sequences", () => {
      const input = '"\\n\\t\\r\\b\\f\\v\\0\\\\"';
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.STRING);
      expect(token.literal).toBe("\n\t\r\b\f\v\0\\");
    });

    test("should handle empty strings", () => {
      const input = "\"\" ''";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.STRING);
      expect(token1.literal).toBe("");

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.STRING);
      expect(token2.literal).toBe("");
    });
  });

  describe("F-Strings", () => {
    test("should tokenize simple f-strings", () => {
      const input = 'f"Hello world"';
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.F_STRING);
      expect(token.literal).toBe("Hello world");
    });

    test("should tokenize f-strings with expressions", () => {
      const input = 'f"Hello {name}, you are {age} years old"';
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.F_STRING);
      expect(token.literal).toBe("Hello {name}, you are {age} years old");
    });

    test("should handle nested braces in f-strings", () => {
      const input = 'f"Result: {func({nested: value})}"';
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.F_STRING);
      expect(token.literal).toBe("Result: {func({nested: value})}");
    });

    test("should handle escape sequences in f-strings", () => {
      const input = 'f"Line1\\nLine2{var}"';
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.F_STRING);
      expect(token.literal).toBe("Line1\nLine2{var}");
    });
  });

  describe("Whitespace Handling", () => {
    test("should skip whitespace characters", () => {
      const input = " \t\n\r+ \t\n\r- \t\n\r";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.PLUS);

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.MINUS);
    });
  });

  describe("Position Tracking", () => {
    test("should track line and column positions", () => {
      const input = "let x = 5\nlet y = 10";
      const lexer = new Lexer(input);

      const letToken = lexer.nextToken();
      expect(letToken.position.line).toBe(1);
      expect(letToken.position.column).toBe(0);

      const xToken = lexer.nextToken();
      expect(xToken.position.line).toBe(1);
      expect(xToken.position.column).toBe(4);

      // Skip = and 5 tokens
      lexer.nextToken(); // =
      lexer.nextToken(); // 5

      const secondLetToken = lexer.nextToken();
      expect(secondLetToken.position.line).toBe(3);
      expect(secondLetToken.position.column).toBe(1);
    });

    test("should handle multi-line strings position tracking", () => {
      const input = '"line1\\nline2"';
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.STRING);
      expect(token.position.line).toBe(1);
      expect(token.position.column).toBe(0);
    });
  });

  describe("Complex Expressions", () => {
    test("should tokenize function definition", () => {
      const input = "fn add(x, y) { return x + y; }";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.FUNCTION, literal: "fn" },
        { type: TokenType.IDENTIFIER, literal: "add" },
        { type: TokenType.LPAREN, literal: "(" },
        { type: TokenType.IDENTIFIER, literal: "x" },
        { type: TokenType.COMMA, literal: "," },
        { type: TokenType.IDENTIFIER, literal: "y" },
        { type: TokenType.RPAREN, literal: ")" },
        { type: TokenType.LBRACE, literal: "{" },
        { type: TokenType.RETURN, literal: "return" },
        { type: TokenType.IDENTIFIER, literal: "x" },
        { type: TokenType.PLUS, literal: "+" },
        { type: TokenType.IDENTIFIER, literal: "y" },
        { type: TokenType.SEMICOLON, literal: ";" },
        { type: TokenType.RBRACE, literal: "}" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should tokenize array literal", () => {
      const input = '[1, 2, 3, "test"]';
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.LBRACKET, literal: "[" },
        { type: TokenType.INT, literal: "1" },
        { type: TokenType.COMMA, literal: "," },
        { type: TokenType.INT, literal: "2" },
        { type: TokenType.COMMA, literal: "," },
        { type: TokenType.INT, literal: "3" },
        { type: TokenType.COMMA, literal: "," },
        { type: TokenType.STRING, literal: "test" },
        { type: TokenType.RBRACKET, literal: "]" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should tokenize object literal", () => {
      const input = '{ name: "John", age: 30 }';
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.LBRACE, literal: "{" },
        { type: TokenType.IDENTIFIER, literal: "name" },
        { type: TokenType.COLON, literal: ":" },
        { type: TokenType.STRING, literal: "John" },
        { type: TokenType.COMMA, literal: "," },
        { type: TokenType.IDENTIFIER, literal: "age" },
        { type: TokenType.COLON, literal: ":" },
        { type: TokenType.INT, literal: "30" },
        { type: TokenType.RBRACE, literal: "}" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should tokenize class definition", () => {
      const input = "class Person extends Human { }";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.CLASS, literal: "class" },
        { type: TokenType.IDENTIFIER, literal: "Person" },
        { type: TokenType.EXTENDS, literal: "extends" },
        { type: TokenType.IDENTIFIER, literal: "Human" },
        { type: TokenType.LBRACE, literal: "{" },
        { type: TokenType.RBRACE, literal: "}" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });
  });

  describe("Lexer State Management", () => {
    test("should reset lexer state", () => {
      const input = "let x = 5";
      const lexer = new Lexer(input);

      // Read some tokens
      lexer.nextToken(); // let
      lexer.nextToken(); // x

      // Reset lexer
      lexer.reset();

      // Should start from beginning again
      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.LET);
      expect(token.literal).toBe("let");
    });

    test("should handle EOF correctly", () => {
      const input = "x";
      const lexer = new Lexer(input);

      const token1 = lexer.nextToken();
      expect(token1.type).toBe(TokenType.IDENTIFIER);

      const token2 = lexer.nextToken();
      expect(token2.type).toBe(TokenType.EOF);
      expect(token2.literal).toBe("");

      // Subsequent calls should continue returning EOF
      const token3 = lexer.nextToken();
      expect(token3.type).toBe(TokenType.EOF);
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty input", () => {
      const input = "";
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.EOF);
      expect(token.literal).toBe("");
    });

    test("should handle input with only whitespace", () => {
      const input = "   \t\n\r   ";
      const lexer = new Lexer(input);

      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.EOF);
    });

    test("should handle illegal characters", () => {
      const input = "@$%";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.ILLEGAL, literal: "@" },
        { type: TokenType.ILLEGAL, literal: "$" },
        { type: TokenType.MODULUS, literal: "%" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });

    test("should handle mixed valid and invalid characters", () => {
      const input = "x @ y";
      const lexer = new Lexer(input);

      const expectedTokens = [
        { type: TokenType.IDENTIFIER, literal: "x" },
        { type: TokenType.ILLEGAL, literal: "@" },
        { type: TokenType.IDENTIFIER, literal: "y" },
      ];

      expectedTokens.forEach((expected) => {
        const token = lexer.nextToken();
        expect(token.type).toBe(expected.type);
        expect(token.literal).toBe(expected.literal);
      });
    });
  });
});
