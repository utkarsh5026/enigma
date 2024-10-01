/* eslint-disable @typescript-eslint/no-explicit-any */
import { Parser } from "../src/lang/parser/parser";
import {
  Expression,
  Identifier,
  Program,
  Statement,
} from "../src/lang/ast/ast";
import {
  ExpressionStatement,
  LetStatement,
  WhileStatement,
} from "../src/lang/ast/statement";
import {
  AssignmentExpression,
  BooleanExpression,
  CallExpression,
  IfExpression,
  IndexExpression,
  InfixExpression,
} from "../src/lang/ast/expression";
import {
  ArrayLiteral,
  FunctionLiteral,
  HashLiteral,
  IntegerLiteral,
  StringLiteral,
} from "../src/lang/ast/literal";
import Lexer from "../src/lang/lexer/lexer";
import { describe, expect, test } from "@jest/globals";

describe("Parser", () => {
  test("Testing Let Statements", () => {
    const tests = [
      { input: "let x = 5;", expectedIdentifier: "x", expectedValue: 5 },
      { input: "let y = true;", expectedIdentifier: "y", expectedValue: true },
      {
        input: "let foobar = y;",
        expectedIdentifier: "foobar",
        expectedValue: "y",
      },
    ];

    tests.forEach(({ input, expectedIdentifier, expectedValue }) => {
      const program = createProgram(input);

      expect(program.statements.length).toBe(1);
      const stmt = program.statements[0];
      testLetStatement(stmt, expectedIdentifier);

      const val = (stmt as LetStatement).value;
      testLiteralExpression(val, expectedValue);
    });
  });

  test("Testing Parsing Infix Expressions", () => {
    const infixTests = [
      { input: "5 + 5;", leftValue: 5, operator: "+", rightValue: 5 },
      { input: "5 - 5;", leftValue: 5, operator: "-", rightValue: 5 },
      { input: "5 * 5;", leftValue: 5, operator: "*", rightValue: 5 },
      { input: "5 / 5;", leftValue: 5, operator: "/", rightValue: 5 },
      { input: "5 > 5;", leftValue: 5, operator: ">", rightValue: 5 },
      { input: "5 < 5;", leftValue: 5, operator: "<", rightValue: 5 },
      { input: "5 == 5;", leftValue: 5, operator: "==", rightValue: 5 },
      { input: "5 != 5;", leftValue: 5, operator: "!=", rightValue: 5 },
      {
        input: "true == true",
        leftValue: true,
        operator: "==",
        rightValue: true,
      },
      {
        input: "true != false",
        leftValue: true,
        operator: "!=",
        rightValue: false,
      },
      {
        input: "false == false",
        leftValue: false,
        operator: "==",
        rightValue: false,
      },
    ];

    infixTests.forEach(({ input, leftValue, operator, rightValue }) => {
      const program = createProgram(input);

      expect(program.statements.length).toBe(1);
      const stmt = program.statements[0] as ExpressionStatement;
      testInfixExpression(stmt.expression, leftValue, rightValue, operator);
    });
  });

  test("Test Operator Precedence Parsing", () => {
    interface Test {
      input: string;
      expected: string;
    }

    const tests: Test[] = [
      {
        input: "-a * b",
        expected: "((-a) * b)",
      },
      {
        input: "!-a",
        expected: "(!(-a))",
      },
      {
        input: "a + b + c",
        expected: "((a + b) + c)",
      },
      {
        input: "a + b - c",
        expected: "((a + b) - c)",
      },
      {
        input: "a * b * c",
        expected: "((a * b) * c)",
      },
      {
        input: "a * b / c",
        expected: "((a * b) / c)",
      },
      {
        input: "a + b / c",
        expected: "(a + (b / c))",
      },
      {
        input: "a + b * c + d / e - f",
        expected: "(((a + (b * c)) + (d / e)) - f)",
      },
      {
        input: "3 + 4; -5 * 5",
        expected: "(3 + 4)\n((-5) * 5)",
      },
      {
        input: "5 > 4 == 3 < 4",
        expected: "((5 > 4) == (3 < 4))",
      },
      {
        input: "5 < 4 != 3 > 4",
        expected: "((5 < 4) != (3 > 4))",
      },
      {
        input: "3 + 4 * 5 == 3 * 1 + 4 * 5",
        expected: "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))",
      },
      {
        input: "true",
        expected: "true",
      },
      {
        input: "false",
        expected: "false",
      },
      {
        input: "3 > 5 == false",
        expected: "((3 > 5) == false)",
      },
      {
        input: "3 < 5 == true",
        expected: "((3 < 5) == true)",
      },
      {
        input: "1 + (2 + 3) + 4",
        expected: "((1 + (2 + 3)) + 4)",
      },
      {
        input: "(5 + 5) * 2",
        expected: "((5 + 5) * 2)",
      },
      {
        input: "2 / (5 + 5)",
        expected: "(2 / (5 + 5))",
      },
      {
        input: "-(5 + 5)",
        expected: "(-(5 + 5))",
      },
      {
        input: "!(true == true)",
        expected: "(!(true == true))",
      },
      {
        input: "a + add(b * c) + d",
        expected: "((a + add((b * c))) + d)",
      },
      {
        input: "add(a, b, 1, 2 * 3, 4 + 5, add(6, 7 * 8))",
        expected: "add(a, b, 1, (2 * 3), (4 + 5), add(6, (7 * 8)))",
      },
      {
        input: "add(a + b + c * d / f + g)",
        expected: "add((((a + b) + ((c * d) / f)) + g))",
      },
    ];

    tests.forEach(({ input, expected }) => {
      const program = createProgram(input);
      const actual = program.toString();
      expect(actual).toBe(expected);
    });
  });

  test("Test If Expression", () => {
    const input = "if (x < y) { x }";
    const program = createProgram(input);

    expect(program.statements.length).toBe(1);
    const stmt = program.statements[0] as ExpressionStatement;
    const exp = stmt.expression as IfExpression;

    testInfixExpression(exp.condition, "x", "y", "<");
    expect(exp.consequence.statements.length).toBe(1);

    const consequence = exp.consequence.statements[0] as ExpressionStatement;
    testIdentifier(consequence.expression, "x");
    expect(exp.alternative).toBeNull();
  });

  test("Test Function Literal Parsing", () => {
    const input = "fn(x, y) { x + y; }";
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    checkParserErrors(p);

    expect(program.statements.length).toBe(1);
    const stmt = program.statements[0] as ExpressionStatement;
    const function_ = stmt.expression as FunctionLiteral;

    expect(function_.parameters.length).toBe(2);
    testLiteralExpression(function_.parameters[0], "x");
    testLiteralExpression(function_.parameters[1], "y");

    expect(function_.body.statements.length).toBe(1);
    const bodyStmt = function_.body.statements[0] as ExpressionStatement;
    testInfixExpression(bodyStmt.expression, "x", "y", "+");
  });

  test("Test Function Parameter Parsing", () => {
    const tests = [
      { input: "fn() {};", expectedParams: [] },
      { input: "fn(x) {};", expectedParams: ["x"] },
      { input: "fn(x, y, z) {};", expectedParams: ["x", "y", "z"] },
    ];

    tests.forEach(({ input, expectedParams }) => {
      const program = createProgram(input);

      const stmt = program.statements[0] as ExpressionStatement;
      const function_ = stmt.expression as FunctionLiteral;

      expect(function_.parameters.length).toBe(expectedParams.length);

      expectedParams.forEach((ident, i) => {
        testLiteralExpression(function_.parameters[i], ident);
      });
    });
  });

  test("Test Call Expression Parsing", () => {
    const input = "add(1, 2 * 3, 4 + 5);";
    const program = createProgram(input);

    expect(program.statements.length).toBe(1);
    const stmt = program.statements[0] as ExpressionStatement;
    const exp = stmt.expression as CallExpression;

    testIdentifier(exp.func, "add");
    expect(exp.args.length).toBe(3);

    testLiteralExpression(exp.args[0], 1);
    testInfixExpression(exp.args[1], 2, 3, "*");
    testInfixExpression(exp.args[2], 4, 5, "+");
  });

  test("Test String Literal Expression", () => {
    const input = '"hello world";';
    const program = createProgram(input);

    const stmt = program.statements[0] as ExpressionStatement;
    const literal = stmt.expression as StringLiteral;
    expect(literal.value).toBe("hello world");
  });

  test("Test Parsing Array Literals", () => {
    const input = "[1, 2 * 2, 3 + 3]";
    const program = createProgram(input);

    const stmt = program.statements[0] as ExpressionStatement;
    const array = stmt.expression as ArrayLiteral;

    expect(array.elements.length).toBe(3);
    testIntegerLiteral(array.elements[0], 1);
    testInfixExpression(array.elements[1], 2, 2, "*");
    testInfixExpression(array.elements[2], 3, 3, "+");
  });

  test("Test Parsing Index Expressions", () => {
    const input = "myArray[1 + 1]";
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    checkParserErrors(p);

    const stmt = program.statements[0] as ExpressionStatement;
    const indexExp = stmt.expression as IndexExpression;

    testIdentifier(indexExp.left, "myArray");
    testInfixExpression(indexExp.index, 1, 1, "+");
  });

  test("Test Parsing Hash Literals String Keys", () => {
    const input = '{"one": 1, "two": 2, "three": 3}';
    const program = createProgram(input);

    const stmt = program.statements[0] as ExpressionStatement;
    const hash = stmt.expression as HashLiteral;

    const expected = new Map([
      ["one", 1],
      ["two", 2],
      ["three", 3],
    ]);

    expect(hash.pairs.size).toBe(expected.size);

    hash.pairs.forEach((value, key) => {
      const keyLiteral = key as StringLiteral;
      const expectedValue = expected.get(keyLiteral.value);
      testIntegerLiteral(value, expectedValue!);
    });
  });

  test("Test Parsing Empty Hash Literal", () => {
    const input = "{}";
    const program = createProgram(input);

    const stmt = program.statements[0] as ExpressionStatement;
    const hash = stmt.expression as HashLiteral;
    expect(hash.pairs.size).toBe(0);
  });

  test("Test Parsing Hash Literals With Expressions", () => {
    const input = '{"one": 0 + 1, "two": 10 - 8, "three": 15 / 5}';
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    checkParserErrors(p);

    const stmt = program.statements[0] as ExpressionStatement;
    const hash = stmt.expression as HashLiteral;

    expect(hash.pairs.size).toBe(3);

    const tests: { [key: string]: (exp: Expression) => void } = {
      one: (e) => testInfixExpression(e, 0, 1, "+"),
      two: (e) => testInfixExpression(e, 10, 8, "-"),
      three: (e) => testInfixExpression(e, 15, 5, "/"),
    };

    hash.pairs.forEach((value, key) => {
      const keyLiteral = key as StringLiteral;
      const testFunc = tests[keyLiteral.value];
      testFunc(value);
    });
  });

  test("Test While Statement", () => {
    const input = "while (x < y) { x = x + 1; }";
    const program = createProgram(input);

    expect(program.statements.length).toBe(1);
    const stmt = program.statements[0] as WhileStatement;
    expect(stmt).toBeInstanceOf(WhileStatement);

    testInfixExpression(stmt.condition, "x", "y", "<");
    expect(stmt.body.statements.length).toBe(1);

    const bodyStmt = stmt.body.statements[0] as ExpressionStatement;
    testAssignmentExpression(bodyStmt.expression, "x", "(x + 1)");
  });

  test("Test Assignment Expression", () => {
    const tests = [
      { input: "x = 5;", expectedIdentifier: "x", expectedValue: 5 },
      { input: "y = true;", expectedIdentifier: "y", expectedValue: true },
      {
        input: "foobar = y;",
        expectedIdentifier: "foobar",
        expectedValue: "y",
      },
      {
        input: "x = 1 + 2 * 3;",
        expectedIdentifier: "x",
        expectedValue: "(1 + (2 * 3))",
      },
      {
        input: "y = foo(1, 2);",
        expectedIdentifier: "y",
        expectedValue: "foo(1, 2)",
      },
    ];

    tests.forEach(({ input, expectedIdentifier, expectedValue }) => {
      const program = createProgram(input);

      expect(program.statements.length).toBe(1);
      const stmt = program.statements[0] as ExpressionStatement;
      expect(stmt.expression).toBeInstanceOf(AssignmentExpression);

      const assignExp = stmt.expression as AssignmentExpression;
      expect(assignExp.name.value).toBe(expectedIdentifier);

      if (typeof expectedValue === "string") {
        expect(assignExp.value.toString()).toBe(expectedValue);
      } else {
        testLiteralExpression(assignExp.value, expectedValue);
      }
    });
  });

  test("Test Compound Assignment Expressions", () => {
    interface Test {
      input: string;
      expectedIdentifier: string;
      expectedOperator: string;
      expectedValue: any;
    }

    const tests: Test[] = [
      {
        input: "x += 5;",
        expectedIdentifier: "x",
        expectedOperator: "+",
        expectedValue: 5,
      },
      {
        input: "y -= 10;",
        expectedIdentifier: "y",
        expectedOperator: "-",
        expectedValue: 10,
      },
      {
        input: "z *= 2;",
        expectedIdentifier: "z",
        expectedOperator: "*",
        expectedValue: 2,
      },
      {
        input: "w /= 3;",
        expectedIdentifier: "w",
        expectedOperator: "/",
        expectedValue: 3,
      },
      {
        input: "a += b + 1;",
        expectedIdentifier: "a",
        expectedOperator: "+",
        expectedValue: "(b + 1)",
      },
      {
        input: "c *= foo(1, 2);",
        expectedIdentifier: "c",
        expectedOperator: "*",
        expectedValue: "foo(1, 2)",
      },
    ];

    tests.forEach(
      ({ input, expectedIdentifier, expectedOperator, expectedValue }) => {
        const program = createProgram(input);
        expect(program.statements.length).toBe(1);
        const stmt = program.statements[0] as ExpressionStatement;
        expect(stmt.expression).toBeInstanceOf(AssignmentExpression);

        const assignExp = stmt.expression as AssignmentExpression;
        expect(assignExp.name.value).toBe(expectedIdentifier);

        expect(assignExp.value).toBeInstanceOf(InfixExpression);
        const infixExp = assignExp.value as InfixExpression;
        expect(infixExp.operator).toBe(expectedOperator);

        testIdentifier(infixExp.left, expectedIdentifier);
        if (typeof expectedValue === "number") {
          testIntegerLiteral(infixExp.right, expectedValue);
        } else if (typeof expectedValue === "string") {
          expect(infixExp.right.toString()).toBe(expectedValue);
        } else {
          throw new Error(
            `Unexpected expectedValue type: ${typeof expectedValue}`
          );
        }
      }
    );
  });
});

