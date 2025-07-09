import { describe, it, expect, beforeEach } from "@jest/globals";
import Lexer from "../src/lang/lexer/lexer";
import { EnigmaParser } from "../src/lang/parser";
import {
  TokenStream,
  ErrorReporter,
  PrecedenceTable,
  Precedence,
  ParsingContext,
  Parser,
} from "../src/lang/parser/core";
import { ExpressionParser } from "../src/lang/parser/expression-parser";

import {
  LetStatementParser,
  ConstStatementParser,
  ReturnStatementParser,
  WhileStatementParser,
  ForStatementParser,
  BreakStatementParser,
  ContinueStatementParser,
  BlockStatementParser,
  ExpressionStatementParser,
  StatementParserRegistry,
} from "../src/lang/parser/statements";
import * as ast from "../src/lang/ast/ast";
import * as statements from "../src/lang/ast/statement";
import * as expressions from "../src/lang/ast/expression";
import * as literals from "../src/lang/ast/literal";
import { TokenType } from "../src/lang/token/token";

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Helper to create parsing context from source code
 */
function createContext(sourceCode: string): ParsingContext {
  const lexer = new Lexer(sourceCode);
  return new ParsingContext(lexer);
}

/**
 * Helper to parse and get first statement
 */
function parseFirstStatement<T extends ast.Statement>(
  sourceCode: string,
  parser: Parser<T>
): T | null {
  const context = createContext(sourceCode);
  return parser.parse(context) as T;
}

/**
 * Helper to assert parsing success
 */
function assertParseSuccess<T extends ast.Statement>(
  sourceCode: string,
  expectedType: new (...args: any[]) => T
): T {
  const parser = new EnigmaParser(new Lexer(sourceCode));
  const result = parser.parseProgram();
  const errors = parser.getErrors();

  expect(errors).toHaveLength(0);
  expect(result).toBeInstanceOf(expectedType);
  return result as T;
}

/**
 * Helper to assert parsing failure
 */
function assertParseFailure(
  sourceCode: string,
  expectedErrorContains?: string
): void {
  const context = createContext(sourceCode);
  const parser = new EnigmaParser(new Lexer(sourceCode));
  const result = parser.parseProgram();
  const errors = context.errors.getErrors();

  expect(errors.length).toBeGreaterThan(0);
  if (expectedErrorContains) {
    expect(
      errors.some((err) => err.message.includes(expectedErrorContains))
    ).toBe(true);
  }
  expect(result).toBeNull();
}

// ============================================================================
// CORE INFRASTRUCTURE TESTS
// ============================================================================

describe("TokenStream", () => {
  it("should correctly navigate tokens", () => {
    const lexer = new Lexer("let x = 5;");
    const stream = new TokenStream(lexer);

    expect(stream.getCurrentToken().type).toBe(TokenType.LET);
    expect(stream.getPeekToken().type).toBe(TokenType.IDENTIFIER);

    stream.advance();
    expect(stream.getCurrentToken().type).toBe(TokenType.IDENTIFIER);
    expect(stream.getCurrentToken().literal).toBe("x");

    stream.advance();
    expect(stream.getCurrentToken().type).toBe(TokenType.ASSIGN);
  });

  it("should handle expect() correctly", () => {
    const lexer = new Lexer("let x = 5;");
    const stream = new TokenStream(lexer);

    // Current: LET, Peek: IDENTIFIER
    expect(stream.expect(TokenType.IDENTIFIER)).toBe(true);
    expect(stream.getCurrentToken().type).toBe(TokenType.IDENTIFIER);

    // Current: IDENTIFIER, Peek: ASSIGN
    expect(stream.expect(TokenType.ASSIGN)).toBe(true);
    expect(stream.getCurrentToken().type).toBe(TokenType.ASSIGN);

    // Current: ASSIGN, Peek: INT
    expect(stream.expect(TokenType.STRING)).toBe(false);
    expect(stream.getCurrentToken().type).toBe(TokenType.ASSIGN);
  });

  it("should handle EOF correctly", () => {
    const lexer = new Lexer("");
    const stream = new TokenStream(lexer);

    expect(stream.getCurrentToken().type).toBe(TokenType.EOF);
    expect(stream.getPeekToken().type).toBe(TokenType.EOF);
  });
});

describe("ErrorReporter", () => {
  let reporter: ErrorReporter;

  beforeEach(() => {
    reporter = new ErrorReporter();
  });

  it("should collect errors correctly", () => {
    const token = {
      type: TokenType.LET,
      literal: "let",
      position: { line: 1, column: 1 },
    };

    reporter.addError("Test error", token);
    reporter.addTokenError(TokenType.IDENTIFIER, token);

    const errors = reporter.getErrors();
    expect(errors).toHaveLength(2);
    expect(errors[0].message).toBe("Test error");
    expect(errors[1].message).toBe("Expected IDENTIFIER, got LET");
  });

  it("should handle multiple errors", () => {
    const token1 = {
      type: TokenType.LET,
      literal: "let",
      position: { line: 1, column: 1 },
    };
    const token2 = {
      type: TokenType.ASSIGN,
      literal: "=",
      position: { line: 1, column: 5 },
    };

    reporter.addError("First error", token1);
    reporter.addError("Second error", token2);

    expect(reporter.getErrors()).toHaveLength(2);
    expect(reporter.hasErrors()).toBe(true);
  });

  it("should clear errors correctly", () => {
    const token = {
      type: TokenType.LET,
      literal: "let",
      position: { line: 1, column: 1 },
    };

    reporter.addError("Test error", token);
    expect(reporter.hasErrors()).toBe(true);

    reporter.clear();
    expect(reporter.hasErrors()).toBe(false);
    expect(reporter.getErrors()).toHaveLength(0);
  });
});

describe("PrecedenceTable", () => {
  let table: PrecedenceTable;

  beforeEach(() => {
    table = new PrecedenceTable();
  });

  it("should return correct precedence for operators", () => {
    expect(table.getPrecedence(TokenType.PLUS)).toBe(Precedence.SUM);
    expect(table.getPrecedence(TokenType.ASTERISK)).toBe(Precedence.PRODUCT);
    expect(table.getPrecedence(TokenType.EQ)).toBe(Precedence.EQUALS);
    expect(table.getPrecedence(TokenType.AND)).toBe(Precedence.LOGICAL_AND);
    expect(table.getPrecedence(TokenType.OR)).toBe(Precedence.LOGICAL_OR);
  });

  it("should return LOWEST precedence for unknown tokens", () => {
    expect(table.getPrecedence(TokenType.IDENTIFIER)).toBe(Precedence.LOWEST);
    expect(table.getPrecedence(TokenType.INT)).toBe(Precedence.LOWEST);
  });

  it("should allow setting custom precedence", () => {
    table.setPrecedence(TokenType.IDENTIFIER, Precedence.CALL);
    expect(table.getPrecedence(TokenType.IDENTIFIER)).toBe(Precedence.CALL);
  });
});

