import React, { useMemo } from "react";
import Lexer from "@/lang/lexer/lexer";
import { Parser } from "@/lang/parser/parser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ParserErrors from "./ParserErrors";
import AstNode from "./AstNode";
import { X, FileCode } from "lucide-react";

interface ASTDisplayProps {
  code: string;
}

const ASTDisplay: React.FC<ASTDisplayProps> = ({ code }) => {
  // Parse the code to get the AST
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

  // Render content based on code and AST state
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
        <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
          <AstNode node={ast.program} depth={0} path="root" />
        </div>
      </>
    );
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white dark:bg-gray-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">AST Analysis</CardTitle>
        <CardDescription>
          Abstract Syntax Tree representation of your code
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">{renderContent()}</CardContent>
    </Card>
  );
};

export default ASTDisplay;
