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
        inherit: false, // Don't inherit to have full control
        rules: [
          // Tokyo Night Keywords - soft blue, not bold to reduce contrast
          { token: "keyword", foreground: "7aa2f7" },

          // Type keywords - soft teal/cyan
          { token: "type.keyword", foreground: "7dcfff", fontStyle: "italic" },

          // Built-in functions - warm yellow, gentle
          { token: "builtin.function", foreground: "e0af68" },

          // Identifiers - main text color, soft
          { token: "identifier", foreground: "a9b1d6" },

          // Numbers - soft green
          { token: "number", foreground: "9ece6a" },
          { token: "number.float", foreground: "9ece6a" },

          // Strings - warm orange, easier on eyes
          { token: "string", foreground: "ff9e64" },
          { token: "string.fstring", foreground: "e0af68" },
          { token: "string.char", foreground: "ff9e64" },
          { token: "string.escape", foreground: "bb9af7" },
          { token: "string.invalid", foreground: "f7768e" },

          // Comments - muted, low contrast
          { token: "comment", foreground: "565f89", fontStyle: "italic" },
          { token: "comment.line", foreground: "565f89", fontStyle: "italic" },

          // Operators - subtle, not distracting
          { token: "operator", foreground: "89ddff" },

          // Delimiters - very subtle
          { token: "delimiter", foreground: "787c99" },
          { token: "delimiter.colon", foreground: "89ddff" },
          { token: "delimiter.dot", foreground: "a9b1d6" },
          { token: "delimiter.fstring", foreground: "bb9af7" },

          // Brackets - gentle purple
          { token: "@brackets", foreground: "9d7cd8" },
        ],
        colors: {
          // Tokyo Night Background colors
          "editor.background": "#1a1b26",
          "editor.foreground": "#a9b1d6",
          "editorCursor.foreground": "#c0caf5",
          "editor.lineHighlightBackground": "#24283b",
          "editor.selectionBackground": "#28344a",
          "editor.inactiveSelectionBackground": "#202331",

          // Tokyo Night line numbers
          "editorLineNumber.foreground": "#3b4261",
          "editorLineNumber.activeForeground": "#737aa2",

          // Tokyo Night gutter and guides
          "editorGutter.background": "#1a1b26",
          "editorIndentGuide.background": "#2a2e42",
          "editorIndentGuide.activeBackground": "#3b4261",
          "editorRuler.foreground": "#2a2e42",

          // Tokyo Night scrollbar - subtle
          "scrollbar.shadow": "#16161e",
          "scrollbarSlider.background": "#2a2e4266",
          "scrollbarSlider.hoverBackground": "#3b426166",
          "scrollbarSlider.activeBackground": "#565f8999",

          // Tokyo Night find widget
          "editorWidget.background": "#16161e",
          "editorWidget.border": "#2a2e42",
          "editorWidget.foreground": "#a9b1d6",

          // Tokyo Night minimap
          "minimap.background": "#1a1b26",
          "minimap.selectionHighlight": "#28344a",
          "minimapSlider.background": "#2a2e4266",
          "minimapSlider.hoverBackground": "#3b426166",
          "minimapSlider.activeBackground": "#565f8999",

          // Tokyo Night bracket matching - subtle
          "editorBracketMatch.background": "#9d7cd820",
          "editorBracketMatch.border": "#9d7cd8",

          // Tokyo Night selection and word highlighting - very subtle
          "editor.wordHighlightBackground": "#2a2e4240",
          "editor.wordHighlightStrongBackground": "#3b426140",
          "editor.selectionHighlightBackground": "#28344a60",

          // Tokyo Night suggestion widget
          "editorSuggestWidget.background": "#16161e",
          "editorSuggestWidget.border": "#2a2e42",
          "editorSuggestWidget.foreground": "#a9b1d6",
          "editorSuggestWidget.selectedBackground": "#24283b",
          "editorSuggestWidget.highlightForeground": "#7aa2f7",

          // Tokyo Night hover widget
          "editorHoverWidget.background": "#16161e",
          "editorHoverWidget.border": "#2a2e42",
          "editorHoverWidget.foreground": "#a9b1d6",

          // Additional Tokyo Night improvements
          "editorOverviewRuler.background": "#1a1b26",
          "editorOverviewRuler.border": "#16161e",
          "editorOverviewRuler.findMatchForeground": "#7aa2f7",
          "editorOverviewRuler.rangeHighlightForeground": "#9ece6a",

          // Focus border
          focusBorder: "#7aa2f7",

          // Error and warning colors
          "editorError.foreground": "#f7768e",
          "editorWarning.foreground": "#e0af68",
          "editorInfo.foreground": "#7dcfff",
        },
      });

      setIsReady(true);
    }
  }, [monaco]);

  return { isReady };
};

export default useEnigmaEditor;
