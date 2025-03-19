import {Token} from "../token/token.ts";

/**
 * Represents a node in the Abstract Syntax Tree (AST).
 */
export interface Node {
    /**
     * Returns the literal value of the token associated with this node.
     * @returns {string} The token's literal value.
     */
    tokenLiteral(): string;

    /**
     * Returns a string representation of the node.
     * @returns {string} The string representation.
     */
    toString(): string;
}

/**
 * Represents a statement in the AST.
 * A statement is a unit of code that performs an action.
 * Statements are used to control the flow of the program.
 *
 * Examples of statements include:
 * - let statements
 * - return statements
 * - expression statements
 * - if statements
 * - for statements
 * - while statements
 */
export interface Statement extends Node {
    /**
     * Marker method to identify this node as a statement.
     */
    statementNode(): void;
}

/**
 * Represents an expression in the AST
 * An expression is a unit of code that evaluates to a value.
 * Expressions are used to compute values.
 *
 * Examples of expressions include:
 * - identifiers
 * - literals
 * - operators
 * - function calls
 * - array literals
 *
 */
export interface Expression extends Node {
    /**
     * Marker method to identify this node as an expression.
     */
    expressionNode(): void;
}

/**
 * Represents the root node of the AST.
 */
export class Program implements Node {
    /**
     * The list of statements in the program.
     */
    statements: Statement[] = [];

    /**
     * Returns the literal value of the first token in the program.
     * @returns {string} The token's literal value or an empty string if there are no statements.
     */
    tokenLiteral(): string {
        if (this.statements.length > 0) {
            return this.statements[0].tokenLiteral();
        } else {
            return "";
        }
    }

    /**
     * Returns a string representation of the entire program.
     * @returns {string} The string representation of all statements joined by newlines.
     */
    toString(): string {
        return this.statements.map((s) => s.toString()).join("\n");
    }
}

/**
 * Represents an identifier in the AST.
 */
export class Identifier implements Expression {
    /**
     * The token associated with this identifier.
     */
    token: Token;

    /**
     * The value of the identifier.
     */
    value: string;

    /**
     * Creates a new Identifier instance.
     * @param {Token} token - The token associated with this identifier.
     * @param {string} value - The value of the identifier.
     */
    constructor(token: Token, value: string) {
        this.token = token;
        this.value = value;
    }

    /**
     * Marker method to identify this node as an expression.
     */
    expressionNode() {
    }

    /**
     * Returns the literal value of the token associated with this identifier.
     * @returns {string} The token's literal value.
     */
    tokenLiteral(): string {
        return this.token.literal;
    }

    /**
     * Returns a string representation of the identifier.
     * @returns {string} The value of the identifier.
     */
    toString(): string {
        return this.value;
    }
}