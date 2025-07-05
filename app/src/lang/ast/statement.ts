import { Expression, Identifier, Statement } from "./ast";
import { Token } from "../token/token";

/**
 * Represents a let statement in the AST.
 */
export class LetStatement extends Statement {
  name: Identifier;
  value: Expression;

  constructor(token: Token, name: Identifier, value: Expression) {
    super(token);
    this.name = name;
    this.value = value;
  }

  /**
   * Returns a string representation of the LetStatement.
   * @returns A string in the format "let <name> = <value>;"
   */
  toString(): string {
    const varName = this.name.toString();
    const value = this.value.toString();
    return `${this.tokenLiteral()} ${varName} = ${value};`;
  }
}

/**
 * Represents a return statement in the AST.
 */
export class ReturnStatement extends Statement {
  returnValue: Expression;

  constructor(token: Token, returnValue: Expression) {
    super(token);
    this.returnValue = returnValue;
  }

  /**
   * Returns a string representation of the ReturnStatement.
   * @returns A string in the format "return <value>;"
   */
  toString(): string {
    const value = this.returnValue.toString();
    return `${this.tokenLiteral()} ${value};`;
  }
}

/**
 * Represents an expression statement in the AST.
 */
export class ExpressionStatement extends Statement {
  expression: Expression;

  constructor(token: Token, expression: Expression) {
    super(token);
    this.expression = expression;
  }

  /**
   * Returns a string representation of the ExpressionStatement.
   * @returns A string representation of the contained expression.
   */
  toString(): string {
    return this.expression.toString();
  }
}

/**
 * Represents a block statement in the AST.
 */
export class BlockStatement extends Statement {
  statements: Statement[];

  constructor(token: Token, statements: Statement[]) {
    super(token);
    this.statements = statements;
  }

  /**
   * Returns a string representation of the BlockStatement.
   * @returns A concatenated string of all contained statements.
   */
  toString(): string {
    return this.statements.map((s) => s.toString()).join("");
  }
}

/**
 * Represents a while statement in the AST.
 */
export class WhileStatement extends Statement {
  condition: Expression;
  body: BlockStatement;

  constructor(token: Token, condition: Expression, body: BlockStatement) {
    super(token);
    this.condition = condition;
    this.body = body;
  }

  /**
   * Returns a string representation of the WhileStatement.
   * @returns A string representation of the while loop.
   */
  toString(): string {
    const condition = this.condition.toString();
    let body = "";

    for (const statement of this.body.statements) {
      body += `\t${statement.toString()};\n`;
    }

    return `while (${condition}) {\n${body}\n}`;
  }
}

/**
 * Represents a break statement in the AST.
 */
export class BreakStatement extends Statement {
  constructor(token: Token) {
    super(token);
    this.token = token;
  }

  toString(): string {
    return "break;";
  }
}

/**
 * Represents a continue statement in the AST.
 */
export class ContinueStatement extends Statement {
  constructor(token: Token) {
    super(token);
  }

  toString(): string {
    return "continue;";
  }
}

/**
 * Represents a for statement in the AST.
 */
export class ForStatement extends Statement {
  initializer: Statement;
  condition: Expression;
  increment: Expression;
  body: BlockStatement;

  /**
   * Creates a new ForStatement instance.
   * @param token The token associated with this statement.
   * @param initializer The statement to initialize the loop.
   * @param condition The expression to evaluate as the loop condition.
   * @param increment The expression to evaluate as the loop increment.
   * @param body The block statement to execute as the loop body.
   */
  constructor(
    token: Token,
    initializer: Statement,
    condition: Expression,
    increment: Expression,
    body: BlockStatement
  ) {
    super(token);
    this.initializer = initializer;
    this.condition = condition;
    this.increment = increment;
    this.body = body;
  }

  toString(): string {
    return `for (${this.initializer.toString()}; ${this.condition.toString()}; ${this.increment.toString()}) {\n${this.body.toString()}\n}`;
  }
}

/**
 * Represents a const statement in the AST.
 */
export class ConstStatement extends Statement {
  name: Identifier;
  value: Expression;

  /**
   * Creates a new ConstStatement instance.
   * @param token The token associated with this statement.
   * @param name The identifier being assigned to.
   * @param value The expression representing the value being assigned.
   */
  constructor(token: Token, name: Identifier, value: Expression) {
    super(token);
    this.name = name;
    this.value = value;
  }

  toString(): string {
    return `const ${this.name.toString()} = ${this.value.toString()};`;
  }
}

/**
 * Represents a class declaration in the AST.
 */
export class ClassDeclaration extends Statement {
  name: Identifier;
  constructorMethod: ConstructorDefinition | null;
  methods: MethodDefinition[];
  superClass: Identifier | null;

  /**
   * Creates a new ClassDeclaration instance.
   * @param token The token associated with this class declaration.
   * @param name The identifier representing the class name.
   * @param constructorMethod The constructor method of the class, if any.
   * @param methods An array of method definitions for the class.
   * @param superClass The identifier of the superclass, if any.
   */
  constructor(
    token: Token,
    name: Identifier,
    constructorMethod: ConstructorDefinition | null,
    methods: MethodDefinition[],
    superClass: Identifier | null = null
  ) {
    super(token);
    this.name = name;
    this.constructorMethod = constructorMethod;
    this.methods = methods;
    this.superClass = superClass;
  }

  toString(): string {
    let out = `class ${this.name.value}`;
    if (this.superClass) {
      out += ` extends ${this.superClass.value}`;
    }
    out += ` {\n`;
    if (this.constructorMethod) {
      out += this.constructorMethod.toString() + "\n";
    }
    for (const method of this.methods) {
      out += method.toString() + "\n";
    }
    out += "}";
    return out;
  }
}

/**
 * Represents a method definition in the AST.
 */
export class MethodDefinition extends Statement {
  name: Identifier;
  parameters: Identifier[];
  body: BlockStatement;
  isStatic: boolean;

  /**
   * Creates a new MethodDefinition instance.
   * @param token The token associated with this method definition.
   * @param name The identifier representing the method name.
   * @param parameters An array of identifiers representing the method parameters.
   * @param body The block statement representing the method body.
   * @param isStatic Indicates whether the method is static or not.
   */
  constructor(
    token: Token,
    name: Identifier,
    parameters: Identifier[],
    body: BlockStatement,
    isStatic: boolean = false
  ) {
    super(token);
    this.name = name;
    this.parameters = parameters;
    this.body = body;
    this.isStatic = isStatic;
  }

  toString(): string {
    return `${this.name.value}(${this.parameters
      .map((p) => p.toString())
      .join(", ")}) ${this.body.toString()}`;
  }
}

/**
 * Represents a constructor definition in the AST.
 */
export class ConstructorDefinition extends MethodDefinition {
  /**
   * Creates a new ConstructorDefinition instance.
   * @param token The token associated with this constructor definition.
   * @param parameters An array of identifiers representing the constructor parameters.
   * @param body The block statement representing the constructor body.
   */
  constructor(token: Token, parameters: Identifier[], body: BlockStatement) {
    super(token, new Identifier(token, "init"), parameters, body);
  }
}

export class PropertyDefinition extends Statement {
  private name: Identifier;
  private value: Expression;

  constructor(token: Token, name: Identifier, value: Expression) {
    super(token);
    this.name = name;
    this.value = value;
  }

  statementNode() {}
  tokenLiteral(): string {
    return this.token.literal;
  }
  toString(): string {
    return `${this.name.value} = ${this.value.toString()};`;
  }
}
