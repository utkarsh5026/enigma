import React, { useEffect, useMemo } from "react";
import { getKeywords } from "../lang/token/token";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import "./style.css";

interface EnigmaEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

const EnigmaEditor: React.FC<EnigmaEditorProps> = ({ code, onCodeChange }) => {
  const monaco = useMonaco();
  const keywords = useMemo(() => getKeywords(), []);

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: "mutant" });
      monaco.languages.setMonarchTokensProvider("mutant", {
        keywords: keywords,
        operators: ["=", "+", "-", "!", "*", "/", "<", ">", "==", "!="],
        symbols: /[=><!~?:&|+\-*^%/]+/,
        tokenizer: {
          root: [
            [
              /[a-z_$][\w$]*/,
              { cases: { "@keywords": "keyword", "@default": "identifier" } },
            ],
            [/[0-9]+/, "number"],
            [/".*?"/, "string"],
            [
              /@symbols/,
              { cases: { "@operators": "operator", "@default": "" } },
            ],
          ],
        },
      });

      monaco.languages.registerCompletionItemProvider("mutant", {
        provideCompletionItems: (_model, position) => {
          const suggestions = keywords.map((keyword) => ({
            label: keyword,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: keyword,
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
          }));
          return { suggestions };
        },
      });
    }
  }, [monaco, keywords]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onCodeChange(value);
    }
  };

  return (
    <MonacoEditor
      className="enigma-editor-container"
      value={code}
      language="mutant"
      defaultLanguage="mutant"
      theme="vs-dark"
      onChange={handleEditorChange}
      options={{
        wordWrap: "on",
        wrappingStrategy: "simple",
        fontSize: 16,
        fontFamily: "Cascadia Code, Consolas, 'Courier New', monospace",
        tabSize: 2,
        insertSpaces: true,
        autoIndent: "advanced",
        lineHeight: 24,
        scrollbar: {
          alwaysConsumeMouseWheel: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
          verticalSliderSize: 10,
        },
        padding: {
          top: 20,
          bottom: 10,
        },
      }}
    />
  );
};

export default EnigmaEditor;
