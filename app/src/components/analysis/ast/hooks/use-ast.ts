import { useEffect, useState } from "react";
import Lexer from "@/lang/lexer/lexer";
import { EnigmaParser } from "@/lang/parser";
import { Program } from "@/lang/ast";
import { ParseError } from "@/lang/parser";

export type Ast = {
  program: Program;
  errors: ParseError[];
};

export const useAst = (code: string) => {
  const [ast, setAst] = useState<Ast | null>(null);

  useEffect(() => {
    if (!code || code.trim() === "") {
      setAst(null);
      return;
    }

    try {
      const lexer = new Lexer(code);
      const parser = new EnigmaParser(lexer);
      const program = parser.parseProgram();

      if (parser.getErrors().length > 0) {
        setAst({ program, errors: parser.getErrors() });
      }

      setAst({ program, errors: [] });
    } catch (error) {
      console.error("Error parsing code:", error);
      setAst(null);
    }
  }, [code]);

  return { ast };
};
