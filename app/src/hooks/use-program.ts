import { useCallback, useEffect, useState } from "react";
import Lexer from "@/lang/lexer/lexer";
import { EnigmaParser } from "@/lang/parser/parser";
import { Program } from "@/lang/ast";
import { ParseError } from "@/lang/parser/core";
import { Token, TokenType } from "@/lang/token/token";

export type Ast = {
  program: Program;
  errors: ParseError[];
};

export const useProgram = (code: string) => {
  const [program, setProgram] = useState<Program | null>(null);
  const [parserErrors, setParserErrors] = useState<ParseError[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);

  const reset = useCallback(() => {
    setProgram(null);
    setParserErrors([]);
  }, []);

  const getTokens = useCallback(() => {
    try {
      const lexer = new Lexer(code);
      const newTokens: Token[] = [];
      let token = lexer.nextToken();
      while (token.type !== TokenType.EOF) {
        newTokens.push(token);
        token = lexer.nextToken();
      }
      setTokens(newTokens);
    } catch (error) {
      console.error("Error getting tokens:", error);
    }
  }, [code]);

  useEffect(() => {
    getTokens();
  }, [getTokens]);

  const parse = useCallback(() => {
    try {
      const lexer = new Lexer(code);

      const parser = new EnigmaParser(lexer);
      const program = parser.parseProgram();
      setProgram(program);

      if (parser.getErrors().length > 0) {
        setParserErrors(parser.getErrors());
      }

      setProgram(program);
    } catch (error) {
      console.error("Error parsing code:", error);
    }
  }, [code]);

  useEffect(() => {
    if (!code || code.trim() === "") {
      reset();
      return;
    }

    reset();
    parse();
  }, [code, reset, parse]);

  return { program, parserErrors, tokens };
};