function createProgram(input: string): Program {
  const l = new Lexer(input);
  const p = new Parser(l);
  const prog = p.parseProgram();
  checkParserErrors(p);
  return prog;
}

/**
 * Checks for parser errors and throws an error if any are found.
 * @param {Parser} p - The parser instance to check for errors.
 * @throws {Error} If the parser has any errors.
 */
function checkParserErrors(p: Parser) {
  const errors = p.parserErrors();

  errors.forEach((msg) => {
    console.error(`parser error: ${msg}`);
  });

  expect(errors.length).toBe(0);
}

/**
 * Tests if a statement is a valid let statement.
 * @param {Statement} s - The statement to test.
 * @param {string} name - The expected name of the variable being declared.
 * @returns {boolean} True if the statement is a valid let statement.
 */
function testLetStatement(s: Statement, name: string): boolean {
  expect(s.tokenLiteral()).toBe("let");
  expect(s).toBeInstanceOf(LetStatement);

  const letStmt = s as LetStatement;
  expect(letStmt.name.value).toBe(name);
  expect(letStmt.name.tokenLiteral()).toBe(name);

  return true;
}

/**
 * Tests if an expression is a valid literal expression.
 * @param {Expression} exp - The expression to test.
 * @param {any} expected - The expected value of the literal.
 * @returns {boolean} True if the expression is a valid literal expression.
 * @throws {Error} If the type of the expression is not handled.
 */
