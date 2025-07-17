import { useEffect, useState } from "react";
import { useMonaco } from "@monaco-editor/react";
import {
  keywords,
  builtinFunctions,
  operators,
  getKeywordDocumentation,
  getBuiltinDocumentation,
  getBuiltinSignature,
  getHoverDocumentation,
} from "../guide/guide";

const useEnigmaEditor = () => {
  const monaco = useMonaco();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (monaco) {
      // Register the Enigma language
      monaco.languages.register({ id: "enigma" });

      // Enhanced tokenizer with better syntax highlighting
      monaco.languages.setMonarchTokensProvider("enigma", {
        keywords,
        builtins: builtinFunctions,
        typeKeywords: ["int", "string", "bool", "array", "hash", "function"],
        operators: operators,
        symbols: /[=><!~?:&|+\-*^%]+/,
        escapes:
          /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

        tokenizer: {
          root: [
            // Comments
            [/#.*$/, "comment"],

            // Identifiers and keywords
            [
              /[a-zA-Z_$][\w$]*/,
              {
                cases: {
                  "@keywords": "keyword",
                  "@typeKeywords": "type",
                  "@builtins": "builtin.function", // Add built-in functions
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

      // Enhanced completion provider
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
            // Keywords with enhanced descriptions
            ...keywords.map((keyword) => ({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword,
              documentation: getKeywordDocumentation(keyword),
              range,
              sortText: `0_${keyword}`, // Prioritize keywords
            })),

            // Built-in functions with signatures and descriptions
            ...builtinFunctions.map((func) => ({
              label: func,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: `${func}($1)`,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: getBuiltinDocumentation(func),
              detail: getBuiltinSignature(func),
              range,
              sortText: `1_${func}`,
            })),

            // Enhanced code snippets
            {
              label: "if-else-block",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                "if (${1:condition}) {",
                "\t${2:// if block}",
                "} else {",
                "\t${3:// else block}",
                "}",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Complete if-else statement",
              range,
              sortText: "2_if_else",
            },

            {
              label: "function-declaration",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                "fn ${1:functionName}(${2:parameters}) {",
                "\t${3:// function body}",
                "\treturn ${4:value};",
                "}",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Function declaration with return statement",
              range,
              sortText: "2_function",
            },

            {
              label: "while-loop",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                "while (${1:condition}) {",
                "\t${2:// loop body}",
                "}",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "While loop structure",
              range,
              sortText: "2_while",
            },

            {
              label: "for-loop",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                "for (let ${1:i} = ${2:0}; ${1:i} < ${3:10}; ${1:i} = ${1:i} + 1) {",
                "\t${4:// loop body}",
                "}",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "For loop with counter",
              range,
              sortText: "2_for",
            },
          ];

          return { suggestions };
        },
      });

      // Enhanced hover provider
      monaco.languages.registerHoverProvider("enigma", {
        provideHover: (model, position) => {
          const word = model.getWordAtPosition(position);
          if (!word) return null;

          const documentation = getHoverDocumentation(word.word);
          if (!documentation) return null;

          return {
            range: new monaco.Range(
              position.lineNumber,
              word.startColumn,
              position.lineNumber,
              word.endColumn
            ),
            contents: [{ value: `**${word.word}**` }, { value: documentation }],
          };
        },
      });

      // Define enhanced theme
      monaco.editor.defineTheme("enigma-enhanced", {
        base: "vs-dark",
        inherit: true,
        rules: [
          // Keywords with vibrant blue
          { token: "keyword", foreground: "569cd6", fontStyle: "bold" },

          // Type keywords with teal
          { token: "type.keyword", foreground: "4ec9b0", fontStyle: "italic" },

          // Built-in functions with yellow
          {
            token: "builtin.function",
            foreground: "dcdcaa",
            fontStyle: "bold",
          },

          // Enhanced identifiers
          { token: "identifier", foreground: "d4d4d4" },

          // Enhanced numbers with better distinction
          { token: "number", foreground: "b5cea8" },
          { token: "number.float", foreground: "9cdcfe" },

          // Enhanced strings
          { token: "string", foreground: "ce9178" },
          { token: "string.fstring", foreground: "d7ba7d" },
          { token: "string.char", foreground: "569cd6" },
          { token: "string.escape", foreground: "d7ba7d", fontStyle: "bold" },
          { token: "string.invalid", foreground: "f44747" },

          // Enhanced comments
          { token: "comment", foreground: "6a9955", fontStyle: "italic" },
          { token: "comment.line", foreground: "6a9955", fontStyle: "italic" },

          // Enhanced operators
          { token: "operator", foreground: "d4d4d4" },

          // Enhanced delimiters
          { token: "delimiter", foreground: "d4d4d4" },
          { token: "delimiter.colon", foreground: "569cd6" },
          { token: "delimiter.dot", foreground: "d4d4d4" },
          { token: "delimiter.fstring", foreground: "c586c0" },

          // Enhanced brackets
          { token: "@brackets", foreground: "ffd700" },
        ],
        colors: {
          // VS Code Dark Theme colors
          "editor.background": "#1e1e1e",
          "editor.foreground": "#d4d4d4",
          "editorCursor.foreground": "#aeafad",
          "editor.lineHighlightBackground": "#2a2d2e",
          "editor.selectionBackground": "#264f78",
          "editor.inactiveSelectionBackground": "#3a3d41",

          // VS Code line numbers
          "editorLineNumber.foreground": "#858585",
          "editorLineNumber.activeForeground": "#c6c6c6",

          // VS Code gutter and guides
          "editorGutter.background": "#1e1e1e",
          "editorIndentGuide.background": "#404040",
          "editorIndentGuide.activeBackground": "#707070",
          "editorRuler.foreground": "#5a5a5a",

          // VS Code scrollbar
          "scrollbar.shadow": "#000000",
          "scrollbarSlider.background": "#79797966",
          "scrollbarSlider.hoverBackground": "#646464b3",
          "scrollbarSlider.activeBackground": "#bfbfbf66",

          // VS Code find widget
          "editorWidget.background": "#252526",
          "editorWidget.border": "#454545",
          "editorWidget.foreground": "#cccccc",

          // VS Code minimap
          "minimap.background": "#1e1e1e",
          "minimap.selectionHighlight": "#264f78",
          "minimapSlider.background": "#79797966",
          "minimapSlider.hoverBackground": "#646464b3",
          "minimapSlider.activeBackground": "#bfbfbf66",

          // VS Code bracket matching
          "editorBracketMatch.background": "#0064001a",
          "editorBracketMatch.border": "#888888",

          // VS Code selection and word highlighting
          "editor.wordHighlightBackground": "#575757b8",
          "editor.wordHighlightStrongBackground": "#004972b8",
          "editor.selectionHighlightBackground": "#add6ff26",

          // VS Code suggestion widget
          "editorSuggestWidget.background": "#252526",
          "editorSuggestWidget.border": "#454545",
          "editorSuggestWidget.foreground": "#d4d4d4",
          "editorSuggestWidget.selectedBackground": "#094771",
          "editorSuggestWidget.highlightForeground": "#0097fb",

          // VS Code hover widget
          "editorHoverWidget.background": "#252526",
          "editorHoverWidget.border": "#454545",
          "editorHoverWidget.foreground": "#cccccc",
        },
      });

      setIsReady(true);
    }
  }, [monaco]);

  return { isReady };
};

export default useEnigmaEditor;
