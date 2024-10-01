import {describe, expect, it} from "@jest/globals";
import Evaluator from "../src/lang/exec/eval";
import Lexer from "../src/lang/lexer/lexer";
import {Parser} from "../src/lang/parser/parser";
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