describe("ParsingContext", () => {
  it("should manage loop depth correctly", () => {
    const context = createContext("while (true) { break; }");

    expect(context.isInLoop()).toBe(false);
    expect(context.loopDepth).toBe(0);

    context.enterLoop();
    expect(context.isInLoop()).toBe(true);
    expect(context.loopDepth).toBe(1);

    context.enterLoop();
    expect(context.loopDepth).toBe(2);

    context.exitLoop();
    expect(context.loopDepth).toBe(1);
    expect(context.isInLoop()).toBe(true);

    context.exitLoop();
    expect(context.loopDepth).toBe(0);
    expect(context.isInLoop()).toBe(false);
  });
});

// ============================================================================
// EXPRESSION PARSER TESTS
// ============================================================================

describe("ExpressionParser", () => {
  let parser: ExpressionParser;

  beforeEach(() => {
    parser = new ExpressionParser(parseFirstStatement.bind(this));
  });

  describe("Function Call Expressions", () => {
    it("should parse function calls with no arguments", () => {
      const context = createContext("foo()");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(expressions.CallExpression);
      const callExpr = result as expressions.CallExpression;
      expect(callExpr.func).toBeInstanceOf(ast.Identifier);
      expect((callExpr.func as ast.Identifier).value).toBe("foo");
      expect(callExpr.args).toHaveLength(0);
    });

    it("should parse function calls with arguments", () => {
      const context = createContext("add(1, 2, 3)");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(expressions.CallExpression);
      const callExpr = result as expressions.CallExpression;
      expect(callExpr.args).toHaveLength(3);
      expect(callExpr.args[0]).toBeInstanceOf(literals.IntegerLiteral);
      expect(callExpr.args[1]).toBeInstanceOf(literals.IntegerLiteral);
      expect(callExpr.args[2]).toBeInstanceOf(literals.IntegerLiteral);
    });

    it("should parse nested function calls", () => {
      const context = createContext("add(mul(2, 3), 4)");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(expressions.CallExpression);
      const outerCall = result as expressions.CallExpression;
      expect(outerCall.args).toHaveLength(2);
      expect(outerCall.args[0]).toBeInstanceOf(expressions.CallExpression);

      const innerCall = outerCall.args[0] as expressions.CallExpression;
      expect((innerCall.func as ast.Identifier).value).toBe("mul");
      expect(innerCall.args).toHaveLength(2);
    });

    it("should handle function call precedence", () => {
      const context = createContext("foo() + bar()");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(expressions.InfixExpression);
      const infixExpr = result as expressions.InfixExpression;
      expect(infixExpr.left).toBeInstanceOf(expressions.CallExpression);
      expect(infixExpr.right).toBeInstanceOf(expressions.CallExpression);
    });

    it("should handle malformed function calls", () => {
      const context = createContext("foo(");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeNull();
      expect(context.errors.getErrors().length).toBeGreaterThan(0);
    });
  });

  describe("Index Expressions", () => {
    it("should parse array indexing", () => {
      const context = createContext("arr[0]");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(expressions.IndexExpression);
      const indexExpr = result as expressions.IndexExpression;
      expect(indexExpr.left).toBeInstanceOf(ast.Identifier);
      expect((indexExpr.left as ast.Identifier).value).toBe("arr");
      expect(indexExpr.index).toBeInstanceOf(literals.IntegerLiteral);
      expect((indexExpr.index as literals.IntegerLiteral).value).toBe(0);
    });

    it("should parse hash indexing", () => {
      const context = createContext('hash["key"]');
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(expressions.IndexExpression);
      const indexExpr = result as expressions.IndexExpression;
      expect(indexExpr.index).toBeInstanceOf(literals.StringLiteral);
      expect((indexExpr.index as literals.StringLiteral).value).toBe("key");
    });

    it("should parse nested indexing", () => {
      const context = createContext("arr[0][1]");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(expressions.IndexExpression);
      const outerIndex = result as expressions.IndexExpression;
      expect(outerIndex.left).toBeInstanceOf(expressions.IndexExpression);

      const innerIndex = outerIndex.left as expressions.IndexExpression;
      expect(innerIndex.left).toBeInstanceOf(ast.Identifier);
      expect((innerIndex.left as ast.Identifier).value).toBe("arr");
    });

    it("should handle index expression with complex expressions", () => {
      const context = createContext("arr[x + 1]");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(expressions.IndexExpression);
      const indexExpr = result as expressions.IndexExpression;
      expect(indexExpr.index).toBeInstanceOf(expressions.InfixExpression);
    });

    it("should handle malformed index expressions", () => {
      const context = createContext("arr[");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeNull();
      expect(context.errors.getErrors().length).toBeGreaterThan(0);
    });
  });

  describe("Array Literals", () => {
    it("should parse empty arrays", () => {
      const context = createContext("[]");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(literals.ArrayLiteral);
      const arrayLiteral = result as literals.ArrayLiteral;
      expect(arrayLiteral.elements).toHaveLength(0);
    });

    it("should parse arrays with elements", () => {
      const context = createContext("[1, 2, 3]");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(literals.ArrayLiteral);
      const arrayLiteral = result as literals.ArrayLiteral;
      expect(arrayLiteral.elements).toHaveLength(3);
      expect(arrayLiteral.elements[0]).toBeInstanceOf(literals.IntegerLiteral);
      expect(arrayLiteral.elements[1]).toBeInstanceOf(literals.IntegerLiteral);
      expect(arrayLiteral.elements[2]).toBeInstanceOf(literals.IntegerLiteral);
    });

    it("should parse arrays with mixed types", () => {
      const context = createContext('[1, "hello", true]');
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(literals.ArrayLiteral);
      const arrayLiteral = result as literals.ArrayLiteral;
      expect(arrayLiteral.elements).toHaveLength(3);
      expect(arrayLiteral.elements[0]).toBeInstanceOf(literals.IntegerLiteral);
      expect(arrayLiteral.elements[1]).toBeInstanceOf(literals.StringLiteral);
      expect(arrayLiteral.elements[2]).toBeInstanceOf(
        expressions.BooleanExpression
      );
    });

    it("should parse nested arrays", () => {
      const context = createContext("[1, [2, 3], 4]");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(literals.ArrayLiteral);
      const arrayLiteral = result as literals.ArrayLiteral;
      expect(arrayLiteral.elements).toHaveLength(3);
      expect(arrayLiteral.elements[1]).toBeInstanceOf(literals.ArrayLiteral);

      const nestedArray = arrayLiteral.elements[1] as literals.ArrayLiteral;
      expect(nestedArray.elements).toHaveLength(2);
    });

    it("should handle trailing commas", () => {
      const context = createContext("[1, 2,]");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(literals.ArrayLiteral);
      const arrayLiteral = result as literals.ArrayLiteral;
      expect(arrayLiteral.elements).toHaveLength(2);
    });

    it("should handle malformed arrays", () => {
      const context = createContext("[1, 2");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeNull();
      expect(context.errors.getErrors().length).toBeGreaterThan(0);
    });
  });

  describe("Hash Literals", () => {
    it("should parse empty hashes", () => {
      const context = createContext("{}");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(literals.HashLiteral);
      const hashLiteral = result as literals.HashLiteral;
      expect(hashLiteral.pairs.size).toBe(0);
    });

    it("should parse hashes with string keys", () => {
      const context = createContext('{"key": "value"}');
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(literals.HashLiteral);
      const hashLiteral = result as literals.HashLiteral;
      expect(hashLiteral.pairs.size).toBe(1);
    });

    it("should parse hashes with multiple pairs", () => {
      const context = createContext('{"a": 1, "b": 2, "c": 3}');
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(literals.HashLiteral);
      const hashLiteral = result as literals.HashLiteral;
      expect(hashLiteral.pairs.size).toBe(3);
    });

    it("should parse hashes with identifier keys", () => {
      const context = createContext('{key: "value"}');
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(literals.HashLiteral);
      const hashLiteral = result as literals.HashLiteral;
      expect(hashLiteral.pairs.size).toBe(1);
    });

    it("should parse nested hashes", () => {
      const context = createContext('{"outer": {"inner": 42}}');
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(literals.HashLiteral);
      const hashLiteral = result as literals.HashLiteral;
      expect(hashLiteral.pairs.size).toBe(1);
    });

    it("should handle malformed hashes", () => {
      const context = createContext('{"key": ');
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeNull();
      expect(context.errors.getErrors().length).toBeGreaterThan(0);
    });
  });

  describe("Function Literals", () => {
    it("should parse functions with no parameters", () => {
      const context = createContext("fn() { return 42; }");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(literals.FunctionLiteral);
      const funcLiteral = result as literals.FunctionLiteral;
      expect(funcLiteral.parameters).toHaveLength(0);
      expect(funcLiteral.body).toBeInstanceOf(statements.BlockStatement);
    });

    it("should parse functions with parameters", () => {
      const context = createContext("fn(x, y) { return x + y; }");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(literals.FunctionLiteral);
      const funcLiteral = result as literals.FunctionLiteral;
      expect(funcLiteral.parameters).toHaveLength(2);
      expect(funcLiteral.parameters[0].value).toBe("x");
      expect(funcLiteral.parameters[1].value).toBe("y");
    });

    it("should parse functions with single parameter", () => {
      const context = createContext("fn(x) { return x * 2; }");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(literals.FunctionLiteral);
      const funcLiteral = result as literals.FunctionLiteral;
      expect(funcLiteral.parameters).toHaveLength(1);
      expect(funcLiteral.parameters[0].value).toBe("x");
    });

    it("should handle malformed function literals", () => {
      const context = createContext("fn(x { return x; }");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeNull();
      expect(context.errors.getErrors().length).toBeGreaterThan(0);
    });
  });

  describe("If Expressions", () => {
    it("should parse simple if expressions", () => {
      const context = createContext("if (x > 0) { return x; }");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(expressions.IfExpression);
      const ifExpr = result as expressions.IfExpression;
      expect(ifExpr.conditions).toHaveLength(1);
      expect(ifExpr.consequences).toHaveLength(1);
      expect(ifExpr.alternative).toBeNull();
    });

    it("should parse if-else expressions", () => {
      const context = createContext(
        "if (x > 0) { return x; } else { return -x; }"
      );
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(expressions.IfExpression);
      const ifExpr = result as expressions.IfExpression;
      expect(ifExpr.conditions).toHaveLength(1);
      expect(ifExpr.consequences).toHaveLength(1);
      expect(ifExpr.alternative).toBeInstanceOf(statements.BlockStatement);
    });

    it("should parse if-elif-else expressions", () => {
      const context = createContext(
        "if (x > 0) { return 1; } elif (x < 0) { return -1; } else { return 0; }"
      );
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(expressions.IfExpression);
      const ifExpr = result as expressions.IfExpression;
      expect(ifExpr.conditions).toHaveLength(2);
      expect(ifExpr.consequences).toHaveLength(2);
      expect(ifExpr.alternative).toBeInstanceOf(statements.BlockStatement);
    });

    it("should handle malformed if expressions", () => {
      const context = createContext("if (x > 0 { return x; }");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeNull();
      expect(context.errors.getErrors().length).toBeGreaterThan(0);
    });
  });

  describe("Complex Expression Combinations", () => {
    it("should parse complex nested expressions", () => {
      const context = createContext("arr[func(x + 1) * 2][key]");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(expressions.IndexExpression);
      const outerIndex = result as expressions.IndexExpression;
      expect(outerIndex.left).toBeInstanceOf(expressions.IndexExpression);
    });

    it("should handle function calls in array literals", () => {
      const context = createContext("[func(1), func(2)]");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(literals.ArrayLiteral);
      const arrayLiteral = result as literals.ArrayLiteral;
      expect(arrayLiteral.elements).toHaveLength(2);
      expect(arrayLiteral.elements[0]).toBeInstanceOf(
        expressions.CallExpression
      );
      expect(arrayLiteral.elements[1]).toBeInstanceOf(
        expressions.CallExpression
      );
    });

    it("should handle assignment in complex expressions", () => {
      const context = createContext("arr[i] = func(x + 1)");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeInstanceOf(expressions.AssignmentExpression);
      const assignExpr = result as expressions.AssignmentExpression;
      expect(assignExpr.value).toBeInstanceOf(expressions.CallExpression);
    });
  });

  describe("Error Handling", () => {
    it("should handle missing prefix parser", () => {
      const context = createContext(";");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeNull();
      expect(
        context.errors
          .getErrors()
          .some((e) => e.message.includes("No prefix parser"))
      ).toBe(true);
    });

    it("should handle incomplete expressions", () => {
      const context = createContext("1 +");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeNull();
      expect(context.errors.getErrors().length).toBeGreaterThan(0);
    });

    it("should handle malformed parentheses", () => {
      const context = createContext("(1 + 2");
      const result = parser.parseExpression(context, Precedence.LOWEST);

      expect(result).toBeNull();
      expect(
        context.errors.getErrors().some((e) => e.message.includes("RPAREN"))
      ).toBe(true);
    });
  });
});

