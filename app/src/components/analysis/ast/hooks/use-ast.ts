import { useEffect, useState } from "react";
import Lexer from "@/lang/lexer/lexer";
import { Parser } from "@/lang/parser/parser";
import { Program } from "@/lang/ast";
import { ErrorMessage } from "@/lang/parser/parser";

export type Ast = {
  program: Program;
  errors: ErrorMessage[];
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
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      if (parser.parserErrors().length > 0) {
        setAst({ program, errors: parser.parserErrors() });
      }

      setAst({ program, errors: [] });
    } catch (error) {
      console.error("Error parsing code:", error);
      setAst(null);
    }
  }, [code]);

  return { ast };
};
