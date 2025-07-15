import * as readline from "readline";
import Evaluator from "../exec/evaluation/eval";
import { Environment } from "../exec/objects";
import Lexer from "../lexer/lexer";
import { LanguageParser } from "../parser";

/**
 * Represents a Read-Eval-Print Loop (REPL) for the ENIGMA language.
 */
class Repl {
  private readonly rl: readline.Interface;
  private readonly evaluator: Evaluator;
  private readonly env: Environment;

  /**
   * Initializes a new instance of the Repl class.
   * Sets up the readline interface, evaluator, and environment.
   */
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: ">> ",
    });
    this.evaluator = new Evaluator();
    this.env = new Environment();
  }

  /**
   * Starts the REPL.
   * Prints welcome messages and enters the main loop for processing user input.
   */
  start() {
    console.log("Welcome to the ENIGMA REPL!");
    console.log("Type in commands and press Enter to evaluate.");
    console.log('Type "exit" to quit the REPL.');

    this.rl.prompt();
    this.rl.on("line", (line) => {
      if (line.trim().toLowerCase() === "exit") {
        this.rl.close();
        return;
      }

      try {
        const program = this.parseProgram(line);
        if (program !== null) {
          const evaluated = this.evaluator.evaluate(program, this.env);
          if (evaluated !== null) {
            console.log(evaluated.inspect());
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });
  }

  /**
   * Parses the input line into an AST program.
   * @param line - The input line to parse.
   * @returns The parsed program or null if there are parsing errors.
   */
  private parseProgram(line: string) {
    const lexer = new Lexer(line);
    const parser = new LanguageParser(lexer);

    const program = parser.parseProgram();
    const errors = parser.getErrors();

    if (errors.length > 0) {
      this.printParserErrors(errors.map((error) => error.message));
      return null;
    }

    return program;
  }

  /**
   * Prints parser errors to the console.
   * @param errors - An array of error messages to print.
   */
  private printParserErrors(errors: string[]) {
    console.log("Woops! We ran into some monkey business here!");
    console.log(" parser errors:");
    errors.forEach((error) => console.log(`\t${error}`));
  }
}

const repl = new Repl();
repl.start();