function testLiteralExpression(exp: Expression, expected: any): boolean {
  switch (typeof expected) {
    case "number":
      return testIntegerLiteral(exp, expected);
    case "string":
      return testIdentifier(exp, expected);
    case "boolean":
      return testBooleanLiteral(exp, expected);
  }
  throw new Error(`type of exp not handled. got=${exp}`);
}

/**
 * Tests if an expression is a valid infix expression.
 * @param {Expression} exp - The expression to test.
 * @param {any} left - The expected left operand.
 * @param {any} right - The expected right operand.
 * @param {string} operator - The expected operator.
 */
function testInfixExpression(
  exp: Expression,
  left: any,
  right: any,
  operator: string
) {
  expect(exp).toBeInstanceOf(InfixExpression);
  const opExp = exp as InfixExpression;

  testLiteralExpression(opExp.left, left);
  expect(opExp.operator).toBe(operator);
  testLiteralExpression(opExp.right, right);
}

function testAssignmentExpression(exp: Expression, name: string, value: any) {
  expect(exp).toBeInstanceOf(AssignmentExpression);
  const assignExp = exp as AssignmentExpression;
  expect(assignExp.name.value).toBe(name);
  expect(assignExp.value.toString()).toBe(value);
}

/**
 * Tests if an expression is a valid integer literal.
 * @param {Expression} il - The expression to test.
 * @param {number} value - The expected value of the integer literal.
 * @returns {boolean} True if the expression is a valid integer literal.
 */
