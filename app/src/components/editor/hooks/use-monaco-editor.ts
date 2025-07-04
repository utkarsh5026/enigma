import { getKeywords } from "@/lang/token/token";
import { useMonaco } from "@monaco-editor/react";
import { useEffect, useMemo } from "react";

export const useMonacoEditor = () => {
  const monaco = useMonaco();
  const keywords = useMemo(() => getKeywords(), []);

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: "enigma" });

      monaco.languages.setMonarchTokensProvider("enigma", {
        keywords,
        typeKeywords: ["int", "string", "bool", "array"],
        operators,
        symbols: /[=><!~?:&|+\-*^%]+/,

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
            [/[{}()[\]]/, "@brackets"],

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

      // Define a dark theme for the Enigma editor
      monaco.editor.defineTheme("enigmaDark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "ff7b72" }, // GitHub Dark red for keywords
          { token: "identifier", foreground: "c9d1d9" }, // GitHub Dark default text color
          { token: "type", foreground: "79c0ff" }, // GitHub Dark blue for types
          { token: "number", foreground: "d2a8ff" }, // GitHub Dark purple for numbers
          { token: "string", foreground: "a5d6ff" }, // GitHub Dark light blue for strings
          { token: "comment", foreground: "8b949e", fontStyle: "italic" }, // GitHub Dark gray for comments
          { token: "operator", foreground: "ff7b72" }, // GitHub Dark red for operators
          { token: "delimiter", foreground: "8b949e" }, // GitHub Dark gray for delimiters
          { token: "brackets", foreground: "8b949e" }, // GitHub Dark gray for brackets
        ],
        colors: {
          "editor.background": "#0d1117", // GitHub Dark background
          "editor.foreground": "#c9d1d9", // GitHub Dark default text
          "editorCursor.foreground": "#58a6ff", // GitHub Dark blue cursor
          "editor.lineHighlightBackground": "#161b22", // GitHub Dark line highlight
          "editor.selectionBackground": "#2d3139", // GitHub Dark selection
          "editorLineNumber.foreground": "#484f58", // GitHub Dark line number
          "editorLineNumber.activeForeground": "#8b949e", // GitHub Dark active line number
          "editorIndentGuide.background": "#21262d", // GitHub Dark indent guide
          "editorIndentGuide.activeBackground": "#30363d", // GitHub Dark active indent guide
          "editorGutter.background": "#0d1117", // GitHub Dark gutter
          "editor.inactiveSelectionBackground": "#272e38", // GitHub Dark inactive selection
        },
      });
    }
  }, [monaco, keywords]);
};

const operators = [
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
] as const;
