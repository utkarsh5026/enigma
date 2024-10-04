/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "@jest/globals";
import Evaluator from "../src/lang/exec/eval";
import Lexer from "../src/lang/lexer/lexer";
import { Parser } from "../src/lang/parser/parser";
import * as objects from "../src/lang/exec/objects";

describe("Evaluator", () => {
  describe("Bang Operator", () => {
    const tests: [string, boolean][] = [
      ["!true", false],
      ["!false", true],
      ["!5", false],
      ["!!true", true],
      ["!!false", false],
      ["!!5", true],
    ];

    tests.forEach(([input, expected]) => {
      it(`should evaluate "${input}" to ${expected}`, () => {
        const evaluated = testEval(input);

        expect(evaluated).toBeInstanceOf(objects.BooleanObject);
        expect((evaluated as objects.BooleanObject).value).toBe(expected);
      });
    });
  });

  describe("Integer Arithmetic", () => {
    const tests: [string, number][] = [
      ["5", 5],
      ["10", 10],
      ["-5", -5],
      ["-10", -10],
      ["5 + 5 + 5 + 5 - 10", 10],
      ["2 * 2 * 2 * 2 * 2", 32],
      ["-50 + 100 + -50", 0],
      ["5 * 2 + 10", 20],
      ["5 + 2 * 10", 25],
      ["20 + 2 * -10", 0],
      ["50 / 2 * 2 + 10", 60],
      ["2 * (5 + 10)", 30],
      ["3 * 3 * 3 + 10", 37],
      ["3 * (3 * 3) + 10", 37],
      ["(5 + 10 * 2 + 15 / 3) * 2 + -10", 50],
    ];

    tests.forEach(([input, expected]) => {
      it(`should evaluate "${input}" to ${expected}`, () => {
        const evaluated = testEval(input);
        expect(evaluated).toBeInstanceOf(objects.IntegerObject);
        expect((evaluated as objects.IntegerObject).value).toBe(expected);
      });
    });
  });

  describe("Boolean Expressions", () => {
    const tests: [string, boolean][] = [
      ["true", true],
      ["false", false],
      ["1 < 2", true],
      ["1 > 2", false],
      ["1 < 1", false],
      ["1 > 1", false],
      ["1 == 1", true],
      ["1 != 1", false],
      ["1 == 2", false],
      ["1 != 2", true],
      ["true == true", true],
      ["false == false", true],
      ["true == false", false],
      ["true != false", true],
      ["false != true", true],
      ["(1 < 2) == true", true],
      ["(1 < 2) == false", false],
      ["(1 > 2) == true", false],
      ["(1 > 2) == false", true],
    ];

    tests.forEach(([input, expected]) => {
      it(`should evaluate "${input}" to ${expected}`, () => {
        const evaluated = testEval(input);
        expect(evaluated).toBeInstanceOf(objects.BooleanObject);
        expect((evaluated as objects.BooleanObject).value).toBe(expected);
      });
    });
  });

  describe("If-Else Expressions", () => {
    const tests: [string, any][] = [
      ["if (true) { 10 }", 10],
      ["if (false) { 10 }", null],
      ["if (1) { 10 }", 10],
      ["if (1 < 2) { 10 }", 10],
      ["if (1 > 2) { 10 }", null],
      ["if (1 > 2) { 10 } else { 20 }", 20],
      ["if (1 < 2) { 10 } else { 20 }", 10],
    ];

    tests.forEach(([input, expected]) => {
      it(`should evaluate "${input}" correctly`, () => {
        const evaluated = testEval(input);
        if (typeof expected === "number") {
          expect(evaluated).toBeInstanceOf(objects.IntegerObject);
          expect((evaluated as objects.IntegerObject).value).toBe(expected);
        } else {
          expect(evaluated).toBeInstanceOf(objects.NullObject);
        }
      });
    });
  });

  describe("Return Statements", () => {
    const tests: [string, number][] = [
      ["return 10;", 10],
      ["return 10; 9;", 10],
      ["return 2 * 5; 9;", 10],
      ["9; return 2 * 5; 9;", 10],
      ["if (10 > 1) { if (10 > 1) { return 10; } return 1; }", 10],
    ];

    tests.forEach(([input, expected]) => {
      it(`should evaluate "${input}" to ${expected}`, () => {
        const evaluated = testEval(input);
        expect(evaluated).toBeInstanceOf(objects.IntegerObject);
        expect((evaluated as objects.IntegerObject).value).toBe(expected);
      });
    });
  });

  describe("Let Statements", () => {
    const tests: [string, number][] = [
      ["let a = 5; a;", 5],
      ["let a = 5 * 5; a;", 25],
      ["let a = 5; let b = a; b;", 5],
      ["let a = 5; let b = a; let c = a + b + 5; c;", 15],
    ];

    tests.forEach(([input, expected]) => {
      it(`should evaluate "${input}" to ${expected}`, () => {
        const evaluated = testEval(input);
        console.log(evaluated);
        expect(evaluated).toBeInstanceOf(objects.IntegerObject);
        expect((evaluated as objects.IntegerObject).value).toBe(expected);
      });
    });
  });

  describe("Function Object", () => {
    it("should evaluate function object", () => {
      const input = "fn(x) { x + 2; };";
      const evaluated = testEval(input);
      expect(evaluated).toBeInstanceOf(objects.FunctionObject);
      const fn = evaluated as objects.FunctionObject;
      expect(fn.parameters).toHaveLength(1);
      expect(fn.parameters[0].value).toBe("x");
      expect(fn.body.toString()).toBe("(x + 2)");
    });
  });

  describe("Function Application", () => {
    const tests: [string, number][] = [
      ["let identity = fn(x) { x; }; identity(5);", 5],
      ["let identity = fn(x) { return x; }; identity(5);", 5],
      ["let double = fn(x) { x * 2; }; double(5);", 10],
      ["let add = fn(x, y) { x + y; }; add(5, 5);", 10],
      ["let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));", 20],
      ["fn(x) { x; }(5)", 5],
    ];

    tests.forEach(([input, expected]) => {
      it(`should evaluate "${input}" to ${expected}`, () => {
        const evaluated = testEval(input);
        expect(evaluated).toBeInstanceOf(objects.IntegerObject);
        expect((evaluated as objects.IntegerObject).value).toBe(expected);
      });
    });
  });

  describe("Closures", () => {
    it("should handle closures", () => {
      const input = `
        let newAdder = fn(x) {
          fn(y) { x + y };
        };
        let addTwo = newAdder(2);
        addTwo(2);
      `;
      const evaluated = testEval(input);
      expect(evaluated).toBeInstanceOf(objects.IntegerObject);
      expect((evaluated as objects.IntegerObject).value).toBe(4);
    });
  });

  describe("String Literals", () => {
    it("should evaluate string literal", () => {
      const input = '"Hello World!"';
      const evaluated = testEval(input);
      expect(evaluated).toBeInstanceOf(objects.StringObject);
      expect((evaluated as objects.StringObject).value).toBe("Hello World!");
    });
  });

  describe("String Concatenation", () => {
    it("should concatenate strings", () => {
      const input = '"Hello" + " " + "World!"';
      const evaluated = testEval(input);
      expect(evaluated).toBeInstanceOf(objects.StringObject);
      expect((evaluated as objects.StringObject).value).toBe("Hello World!");
    });
  });

  describe("Logical Operators", () => {
    const tests: [string, boolean][] = [
      // Logical AND tests
      ["true && true", true],
      ["true && false", false],
      ["false && true", false],
      ["false && false", false],
      ["1 < 2 && 2 > 1", true],
      ["1 < 2 && 2 < 1", false],
      ["1 > 2 && 2 < 1", false],
      ["(5 > 3) && (3 < 5)", true],
      ["let x = 5; (x > 3) && (x < 10)", true],
      ["let x = 15; (x > 3) && (x < 10)", false],

      // Logical OR tests
      ["true || true", true],
      ["true || false", true],
      ["false || true", true],
      ["false || false", false],
      ["1 < 2 || 2 < 1", true],
      ["1 > 2 || 2 > 1", true],
      ["1 > 2 || 2 < 1", false],
      ["(5 < 3) || (3 < 5)", true],
      ["let x = 5; (x < 3) || (x > 10)", false],
      ["let x = 15; (x < 3) || (x > 10)", true],

      // Mixed logical operators
      ["true && true || false", true],
      ["false || true && true", true],
      ["(false || true) && false", false],
      ["false && (true || false)", false],
      ["let x = 5; (x > 10) || (x < 3) && false", false],
      ["let x = 5; (x > 10) || ((x < 3) && false)", false],
      ["let x = 5; (x > 3) && (x < 10) || false", true],
    ];

    tests.forEach(([input, expected]) => {
      it(`should evaluate "${input}" to ${expected}`, () => {
        const evaluated = testEval(input);
        expect(evaluated).toBeInstanceOf(objects.BooleanObject);
        expect((evaluated as objects.BooleanObject).value).toBe(expected);
      });
    });
  });

  describe("While Loops with Break and Continue", () => {
    const tests: [string, number][] = [
      // Basic while loop
      ["let x = 0; while (x < 5) { x = x + 1; } x;", 5],
      ["let x = 0; while (true) { x = x + 1; if (x > 5) { break; } } x;", 6],
      [
        `
        let x = 0;
        let y = 0;
        while (x < 3) {
          x = x + 1;
          while (true) {
            y = y + 1;
            if (y > 2) { break; }
          }
        }
        x * 10 + y;
      `,
        35,
      ],
      [
        `
        let x = 0;
        let y = 0;
        let z = 0;
        while (x < 3) {
          x = x + 1;
          y = 0;
          while (y < 3) {
            y = y + 1;
            if (y % 2 == 0) { continue; }
            z = z + 1;
          }
        }
        z;
      `,
        6,
      ],
      [
        `
        let sum = 0;
        let i = 0;
        while (i < 10) {
          i = i + 1;
          if (i % 2 == 0) { continue; }
          if (i > 7) { break; }
          sum = sum + i;
        }
        sum;
      `,
        16,
      ],
    ];

    tests.forEach(([input, expected]) => {
      it(`should evaluate "${input
        .replace(/\s+/g, " ")
        .trim()}" to ${expected}`, () => {
        const evaluated = testEval(input);
        console.log(evaluated);
        expect(evaluated).toBeInstanceOf(objects.IntegerObject);
        expect((evaluated as objects.IntegerObject).value).toBe(expected);
      });
    });
  });
});

/**
 * Evaluates the given input string as a program.
 *
 * @param input - The input string to evaluate.
 * @returns The evaluated result as a BaseObject.
 */
function testEval(input: string): objects.BaseObject {
  const evaluator = new Evaluator();
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  console.log(parser.parserErrors());
  console.log(program);
  expect(parser.parserErrors()).toHaveLength(0);

  const env = new objects.Environment();
  return evaluator.evaluate(program, env);
}
