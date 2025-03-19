import React, { useMemo } from "react";
import Lexer from "@/lang/lexer/lexer";
import { Parser } from "@/lang/parser/parser";
import ParserErrors from "./ParserErrors";
import AstNode from "./AstNode";
import { X, FileCode } from "lucide-react";

interface ASTDisplayProps {
  code: string;
}

const ASTDisplay: React.FC<ASTDisplayProps> = ({ code }) => {
  const ast = useMemo(() => {
    if (!code || code.trim() === "") {
      return null;
    }

    try {
      const lexer = new Lexer(code);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      if (parser.parserErrors().length > 0) {
        return { program, errors: parser.parserErrors() };
      }

      return { program, errors: [] };
    } catch (error) {
      console.error("Error parsing code:", error);
      return null;
    }
  }, [code]);

  const renderContent = () => {
    if (!code || code.trim() === "") {
      return (
        <div className="flex flex-col items-center justify-center p-10 text-gray-500 dark:text-gray-400">
          <FileCode
            size={40}
            className="mb-3 text-gray-400 dark:text-gray-600"
          />
          <p className="text-center">
            Enter some code in the editor to see its AST representation.
          </p>
        </div>
      );
    }

    if (ast === null) {
      return (
        <div className="flex flex-col items-center justify-center p-10 bg-red-50 dark:bg-red-950 rounded-md text-red-600 dark:text-red-400">
          <X size={40} className="mb-3" />
          <p className="text-center">
            Failed to parse the code. There may be syntax errors.
          </p>
        </div>
      );
    }

    return (
      <>
        {ast.errors && ast.errors.length > 0 && (
          <ParserErrors errors={ast.errors} />
        )}
        <div className="rounded-lg p-4 overflow-x-auto">
          <AstNode node={ast.program} depth={0} path="root" />
        </div>
      </>
    );
  };

  return (
    <div className="w-full h-full overflow-auto bg-[#0d1117] text-[#a9b1d6] p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-1">Abstract Syntax Tree</h2>
        <p className="text-[#565f89] text-sm">
          Visual representation of the parsed code structure
        </p>
      </div>

      <div className="space-y-6">{renderContent()}</div>
    </div>
  );
};

export default ASTDisplay;
