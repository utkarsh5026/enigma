import React, { useEffect, useMemo } from "react";
import { getKeywords } from "../lang/token/token";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EnigmaEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

const EnigmaEditor: React.FC<EnigmaEditorProps> = ({ code, onCodeChange }) => {
  const monaco = useMonaco();
  const keywords = useMemo(() => getKeywords(), []);

  useEffect(() => {
    if (monaco) {
      // Register the language
      monaco.languages.register({ id: "enigma" });

      // Define the tokenizer for syntax highlighting
      monaco.languages.setMonarchTokensProvider("enigma", {
        keywords,
        typeKeywords: ["int", "string", "bool", "array"],
        operators: [
          "=",
          "+",
          "-",
          "!",
          "*",
          "/",
          "%",
          "<",
          ">",
          "==",
          "!=",
          "+=",
          "-=",
          "*=",
          "/=",
          "&&",
          "||",
          "&",
          "|",
          "^",
          "~",
          "<<",
          ">>",
        ],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,

        tokenizer: {
          root: [
            // Comments
            [/\/\/.*$/, "comment"],
            [/\/\*/, "comment", "@comment"],

            // Identifiers and keywords
            [
              /[a-zA-Z_$][\w$]*/,
              {
                cases: {
                  "@keywords": "keyword",
                  "@typeKeywords": "type",
                  "@default": "identifier",
                },
              },
            ],

            // Numbers
            [/\d+/, "number"],

            // Strings
            [/"([^"\\]|\\.)*$/, "string.invalid"],
            [/"/, "string", "@string"],

            // Brackets
            [/[{}()\[\]]/, "@brackets"],

            // Operators
            [
              /@symbols/,
              {
                cases: {
                  "@operators": "operator",
                  "@default": "",
                },
              },
            ],

            // Separators
            [/[,;]/, "delimiter"],
          ],

          comment: [
            [/[^/*]+/, "comment"],
            [/\/\*/, "comment", "@push"],
            [/\*\//, "comment", "@pop"],
            [/[/*]/, "comment"],
          ],

          string: [
            [/[^\\"]+/, "string"],
            [/\\./, "string.escape"],
            [/"/, "string", "@pop"],
          ],
        },
      });

      // Register a completion provider
      monaco.languages.registerCompletionItemProvider("enigma", {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const suggestions = [
            ...keywords.map((keyword) => ({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword,
              range,
            })),
            // Common programming constructs
            {
              label: "if-else",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
            },
            {
              label: "while",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "while (${1:condition}) {\n\t${2}\n}",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
            },
            {
              label: "function",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "fn(${1:parameters}) {\n\t${2}\n}",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
            },
            {
              label: "let",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "let ${1:name} = ${2:value};",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
            },
          ];

          return { suggestions };
        },
      });

      // Define the theme
      monaco.editor.defineTheme("enigmaTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "c678dd" },
          { token: "identifier", foreground: "e5c07b" },
          { token: "type", foreground: "56b6c2" },
          { token: "number", foreground: "98c379" },
          { token: "string", foreground: "e5c07b" },
          { token: "comment", foreground: "7f848e", fontStyle: "italic" },
          { token: "operator", foreground: "56b6c2" },
          { token: "delimiter", foreground: "abb2bf" },
          { token: "brackets", foreground: "abb2bf" },
        ],
        colors: {
          "editor.background": "#1e2a3a",
          "editor.foreground": "#abb2bf",
          "editor.lineHighlightBackground": "#2c3e50",
          "editorCursor.foreground": "#528bff",
          "editorWhitespace.foreground": "#3b4048",
          "editorIndentGuide.background": "#3b4048",
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
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MonacoEditor
        className="min-h-[400px] h-full"
        value={code}
        language="enigma"
        theme="enigmaTheme"
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', Menlo, Monaco, 'Courier New', monospace",
          fontLigatures: true,
          lineNumbers: "on",
          tabSize: 2,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          padding: {
            top: 16,
            bottom: 16,
          },
          glyphMargin: true,
          renderLineHighlight: "line",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
        }}
      />
    </div>
  );
};

export default EnigmaEditor;