// ============================================================================
// STATEMENT PARSER TESTS
// ============================================================================

describe("LetStatementParser", () => {
  let parser: LetStatementParser;

  beforeEach(() => {
    const registry = new StatementParserRegistry();
    parser = registry.findParser(
      new ParsingContext(new Lexer("let x = 5;"))
    ) as LetStatementParser;
  });

  it("should parse simple let statements", () => {
    const result = assertParseSuccess("let x = 5;", statements.LetStatement);
    expect(result.name.value).toBe("x");
    expect(result.value).toBeInstanceOf(literals.IntegerLiteral);
    expect((result.value as literals.IntegerLiteral).value).toBe(5);
  });

  it("should parse let statements with complex expressions", () => {
    const result = assertParseSuccess(
      "let sum = x + y * 2;",
      statements.LetStatement
    );
    expect(result.name.value).toBe("sum");
    expect(result.value).toBeInstanceOf(expressions.InfixExpression);
  });

  it("should parse let statements with function calls", () => {
    const result = assertParseSuccess(
      "let result = func(1, 2);",
      statements.LetStatement
    );
    expect(result.name.value).toBe("result");
    expect(result.value).toBeInstanceOf(expressions.CallExpression);
  });

  it("should parse let statements with arrays", () => {
    const result = assertParseSuccess(
      "let arr = [1, 2, 3];",
      statements.LetStatement
    );
    expect(result.name.value).toBe("arr");
    expect(result.value).toBeInstanceOf(literals.ArrayLiteral);
  });

  it("should parse let statements with hashes", () => {
    const result = assertParseSuccess(
      'let hash = {"key": "value"};',
      statements.LetStatement
    );
    expect(result.name.value).toBe("hash");
    expect(result.value).toBeInstanceOf(literals.HashLiteral);
  });

  it("should not parse non-let statements", () => {
    const context = createContext("const x = 5;");
    expect(parser.canParse(context)).toBe(false);
  });

  it("should handle missing identifier", () => {
    assertParseFailure("let = 5;", "IDENTIFIER");
  });

  it("should handle missing assignment", () => {
    assertParseFailure("let x 5;", "ASSIGN");
  });

  it("should handle missing value", () => {
    assertParseFailure("let x = ;");
  });

  it("should handle missing semicolon", () => {
    assertParseFailure("let x = 5", "SEMICOLON");
  });

  it("should handle malformed expressions", () => {
    assertParseFailure("let x = 1 + + 2;");
  });
});

