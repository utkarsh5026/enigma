import {
  type Parser,
  ParsingContext,
  ParserException,
  type StatementParse,
} from "@/lang/parser/core";
import { Identifier, ClassStatement, FunctionLiteral } from "@/lang/ast";
import { TokenType } from "@/lang/token/token";
import { BlockStatementParser } from "./block-statement";
import { MethodDefinition } from "@/lang/ast/statements/class-statement";

/**
 * 🏛️ ClassStatementParser - Class Definition Parser 🏛️
 *
 * Parses class definitions with inheritance, constructors, and methods.
 *
 * From first principles, class parsing involves:
 * 1. Parse 'class' keyword
 * 2. Parse class name (identifier)
 * 3. Optionally parse 'extends' and parent class name
 * 4. Parse class body (constructor and methods)
 * 5. Create ClassStatement AST node
 *
 * Grammar:
 * ```
 * class-statement := 'class' IDENTIFIER ('extends' IDENTIFIER)? '{' class-body
 * '}'
 * class-body := constructor? method*
 * constructor := 'constructor' '(' parameters ')' block-statement
 * method := IDENTIFIER '(' parameters ')' block-statement
 * ```
 */
export class ClassStatementParser implements Parser<ClassStatement> {
  private readonly statementParser: StatementParse;

  public constructor(statementParser: StatementParse) {
    this.statementParser = statementParser;
  }

  public canParse(context: ParsingContext): boolean {
    return context.isCurrentToken(TokenType.CLASS);
  }

  public parse(context: ParsingContext): ClassStatement {
    const classToken = context.consumeCurrentToken(TokenType.CLASS);
    const nameToken = context.consumeCurrentToken(
      TokenType.IDENTIFIER,
      "Expected class name after the 'class' keyword"
    );
    const className = new Identifier(nameToken, nameToken.literal);

    const parentClass = this.parseParentClass(context);
    console.log(parentClass);
    context.consumeCurrentToken(
      TokenType.LBRACE,
      "Expected '{' to start class body"
    );
    const bodyResult = this.parseClassBody(context);
    context.consumeCurrentToken(
      TokenType.RBRACE,
      "Expected '}' to end class body"
    );

    return new ClassStatement(
      classToken,
      className,
      parentClass,
      bodyResult.constructor,
      bodyResult.methods
    );
  }

  /**
   * 🔗 Parses the parent class of a class
   */
  private parseParentClass(context: ParsingContext): Identifier | null {
    if (!context.isCurrentToken(TokenType.EXTENDS)) {
      return null;
    }

    context.consumeCurrentToken(TokenType.EXTENDS);
    const parentToken = context.consumeCurrentToken(
      TokenType.IDENTIFIER,
      "Expected parent class name after 'extends'"
    );
    return new Identifier(parentToken, parentToken.literal);
  }

  /**
   * 📖 Parses the body of a class (constructor and methods)
   */
  private parseClassBody(context: ParsingContext) {
    let classConstructor: FunctionLiteral | null = null;
    const methods: MethodDefinition[] = [];

    while (!context.isCurrentToken(TokenType.RBRACE) && !context.isAtEnd()) {
      console.log(
        "current token",
        context.getCurrentToken(),
        context.getCurrentToken().type
      );
      if (context.isCurrentToken(TokenType.IDENTIFIER)) {
        const nameToken = context.getCurrentToken();
        const name = nameToken.literal;

        if (name === "init") {
          console.log("constructor");
          if (classConstructor) {
            throw new ParserException(
              "Class can only have one constructor",
              nameToken
            );
          }
          classConstructor = this.parseConstructor(context);
          continue;
        }

        const method = this.parseMethod(context);
        methods.push(method);
      } else {
        throw new ParserException(
          "Expected method or constructor in class body",
          context.getCurrentToken()
        );
      }
    }

    return { constructor: classConstructor, methods };
  }

  /**
   * 🏗️ Parses a constructor definition
   */
  private parseConstructor(context: ParsingContext): FunctionLiteral {
    const constructorToken = context.consumeCurrentToken(TokenType.IDENTIFIER); // constructor identifier
    context.consumeCurrentToken(
      TokenType.LPAREN,
      "Expected '(' after 'constructor'"
    );

    const parameters = this.parseParameters(context);
    context.consumeCurrentToken(
      TokenType.RPAREN,
      "Expected ')' after constructor parameters"
    );

    const blockParser = new BlockStatementParser(this.statementParser);
    const body = blockParser.parse(context);

    return new FunctionLiteral(constructorToken, parameters, body);
  }

  /**
   * 🔧 Parses a method definition
   */
  private parseMethod(context: ParsingContext): MethodDefinition {
    const nameToken = context.consumeCurrentToken(
      TokenType.IDENTIFIER,
      "Expected method name"
    );
    const methodName = new Identifier(nameToken, nameToken.literal);

    context.consumeCurrentToken(
      TokenType.LPAREN,
      "Expected '(' after method name"
    );

    const parameters = this.parseParameters(context);
    context.consumeCurrentToken(
      TokenType.RPAREN,
      "Expected ')' after method parameters"
    );

    const blockParser = new BlockStatementParser(this.statementParser);
    const body = blockParser.parse(context);

    const functionLiteral = new FunctionLiteral(nameToken, parameters, body);
    return new MethodDefinition(methodName, functionLiteral);
  }

  /**
   * 📋 Parses function parameters
   */
  private parseParameters(context: ParsingContext): Identifier[] {
    const parameters: Identifier[] = [];

    if (context.isCurrentToken(TokenType.RPAREN)) {
      return parameters; // No parameters
    }

    while (!context.isCurrentToken(TokenType.RPAREN)) {
      const paramToken = context.consumeCurrentToken(
        TokenType.IDENTIFIER,
        "Expected parameter name"
      );
      parameters.push(new Identifier(paramToken, paramToken.literal));

      if (
        !context.isCurrentToken(TokenType.COMMA) &&
        !context.isCurrentToken(TokenType.RPAREN)
      ) {
        throw new ParserException(
          "Expected ',' or ')' after parameter",
          context.getCurrentToken()
        );
      }

      if (context.isCurrentToken(TokenType.COMMA)) {
        context.consumeCurrentToken(TokenType.COMMA);
      }
    }

    return parameters;
  }
}
