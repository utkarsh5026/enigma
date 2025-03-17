import React, { useState } from "react";
import EnigmaEditor from "./EnigmaEditor";
import TokenDisplay from "./TokenDisplay";
import Lexer from "../lang/lexer/lexer";
import { Token, TokenType } from "../lang/token/token";

const MutantEditor: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [tokens, setTokens] = useState<Token[]>([]);

  const handleCodeChange = (newCode: string) => {
    if (newCode && newCode.length > 0) {
      setCode(newCode);
      const lexer = new Lexer(newCode);
      let token = lexer.nextToken();
      const newTokens: Token[] = [];
      while (token.type != TokenType.EOF) {
        newTokens.push(token);
        token = lexer.nextToken();
      }
      setTokens(newTokens);
    } else {
      setTokens([]);
      setCode("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900 p-6 gap-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Enigma Language Explorer
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Write code in the editor to see tokens, AST, and evaluation results
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <div className="flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-2">Code Editor</h2>
          <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <EnigmaEditor code={code} onCodeChange={handleCodeChange} />
          </div>
        </div>

        <div className="flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-2">Analysis</h2>
          <div className="flex-1 overflow-auto">
            <TokenDisplay tokens={tokens} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutantEditor;