describe("ConstStatementParser", () => {
  let parser: ConstStatementParser;

  beforeEach(() => {
    const registry = new StatementParserRegistry();
    parser = registry.findParser(
      new ParsingContext(new Lexer("const PI = 3.14;"))
    ) as ConstStatementParser;
  });

  it("should parse simple const statements", () => {
    const result = assertParseSuccess(
      "const PI = 3.14;",
      statements.ConstStatement
    );
    expect(result.name.value).toBe("PI");
    expect(result.value).toBeInstanceOf(literals.IntegerLiteral);
  });

  it("should parse const statements with complex expressions", () => {
    const result = assertParseSuccess(
      "const MAX_SIZE = WIDTH * HEIGHT;",
      statements.ConstStatement
    );
    expect(result.name.value).toBe("MAX_SIZE");
    expect(result.value).toBeInstanceOf(expressions.InfixExpression);
  });

  it("should not parse non-const statements", () => {
    const context = createContext("let x = 5;");
    expect(parser.canParse(context)).toBe(false);
  });

  it("should handle missing identifier", () => {
    assertParseFailure("const = 5;", "IDENTIFIER");
  });

  it("should handle missing assignment", () => {
    assertParseFailure("const PI 3.14;", "ASSIGN");
  });

  it("should handle missing semicolon", () => {
    assertParseFailure("const PI = 3.14", "SEMICOLON");
  });
});

describe("ReturnStatementParser", () => {
  let parser: ReturnStatementParser;

  beforeEach(() => {
    const registry = new StatementParserRegistry();
    parser = registry.findParser(
      new ParsingContext(new Lexer("return 42;"))
    ) as ReturnStatementParser;
  });

  it("should parse simple return statements", () => {
    const result = assertParseSuccess("return 42;", statements.ReturnStatement);
    expect(result.returnValue).toBeInstanceOf(literals.IntegerLiteral);
    expect((result.returnValue as literals.IntegerLiteral).value).toBe(42);
  });

  it("should parse return statements with expressions", () => {
    const result = assertParseSuccess(
      "return x + y;",
      statements.ReturnStatement
    );
    expect(result.returnValue).toBeInstanceOf(expressions.InfixExpression);
  });

  it("should parse return statements with function calls", () => {
    const result = assertParseSuccess(
      "return func(1, 2);",
      statements.ReturnStatement
    );
    expect(result.returnValue).toBeInstanceOf(expressions.CallExpression);
  });

  it("should parse return statements with complex expressions", () => {
    const result = assertParseSuccess(
      'return arr[i] + hash["key"];',
      statements.ReturnStatement
    );
    expect(result.returnValue).toBeInstanceOf(expressions.InfixExpression);
  });

  it("should not parse non-return statements", () => {
    const context = createContext("let x = 5;");
    expect(parser.canParse(context)).toBe(false);
  });

  it("should handle missing semicolon", () => {
    assertParseFailure("return 42", "SEMICOLON");
  });

  it("should handle malformed return expressions", () => {
    assertParseFailure("return +;");
  });
});

describe("WhileStatementParser", () => {
  let parser: WhileStatementParser;

  beforeEach(() => {
    const registry = new StatementParserRegistry();
    parser = registry.findParser(
      new ParsingContext(new Lexer("while (x > 0) { x = x - 1; }"))
    ) as WhileStatementParser;
  });

  it("should parse simple while statements", () => {
    const result = assertParseSuccess(
      "while (x > 0) { x = x - 1; }",
      statements.WhileStatement
    );
    expect(result.condition).toBeInstanceOf(expressions.InfixExpression);
    expect(result.body).toBeInstanceOf(statements.BlockStatement);
  });

  it("should parse while statements with complex conditions", () => {
    const result = assertParseSuccess(
      "while (x > 0 && y < 10) { x = x - 1; }",
      statements.WhileStatement
    );
    expect(result.condition).toBeInstanceOf(expressions.InfixExpression);
    const condition = result.condition as expressions.InfixExpression;
    expect(condition.operator).toBe("&&");
  });

  it("should parse while statements with complex bodies", () => {
    const result = assertParseSuccess(
      "while (x > 0) { let y = x * 2; x = x - 1; return y; }",
      statements.WhileStatement
    );
    expect(result.body.statements).toHaveLength(3);
  });

  it("should not parse non-while statements", () => {
    const context = createContext("for (;;) {}");
    expect(parser.canParse(context)).toBe(false);
  });

  it("should handle missing opening parenthesis", () => {
    assertParseFailure("while x > 0) { x = x - 1; }", "LPAREN");
  });

  it("should handle missing closing parenthesis", () => {
    assertParseFailure("while (x > 0 { x = x - 1; }", "RPAREN");
  });

  it("should handle missing opening brace", () => {
    assertParseFailure("while (x > 0) x = x - 1; }", "LBRACE");
  });

  it("should handle malformed condition", () => {
    assertParseFailure("while (x + + 0) { x = x - 1; }");
  });
});

describe("ForStatementParser", () => {
  let parser: ForStatementParser;

  beforeEach(() => {
    const registry = new StatementParserRegistry();
    parser = registry.findParser(
      new ParsingContext(
        new Lexer("for (let i = 0; i < 10; i = i + 1) { x = x + i; }")
      )
    ) as ForStatementParser;
  });

  it("should parse simple for statements", () => {
    const result = assertParseSuccess(
      "for (let i = 0; i < 10; i = i + 1) { x = x + i; }",
      statements.ForStatement
    );
    expect(result.initializer).toBeInstanceOf(statements.LetStatement);
    expect(result.condition).toBeInstanceOf(expressions.InfixExpression);
    expect(result.increment).toBeInstanceOf(expressions.InfixExpression);
    expect(result.body).toBeInstanceOf(statements.BlockStatement);
  });

  it("should parse for statements with const initializer", () => {
    const result = assertParseSuccess(
      "for (const step = 1; i < 10; i = i + step) { x = x + i; }",
      statements.ForStatement
    );
    expect(result.initializer).toBeInstanceOf(statements.ConstStatement);
  });

  it("should parse for statements with complex expressions", () => {
    const result = assertParseSuccess(
      "for (let i = 0; i < arr.length; i = i + 1) { sum = sum + arr[i]; }",
      statements.ForStatement
    );
    expect(result.condition).toBeInstanceOf(expressions.InfixExpression);
    expect(result.increment).toBeInstanceOf(expressions.InfixExpression);
  });

  it("should not parse non-for statements", () => {
    const context = createContext("while (true) {}");
    expect(parser.canParse(context)).toBe(false);
  });

  it("should handle missing opening parenthesis", () => {
    assertParseFailure("for let i = 0; i < 10; i = i + 1) {}", "LPAREN");
  });

  it("should handle missing semicolon after condition", () => {
    assertParseFailure("for (let i = 0; i < 10 i = i + 1) {}", "SEMICOLON");
  });

  it("should handle missing closing parenthesis", () => {
    assertParseFailure("for (let i = 0; i < 10; i = i + 1 {}", "RPAREN");
  });

  it("should handle malformed initializer", () => {
    assertParseFailure("for (let = 0; i < 10; i = i + 1) {}");
  });

  it("should handle malformed condition", () => {
    assertParseFailure("for (let i = 0; i + + 10; i = i + 1) {}");
  });

  it("should handle malformed increment", () => {
    assertParseFailure("for (let i = 0; i < 10; i + + 1) {}");
  });
});

