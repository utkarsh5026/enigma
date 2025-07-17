import { getKeywords } from "@/lang/token/token";
import {
  getAllBuiltinNames,
  getBuiltinsByCategory,
} from "@/lang/exec/builtins/functions";
import { useMonaco } from "@monaco-editor/react";
import { useEffect, useMemo } from "react";

export const useMonacoEditor = () => {
  const monaco = useMonaco();
  const keywords = useMemo(() => getKeywords(), []);
  const builtinNames = useMemo(() => getAllBuiltinNames(), []);
  const builtinsByCategory = useMemo(() => getBuiltinsByCategory(), []);

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: "enigma" });

      monaco.languages.setMonarchTokensProvider("enigma", {
        keywords,
        typeKeywords: ["int", "string", "bool", "array"],
        builtins: builtinNames, // Add built-ins to the tokenizer
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
            // Keywords
            ...keywords.map((keyword) => ({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword,
              range,
            })),

            // Built-in functions with signatures
            ...getBuiltinCompletionItems(monaco, range),

            // Code snippets
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
          { token: "keyword", foreground: "569cd6" }, // VS Code blue for keywords
          { token: "identifier", foreground: "d4d4d4" }, // VS Code default text color
          { token: "type", foreground: "4ec9b0" }, // VS Code teal for types
          { token: "number", foreground: "b5cea8" }, // VS Code light green for numbers
          { token: "string", foreground: "ce9178" }, // VS Code orange/peach for strings
          { token: "comment", foreground: "6a9955", fontStyle: "italic" }, // VS Code green for comments
          { token: "operator", foreground: "d4d4d4" }, // VS Code default text for operators
          { token: "delimiter", foreground: "d4d4d4" }, // VS Code default text for delimiters
          { token: "brackets", foreground: "d4d4d4" }, // VS Code default text for brackets
          { token: "builtin.function", foreground: "dcdcaa" }, // VS Code yellow for built-in functions
        ],
        colors: {
          "editor.background": "#1e1e1e", // VS Code background
          "editor.foreground": "#d4d4d4", // VS Code default text
          "editorCursor.foreground": "#aeafad", // VS Code cursor
          "editor.lineHighlightBackground": "#2a2d2e", // VS Code line highlight
          "editor.selectionBackground": "#264f78", // VS Code selection
          "editorLineNumber.foreground": "#858585", // VS Code line number
          "editorLineNumber.activeForeground": "#c6c6c6", // VS Code active line number
          "editorIndentGuide.background": "#404040", // VS Code indent guide
          "editorIndentGuide.activeBackground": "#707070", // VS Code active indent guide
          "editorGutter.background": "#1e1e1e", // VS Code gutter
          "editor.inactiveSelectionBackground": "#3a3d41", // VS Code inactive selection
        },
      });
    }
  }, [monaco, keywords, builtinNames, builtinsByCategory]);
};

// Helper function to create completion items for built-in functions
function getBuiltinCompletionItems(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  monaco: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  range: any
) {
  const functionSignatures: Record<
    string,
    { params: string; description: string }
  > = {
    // Core Data Operations
    len: {
      params: "(obj)",
      description: "Returns the length of arrays, strings, or hash objects",
    },
    type: {
      params: "(obj)",
      description: "Returns the type of an object as a string",
    },
    str: {
      params: "(obj)",
      description: "Converts any value to its string representation",
    },
    int: {
      params: "(str)",
      description: "Converts a string or number to an integer",
    },
    bool: { params: "(obj)", description: "Converts any value to boolean" },

    // Array Operations
    first: {
      params: "(array)",
      description: "Returns the first element of an array",
    },
    last: {
      params: "(array)",
      description: "Returns the last element of an array",
    },
    rest: {
      params: "(array)",
      description: "Returns a new array with all elements except the first",
    },
    push: {
      params: "(array, element)",
      description: "Returns a new array with the element added to the end",
    },
    pop: {
      params: "(array)",
      description: "Returns a new array with the last element removed",
    },
    slice: {
      params: "(array, start, end?)",
      description: "Returns a portion of the array",
    },
    concat: {
      params: "(array1, array2)",
      description: "Concatenates two arrays",
    },
    reverse: {
      params: "(array)",
      description: "Returns a new array with elements in reverse order",
    },
    join: {
      params: "(array, separator?)",
      description: "Joins array elements into a string",
    },

    // String Operations
    split: {
      params: "(string, delimiter)",
      description: "Splits a string by delimiter",
    },
    replace: {
      params: "(string, search, replace)",
      description: "Replace occurrences in string",
    },
    trim: {
      params: "(string)",
      description: "Remove whitespace from both ends",
    },
    upper: { params: "(string)", description: "Convert to uppercase" },
    lower: { params: "(string)", description: "Convert to lowercase" },
    substr: {
      params: "(string, start, length?)",
      description: "Extract substring",
    },
    indexOf: {
      params: "(string, substring)",
      description: "Find index of substring",
    },
    contains: {
      params: "(string, substring)",
      description: "Check if string contains substring",
    },

    // Mathematical Operations
    abs: { params: "(number)", description: "Absolute value" },
    max: { params: "(...numbers)", description: "Maximum value" },
    min: { params: "(...numbers)", description: "Minimum value" },
    round: { params: "(number)", description: "Round to nearest integer" },
    floor: { params: "(number)", description: "Round down to integer" },
    ceil: { params: "(number)", description: "Round up to integer" },
    pow: { params: "(base, exponent)", description: "Power function" },
    sqrt: { params: "(number)", description: "Square root" },
    random: { params: "(max?)", description: "Random number" },

    // I/O Operations
    print: { params: "(...args)", description: "Print values to console" },
    println: { params: "(...args)", description: "Print values with newline" },

    // Utility Functions
    range: {
      params: "(start, end?, step?)",
      description: "Generate range of numbers",
    },
    keys: { params: "(hash)", description: "Get all keys from hash object" },
    values: {
      params: "(hash)",
      description: "Get all values from hash object",
    },

    // Error Handling
    error: { params: "(message)", description: "Create an error object" },
    assert: {
      params: "(condition, message?)",
      description: "Assert condition is true",
    },
  };

  return Object.entries(functionSignatures).map(
    ([name, { params, description }]) => ({
      label: name,
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: `${name}(${params.includes("...") ? "" : "$1"})`,
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: {
        value: `**${name}${params}**\n\n${description}`,
        isTrusted: true,
      },
      detail: `${name}${params}`,
      range,
    })
  );
}

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
