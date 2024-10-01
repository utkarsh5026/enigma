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
  const env = new objects.Environment();
  return evaluator.evaluate(program, env);
}