describe("BreakStatementParser", () => {
  let parser: BreakStatementParser;

  beforeEach(() => {
    parser = new BreakStatementParser();
  });

  it("should parse break statements inside loops", () => {
    const context = createContext("break;");
    context.enterLoop(); // Simulate being inside a loop

    const result = parser.parse(context);
    expect(result).toBeInstanceOf(statements.BreakStatement);
  });

  it("should not parse break statements outside loops", () => {
    const context = createContext("break;");
    // Not inside a loop

    const result = parser.parse(context);
    expect(result).toBeNull();
    expect(
      context.errors
        .getErrors()
        .some((e) => e.message.includes("inside a loop"))
    ).toBe(true);
  });

  it("should not parse non-break statements", () => {
    const context = createContext("continue;");
    expect(parser.canParse(context)).toBe(false);
  });

  it("should handle missing semicolon", () => {
    const context = createContext("break");
    context.enterLoop();

    const result = parser.parse(context);
    expect(result).toBeNull();
    expect(
      context.errors.getErrors().some((e) => e.message.includes("SEMICOLON"))
    ).toBe(true);
  });
});

describe("ContinueStatementParser", () => {
  let parser: ContinueStatementParser;

  beforeEach(() => {
    parser = new ContinueStatementParser();
  });

  it("should parse continue statements inside loops", () => {
    const context = createContext("continue;");
    context.enterLoop(); // Simulate being inside a loop

    const result = parser.parse(context);
    expect(result).toBeInstanceOf(statements.ContinueStatement);
  });

  it("should not parse continue statements outside loops", () => {
    const context = createContext("continue;");
    // Not inside a loop

    const result = parser.parse(context);
    expect(result).toBeNull();
    expect(
      context.errors
        .getErrors()
        .some((e) => e.message.includes("inside a loop"))
    ).toBe(true);
  });

  it("should not parse non-continue statements", () => {
    const context = createContext("break;");
    expect(parser.canParse(context)).toBe(false);
  });

  it("should handle missing semicolon", () => {
    const context = createContext("continue");
    context.enterLoop();

    const result = parser.parse(context);
    expect(result).toBeNull();
    expect(
      context.errors.getErrors().some((e) => e.message.includes("SEMICOLON"))
    ).toBe(true);
  });
});

describe("BlockStatementParser", () => {
  let parser: BlockStatementParser;

  beforeEach(() => {
    const registry = new StatementParserRegistry();
    parser = registry.findParser(
      new ParsingContext(new Lexer("{ let x = 5; }"))
    ) as BlockStatementParser;
  });

  it("should parse empty blocks", () => {
    const result = assertParseSuccess("{}", statements.BlockStatement);
    expect(result.statements).toHaveLength(0);
  });

  it("should parse blocks with single statement", () => {
    const result = assertParseSuccess(
      "{ let x = 5; }",
      statements.BlockStatement
    );
    expect(result.statements).toHaveLength(1);
    expect(result.statements[0]).toBeInstanceOf(statements.LetStatement);
  });

  it("should parse blocks with multiple statements", () => {
    const result = assertParseSuccess(
      "{ let x = 5; const y = 10; return x + y; }",
      statements.BlockStatement
    );
    expect(result.statements).toHaveLength(3);
    expect(result.statements[0]).toBeInstanceOf(statements.LetStatement);
    expect(result.statements[1]).toBeInstanceOf(statements.ConstStatement);
    expect(result.statements[2]).toBeInstanceOf(statements.ReturnStatement);
  });

  it("should parse nested blocks", () => {
    const result = assertParseSuccess(
      "{ let x = 5; { let y = 10; } }",
      statements.BlockStatement
    );
    expect(result.statements).toHaveLength(2);
    expect(result.statements[1]).toBeInstanceOf(statements.BlockStatement);
  });

  it("should not parse non-block statements", () => {
    const context = createContext("let x = 5;");
    expect(parser.canParse(context)).toBe(false);
  });

  it("should handle unclosed blocks", () => {
    const context = createContext("{ let x = 5;");
    const result = parser.parse(context);

    // Should still return a block, but may be incomplete
    expect(result).toBeInstanceOf(statements.BlockStatement);
  });
});