function testIntegerLiteral(il: Expression, value: number): boolean {
  expect(il).toBeInstanceOf(IntegerLiteral);
  const integer = il as IntegerLiteral;
  expect(integer.value).toBe(value);
  expect(integer.tokenLiteral()).toBe(value.toString());
  return true;
}

/**
 * Tests if an expression is a valid identifier.
 * @param {Expression} exp - The expression to test.
 * @param {string} value - The expected value of the identifier.
 * @returns {boolean} True if the expression is a valid identifier.
 */
function testIdentifier(exp: Expression, value: string): boolean {
  expect(exp).toBeInstanceOf(Identifier);
  const ident = exp as Identifier;
  expect(ident.value).toBe(value);
  expect(ident.tokenLiteral()).toBe(value);
  return true;
}

/**
 * Tests if an expression is a valid boolean literal.
 * @param {Expression} exp - The expression to test.
 * @param {boolean} value - The expected value of the boolean literal.
 * @returns {boolean} True if the expression is a valid boolean literal.
 */
function testBooleanLiteral(exp: Expression, value: boolean): boolean {
  expect(exp).toBeInstanceOf(BooleanExpression);
  const bool = exp as BooleanExpression;

  expect(bool.value).toBe(value);
  expect(bool.tokenLiteral()).toBe(value.toString());
  return true;
}
