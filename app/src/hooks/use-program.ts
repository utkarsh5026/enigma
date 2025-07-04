import { useCallback, useEffect, useState } from "react";
import Lexer from "@/lang/lexer/lexer";
import { Parser } from "@/lang/parser/parser";
import { Program } from "@/lang/ast";
import { ErrorMessage } from "@/lang/parser/parser";
import { Token, TokenType } from "@/lang/token/token";

export type Ast = {
  program: Program;
  errors: ErrorMessage[];
};

export const useProgram = (code: string) => {
  const [program, setProgram] = useState<Program | null>(null);
  const [parserErrors, setParserErrors] = useState<ErrorMessage[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);

  const getTokens = useCallback(() => {
    const lexer = new Lexer(code);
    const newTokens: Token[] = [];
    let token = lexer.nextToken();
    while (token.type !== TokenType.EOF) {
      newTokens.push(token);
      token = lexer.nextToken();
    }
    setTokens(newTokens);
  }, [code]);

  useEffect(() => {
    getTokens();
  }, [getTokens]);

  useEffect(() => {
    if (!code || code.trim() === "") {
      setProgram(null);
      return;
    }

    try {
      const lexer = new Lexer(code);

      const parser = new Parser(lexer);
      const program = parser.parseProgram();
      setProgram(program);

      if (parser.parserErrors().length > 0) {
        setParserErrors(parser.parserErrors());
      }

      setProgram(program);
    } catch (error) {
      console.error("Error parsing code:", error);
      setProgram(null);
    }
  }, [code]);

  return { program, parserErrors, tokens };
};