describe("ExpressionStatementParser", () => {
  let parser: ExpressionStatementParser;

  beforeEach(() => {
    const registry = new StatementParserRegistry();
    parser = registry.findParser(
      new ParsingContext(new Lexer("x + 1;"))
    ) as ExpressionStatementParser;
  });

  it("should parse simple expression statements", () => {
    const result = assertParseSuccess("x + 1;", statements.ExpressionStatement);
    expect(result.expression).toBeInstanceOf(expressions.InfixExpression);
  });

  it("should parse function call statements", () => {
    const result = assertParseSuccess(
      "func(1, 2);",
      statements.ExpressionStatement
    );
    expect(result.expression).toBeInstanceOf(expressions.CallExpression);
  });

  it("should parse assignment statements", () => {
    const result = assertParseSuccess("x = 5;", statements.ExpressionStatement);
    expect(result.expression).toBeInstanceOf(expressions.AssignmentExpression);
  });

  it("should parse compound assignment statements", () => {
    const result = assertParseSuccess(
      "x += 5;",
      statements.ExpressionStatement
    );
    expect(result.expression).toBeInstanceOf(expressions.AssignmentExpression);
    const assignExpr = result.expression as expressions.AssignmentExpression;
    expect(assignExpr.value).toBeInstanceOf(expressions.InfixExpression);
  });

  it("should handle statements without semicolons", () => {
    const result = assertParseSuccess("x + 1", statements.ExpressionStatement);
    expect(result.expression).toBeInstanceOf(expressions.InfixExpression);
  });

  it("should always be able to parse (fallback parser)", () => {
    const context = createContext("anything");
    expect(parser.canParse(context)).toBe(true);
  });

  it("should handle malformed expressions", () => {
    assertParseFailure("++++;");
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe("StatementParserRegistry", () => {
  let registry: StatementParserRegistry;

  beforeEach(() => {
    registry = new StatementParserRegistry();
  });

  it("should find correct parser for each statement type", () => {
    const letContext = createContext("let x = 5;");
    const letParser = registry.findParser(letContext);
    expect(letParser).toBeInstanceOf(LetStatementParser);

    const constContext = createContext("const PI = 3.14;");
    const constParser = registry.findParser(constContext);
    expect(constParser).toBeInstanceOf(ConstStatementParser);

    const returnContext = createContext("return 42;");
    const returnParser = registry.findParser(returnContext);
    expect(returnParser).toBeInstanceOf(ReturnStatementParser);
  });

  it("should parse statements correctly", () => {
    const letResult = registry.parseStatement(createContext("let x = 5;"));
    expect(letResult).toBeInstanceOf(statements.LetStatement);

    const constResult = registry.parseStatement(
      createContext("const PI = 3.14;")
    );
    expect(constResult).toBeInstanceOf(statements.ConstStatement);

    const returnResult = registry.parseStatement(createContext("return 42;"));
    expect(returnResult).toBeInstanceOf(statements.ReturnStatement);
  });

  it("should fall back to expression statements", () => {
    const exprResult = registry.parseStatement(createContext("x + 1;"));
    expect(exprResult).toBeInstanceOf(statements.ExpressionStatement);

    const callResult = registry.parseStatement(createContext("func();"));
    expect(callResult).toBeInstanceOf(statements.ExpressionStatement);
  });

  it("should handle loop context correctly", () => {
    const context = createContext("break;");
    context.enterLoop();

    const result = registry.parseStatement(context);
    expect(result).toBeInstanceOf(statements.BreakStatement);
  });

  it("should allow adding custom parsers", () => {
    class CustomParser implements Parser<ast.Statement> {
      canParse(context: ParsingContext): boolean {
        return context.tokens.getCurrentToken().literal === "custom";
      }

      parse(context: ParsingContext): ast.Statement | null {
        return new statements.ExpressionStatement(
          context.tokens.getCurrentToken(),
          new ast.Identifier(context.tokens.getCurrentToken(), "custom")
        );
      }
    }

    registry.addParser(new CustomParser());

    const result = registry.parseStatement(createContext("custom"));
    expect(result).toBeInstanceOf(statements.ExpressionStatement);
  });
});

describe("ModularParser - Full Integration", () => {
  it("should parse complete programs", () => {
    const sourceCode = `
      let x = 5;
      const y = 10;
      
      while (x < y) {
        x = x + 1;
      }
      
      return x;
    `;

    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(4);
    expect(program.statements[0]).toBeInstanceOf(statements.LetStatement);
    expect(program.statements[1]).toBeInstanceOf(statements.ConstStatement);
    expect(program.statements[2]).toBeInstanceOf(statements.WhileStatement);
    expect(program.statements[3]).toBeInstanceOf(statements.ReturnStatement);
  });

  it("should parse complex nested structures", () => {
    const sourceCode = `
      let arr = [1, 2, 3];
      let hash = {"key": "value"};
      
      for (let i = 0; i < len(arr); i = i + 1) {
        if (arr[i] > 1) {
          hash[str(i)] = arr[i] * 2;
        }
      }
      
      return hash;
    `;

    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(4);

    // Check for statement
    const forStatement = program.statements[2] as statements.ForStatement;
    expect(forStatement).toBeInstanceOf(statements.ForStatement);
    expect(forStatement.body.statements).toHaveLength(1);

    // Check if statement inside for loop
    const ifStatement = forStatement.body
      .statements[0] as statements.ExpressionStatement;
    expect(ifStatement.expression).toBeInstanceOf(expressions.IfExpression);
  });

  it("should handle function definitions and calls", () => {
    const sourceCode = `
      let add = fn(x, y) {
        return x + y;
      };
      
      let result = add(5, 3);
      return result;
    `;

    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(3);

    // Check function definition
    const funcDef = program.statements[0] as statements.LetStatement;
    expect(funcDef.value).toBeInstanceOf(literals.FunctionLiteral);

    // Check function call
    const funcCall = program.statements[1] as statements.LetStatement;
    expect(funcCall.value).toBeInstanceOf(expressions.CallExpression);
  });

  it("should handle break and continue in loops", () => {
    const sourceCode = `
      while (true) {
        if (x > 10) {
          break;
        }
        if (x % 2 == 0) {
          continue;
        }
        x = x + 1;
      }
    `;

    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(1);

    const whileStmt = program.statements[0] as statements.WhileStatement;
    expect(whileStmt.body.statements).toHaveLength(3);
  });

  it("should handle complex expressions", () => {
    const sourceCode = `
      let result = ((x + y) * 2 - z) / (a + b);
      let index = arr[func(x + 1)];
      let value = hash[key] + other[index];
    `;

    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(3);

    // All should be let statements with complex expressions
    program.statements.forEach((stmt) => {
      expect(stmt).toBeInstanceOf(statements.LetStatement);
    });
  });

  it("should collect and report errors correctly", () => {
    const sourceCode = `
      let x =;
      const 5 = y;
      while (x + +) {
        break;
      }
      return
    `;

    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors.length).toBeGreaterThan(0);

    // Should contain various error types
    const errorMessages = errors.map((e) => e.message);
    expect(errorMessages.some((msg) => msg.includes("prefix parser"))).toBe(
      true
    );
  });

  it("should handle error recovery", () => {
    const sourceCode = `
      let x = 5;
      invalid syntax here;
      let y = 10;
      return y;
    `;

    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    // Should have errors but still parse valid statements
    expect(errors.length).toBeGreaterThan(0);
    expect(program.statements.length).toBeGreaterThan(0);
  });

  it("should handle empty programs", () => {
    const lexer = new Lexer("");
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(0);
  });

  it("should handle programs with only comments", () => {
    const sourceCode = `
      // This is a comment
      /* This is a 
         multiline comment */
      // Another comment
    `;

    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(0);
  });

  it("should support custom parser extension", () => {
    class CustomStatementParser implements Parser<ast.Statement> {
      canParse(context: ParsingContext): boolean {
        return context.tokens.getCurrentToken().literal === "custom";
      }

      parse(context: ParsingContext): ast.Statement | null {
        const token = context.tokens.getCurrentToken();
        context.tokens.advance();
        if (!context.tokens.expect(TokenType.SEMICOLON)) {
          return null;
        }
        return new statements.ExpressionStatement(
          token,
          new ast.Identifier(token, "custom")
        );
      }
    }

    const lexer = new Lexer("custom;");
    const parser = new EnigmaParser(lexer);
    parser.addStatementParser(new CustomStatementParser());

    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(1);
    expect(program.statements[0]).toBeInstanceOf(
      statements.ExpressionStatement
    );
  });
});

// ============================================================================
// PERFORMANCE AND STRESS TESTS
// ============================================================================

describe("Parser Performance and Stress Tests", () => {
  it("should handle deeply nested expressions", () => {
    // Create deeply nested parentheses
    const depth = 100;
    let sourceCode = "";
    for (let i = 0; i < depth; i++) {
      sourceCode += "(";
    }
    sourceCode += "1";
    for (let i = 0; i < depth; i++) {
      sourceCode += ")";
    }
    sourceCode += ";";

    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(1);
  });

  it("should handle long operator chains", () => {
    // Create long chain of additions
    const terms = 1000;
    let sourceCode = "1";
    for (let i = 2; i <= terms; i++) {
      sourceCode += ` + ${i}`;
    }
    sourceCode += ";";

    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(1);
  });

  it("should handle large arrays", () => {
    // Create large array literal
    const size = 1000;
    let sourceCode = "let arr = [";
    for (let i = 0; i < size; i++) {
      if (i > 0) sourceCode += ", ";
      sourceCode += i.toString();
    }
    sourceCode += "];";

    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(1);

    const letStmt = program.statements[0] as statements.LetStatement;
    const arrayLiteral = letStmt.value as literals.ArrayLiteral;
    expect(arrayLiteral.elements).toHaveLength(size);
  });

  it("should handle many statements", () => {
    // Create many let statements
    const count = 1000;
    let sourceCode = "";
    for (let i = 0; i < count; i++) {
      sourceCode += `let x${i} = ${i};\n`;
    }

    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(count);
  });
});

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

describe("Edge Cases and Corner Cases", () => {
  it("should handle Unicode identifiers", () => {
    const sourceCode = "let π = 3.14;";
    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(1);
  });

  it("should handle very long identifiers", () => {
    const longName = "a".repeat(1000);
    const sourceCode = `let ${longName} = 42;`;
    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(1);
  });

  it("should handle very long string literals", () => {
    const longString = "hello".repeat(1000);
    const sourceCode = `let str = "${longString}";`;
    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(1);
  });

  it("should handle maximum integer values", () => {
    const sourceCode = `let max = ${Number.MAX_SAFE_INTEGER};`;
    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(1);
  });

  it("should handle empty string literals", () => {
    const sourceCode = 'let empty = "";';
    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(1);
  });

  it("should handle whitespace-only programs", () => {
    const sourceCode = "   \n\t   \n   ";
    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(0);
  });

  it("should handle mixed statement types", () => {
    const sourceCode = `
      let x = 5;
      {
        const y = 10;
        while (x < y) {
          x = x + 1;
          if (x == 7) {
            break;
          }
        }
      }
      return x;
    `;

    const lexer = new Lexer(sourceCode);
    const parser = new EnigmaParser(lexer);
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    expect(errors).toHaveLength(0);
    expect(program.statements).toHaveLength(3);
  });
});

// ============================================================================
// UTILITY FUNCTIONS FOR MANUAL TESTING
// ============================================================================

export function testParser(sourceCode: string): void {
  console.log("Testing source code:", sourceCode);
  console.log("================================");

  const lexer = new Lexer(sourceCode);
  const parser = new EnigmaParser(lexer);
  const program = parser.parseProgram();
  const errors = parser.getErrors();

  if (errors.length === 0) {
    console.log("✅ Parsing successful!");
    console.log("Program:", program.toString());
    console.log("Statement count:", program.statements.length);
  } else {
    console.log("❌ Parsing failed with errors:");
    errors.forEach((error, index) => {
      console.log(
        `  ${index + 1}. Line ${error.line}, Column ${error.column}: ${
          error.message
        }`
      );
    });
  }

  console.log("================================\n");
}

export function runManualTests(): void {
  const testCases = [
    "let x = 5;",
    "const PI = 3.14;",
    "return 42;",
    "while (x > 0) { x = x - 1; }",
    "for (let i = 0; i < 10; i = i + 1) { sum = sum + i; }",
    "let arr = [1, 2, 3];",
    'let hash = {"key": "value"};',
    "let func = fn(x, y) { return x + y; };",
    "if (x > 0) { return x; } else { return -x; }",
    'arr[func(x + 1)] = hash["key"];',
    "let invalid =;", // Error case
    "while (x + +) { break; }", // Error case
  ];

  testCases.forEach(testParser);
}

// Run manual tests if this file is executed directly
if (require.main === module) {
  runManualTests();
}

// describe('Literal Expressions', () => {
//     it('should parse integer literals', () => {
//       const tests = [
//         { input: '42', expected: 42 },
//         { input: '0', expected: 0 },
//         { input: '999', expected: 999 }
//       ];

//       tests.forEach(({ input, expected }) => {
//         const context = createContext(input);
//         const result = parser.parseExpression(context, Precedence.LOWEST);

//         expect(result).toBeInstanceOf(literals.IntegerLiteral);
//         expect((result as literals.IntegerLiteral).value).toBe(expected);
//       });
//     });

//     it('should handle invalid integer literals', () => {
//       const context = createContext('invalid');
//       // First token is IDENTIFIER, not INT, so it should parse as identifier
//       const result = parser.parseExpression(context, Precedence.LOWEST);
//       expect(result).toBeInstanceOf(ast.Identifier);
//     });

//     it('should parse string literals', () => {
//       const tests = [
//         { input: '"hello"', expected: 'hello' },
//         { input: '""', expected: '' },
//         { input: '"hello world"', expected: 'hello world' }
//       ];

//       tests.forEach(({ input, expected }) => {
//         const context = createContext(input);
//         const result = parser.parseExpression(context, Precedence.LOWEST);

//         expect(result).toBeInstanceOf(literals.StringLiteral);
//         expect((result as literals.StringLiteral).value).toBe(expected);
//       });
//     });

//     it('should parse boolean literals', () => {
//       const trueContext = createContext('true');
//       const trueResult = parser.parseExpression(trueContext, Precedence.LOWEST);
//       expect(trueResult).toBeInstanceOf(expressions.BooleanExpression);
//       expect((trueResult as expressions.BooleanExpression).value).toBe(true);

//       const falseContext = createContext('false');
//       const falseResult = parser.parseExpression(falseContext, Precedence.LOWEST);
//       expect(falseResult).toBeInstanceOf(expressions.BooleanExpression);
//       expect((falseResult as expressions.BooleanExpression).value).toBe(false);
//     });

//     it('should parse identifiers', () => {
//       const tests = ['x', 'variable', 'camelCase', 'snake_case', 'a123'];

//       tests.forEach(input => {
//         const context = createContext(input);
//         const result = parser.parseExpression(context, Precedence.LOWEST);

//         expect(result).toBeInstanceOf(ast.Identifier);
//         expect((result as ast.Identifier).value).toBe(input);
//       });
//     });
//   });

//   describe('Prefix Expressions', () => {
//     it('should parse negative numbers', () => {
//       const context = createContext('-42');
//       const result = parser.parseExpression(context, Precedence.LOWEST);

//       expect(result).toBeInstanceOf(expressions.PrefixExpression);
//       const prefixExpr = result as expressions.PrefixExpression;
//       expect(prefixExpr.operator).toBe('-');
//       expect(prefixExpr.right).toBeInstanceOf(literals.IntegerLiteral);
//       expect((prefixExpr.right as literals.IntegerLiteral).value).toBe(42);
//     });

//     it('should parse logical NOT', () => {
//       const context = createContext('!true');
//       const result = parser.parseExpression(context, Precedence.LOWEST);

//       expect(result).toBeInstanceOf(expressions.PrefixExpression);
//       const prefixExpr = result as expressions.PrefixExpression;
//       expect(prefixExpr.operator).toBe('!');
//       expect(prefixExpr.right).toBeInstanceOf(expressions.BooleanExpression);
//     });

//     it('should parse nested prefix expressions', () => {
//       const context = createContext('!!true');
//       const result = parser.parseExpression(context, Precedence.LOWEST);

//       expect(result).toBeInstanceOf(expressions.PrefixExpression);
//       const outer = result as expressions.PrefixExpression;
//       expect(outer.operator).toBe('!');
//       expect(outer.right).toBeInstanceOf(expressions.PrefixExpression);

//       const inner = outer.right as expressions.PrefixExpression;
//       expect(inner.operator).toBe('!');
//       expect(inner.right).toBeInstanceOf(expressions.BooleanExpression);
//     });

//     it('should handle prefix expression errors', () => {
//       const context = createContext('-');
//       const result = parser.parseExpression(context, Precedence.LOWEST);

//       expect(result).toBeNull();
//       expect(context.errors.getErrors().length).toBeGreaterThan(0);
//     });
//   });

//   describe('Infix Expressions', () => {
//     it('should parse arithmetic operations', () => {
//       const tests = [
//         { input: '1 + 2', operator: '+' },
//         { input: '5 - 3', operator: '-' },
//         { input: '4 * 6', operator: '*' },
//         { input: '8 / 2', operator: '/' },
//         { input: '10 % 3', operator: '%' }
//       ];

//       tests.forEach(({ input, operator }) => {
//         const context = createContext(input);
//         const result = parser.parseExpression(context, Precedence.LOWEST);

//         expect(result).toBeInstanceOf(expressions.InfixExpression);
//         const infixExpr = result as expressions.InfixExpression;
//         expect(infixExpr.operator).toBe(operator);
//         expect(infixExpr.left).toBeInstanceOf(literals.IntegerLiteral);
//         expect(infixExpr.right).toBeInstanceOf(literals.IntegerLiteral);
//       });
//     });

//     it('should parse comparison operations', () => {
//       const tests = [
//         { input: '1 == 2', operator: '==' },
//         { input: '1 != 2', operator: '!=' },
//         { input: '1 < 2', operator: '<' },
//         { input: '1 > 2', operator: '>' }
//       ];

//       tests.forEach(({ input, operator }) => {
//         const context = createContext(input);
//         const result = parser.parseExpression(context, Precedence.LOWEST);

//         expect(result).toBeInstanceOf(expressions.InfixExpression);
//         expect((result as expressions.InfixExpression).operator).toBe(operator);
//       });
//     });

//     it('should parse logical operations', () => {
//       const tests = [
//         { input: 'true && false', operator: '&&' },
//         { input: 'true || false', operator: '||' }
//       ];

//       tests.forEach(({ input, operator }) => {
//         const context = createContext(input);
//         const result = parser.parseExpression(context, Precedence.LOWEST);

//         expect(result).toBeInstanceOf(expressions.InfixExpression);
//         expect((result as expressions.InfixExpression).operator).toBe(operator);
//       });
//     });

//     it('should handle operator precedence correctly', () => {
//       const context = createContext('1 + 2 * 3');
//       const result = parser.parseExpression(context, Precedence.LOWEST);

//       expect(result).toBeInstanceOf(expressions.InfixExpression);
//       const addExpr = result as expressions.InfixExpression;
//       expect(addExpr.operator).toBe('+');
//       expect(addExpr.left).toBeInstanceOf(literals.IntegerLiteral);
//       expect(addExpr.right).toBeInstanceOf(expressions.InfixExpression);

//       const mulExpr = addExpr.right as expressions.InfixExpression;
//       expect(mulExpr.operator).toBe('*');
//     });

//     it('should handle complex precedence chains', () => {
//       const context = createContext('1 + 2 * 3 - 4 / 2');
//       const result = parser.parseExpression(context, Precedence.LOWEST);

//       expect(result).toBeInstanceOf(expressions.InfixExpression);
//       // Should be: ((1 + (2 * 3)) - (4 / 2))
//       const outerExpr = result as expressions.InfixExpression;
//       expect(outerExpr.operator).toBe('-');
//     });

//     it('should handle logical operator precedence', () => {
//       const context = createContext('true && false || true');
//       const result = parser.parseExpression(context, Precedence.LOWEST);

//       expect(result).toBeInstanceOf(expressions.InfixExpression);
//       const orExpr = result as expressions.InfixExpression;
//       expect(orExpr.operator).toBe('||');
//       expect(orExpr.left).toBeInstanceOf(expressions.InfixExpression);

//       const andExpr = orExpr.left as expressions.InfixExpression;
//       expect(andExpr.operator).toBe('&&');
//     });
//   });

//   describe('Grouped Expressions', () => {
//     it('should parse parenthesized expressions', () => {
//       const context = createContext('(1 + 2)');
//       const result = parser.parseExpression(context, Precedence.LOWEST);

//       expect(result).toBeInstanceOf(expressions.InfixExpression);
//       const infixExpr = result as expressions.InfixExpression;
//       expect(infixExpr.operator).toBe('+');
//     });

//     it('should handle precedence with parentheses', () => {
//       const context = createContext('(1 + 2) * 3');
//       const result = parser.parseExpression(context, Precedence.LOWEST);

//       expect(result).toBeInstanceOf(expressions.InfixExpression);
//       const mulExpr = result as expressions.InfixExpression;
//       expect(mulExpr.operator).toBe('*');
//       expect(mulExpr.left).toBeInstanceOf(expressions.InfixExpression);

//       const addExpr = mulExpr.left as expressions.InfixExpression;
//       expect(addExpr.operator).toBe('+');
//     });

//     it('should handle nested parentheses', () => {
//       const context = createContext('((1 + 2) * 3)');
//       const result = parser.parseExpression(context, Precedence.LOWEST);

//       expect(result).toBeInstanceOf(expressions.InfixExpression);
//       expect((result as expressions.InfixExpression).operator).toBe('*');
//     });

//     it('should handle unclosed parentheses', () => {
//       const context = createContext('(1 + 2');
//       const result = parser.parseExpression(context, Precedence.LOWEST);

//       expect(result).toBeNull();
//       expect(context.errors.getErrors().length).toBeGreaterThan(0);
//     });
//   });

//   describe('Assignment Expressions', () => {
//     it('should parse simple assignment', () => {
//       const context = createContext('x = 5');
//       const result = parser.parseExpression(context, Precedence.LOWEST);

//       expect(result).toBeInstanceOf(expressions.AssignmentExpression);
//       const assignExpr = result as expressions.AssignmentExpression;
//       expect(assignExpr.name).toBeInstanceOf(ast.Identifier);
//       expect((assignExpr.name as ast.Identifier).value).toBe('x');
//       expect(assignExpr.value).toBeInstanceOf(literals.IntegerLiteral);
//     });

//     it('should handle assignment precedence', () => {
//       const context = createContext('x = y + 1');
//       const result = parser.parseExpression(context, Precedence.LOWEST);

//       expect(result).toBeInstanceOf(expressions.AssignmentExpression);
//       const assignExpr = result as expressions.AssignmentExpression;
//       expect(assignExpr.value).toBeInstanceOf(expressions.InfixExpression);
//     });

//     it('should reject invalid assignment targets', () => {
//       const context = createContext('5 = x');
//       const result = parser.parseExpression(context, Precedence.LOWEST);

//       expect(result).toBeNull();
//       expect(context.errors.getErrors().some(e => e.message.includes('Invalid assignment target'))).toBe(true);
//     });
//   });
