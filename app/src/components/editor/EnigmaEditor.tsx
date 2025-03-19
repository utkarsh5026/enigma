import React, { useEffect, useMemo } from "react";
import { getKeywords } from "../../lang/token/token";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

interface EnigmaEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

const sampleCode = `// Sample Enigma code
let fibonacci = fn(n) {
  if (n < 2) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
};

let result = fibonacci(10);
`;

/**
 * EnigmaEditor Component
 *
 * This component renders a Monaco Editor instance configured for the Enigma programming language.
 * It provides syntax highlighting, code completion, and a dark theme for an enhanced coding experience.
 *
 * Props:
 * - code: string - The current code to be displayed in the editor.
 * - onCodeChange: function - Callback function that is called when the code changes. It receives the updated code as a parameter.
 *
 * Usage:
 * <EnigmaEditor code={yourCode} onCodeChange={handleCodeChange} />
 *
 * The component uses the Monaco Editor library to provide a rich code editing experience. It registers
 * the Enigma language, defines its syntax highlighting rules, and sets up code completion items.
 *
 * The editor supports various features such as:
 * - Syntax highlighting for keywords, types, operators, and comments.
 * - Code snippets for common constructs like if-else statements, while loops, functions, and variable declarations.
 * - A customizable dark theme that mimics the GitHub dark theme.
 *
 * The editor also handles user interactions, such as focusing the editor and updating the code state
 * when the content changes.
 */
const EnigmaEditor: React.FC<EnigmaEditorProps> = ({ code, onCodeChange }) => {
  const monaco = useMonaco();
  const keywords = useMemo(() => getKeywords(), []);

  useEffect(() => {
    if (monaco) {
      // Register the Enigma language with Monaco
      monaco.languages.register({ id: "enigma" });

      // Define the syntax highlighting rules for the Enigma language
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

      // Register a completion item provider for the Enigma language
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

  // Pre-defined code samples for demonstration

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    if (!code) {
      onCodeChange(sampleCode);
    }

    editor.updateOptions({
      renderLineHighlight: "all",
      cursorBlinking: "phase",
      cursorSmoothCaretAnimation: "on",
      theme: "enigmaDark",
    });

    // Focus the editor
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onCodeChange(value);
    }
  };

  return (
    <div className="h-full w-full">
      <MonacoEditor
        className="h-full"
        value={code}
        language="enigma"
        theme="enigmaDark"
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily:
            "'Cascadia Code', Menlo, Monaco, 'Courier New', monospace",
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
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            verticalSliderSize: 10,
            horizontalSliderSize: 10,
          },
          overviewRulerBorder: false, // Hide the overview ruler border
          hideCursorInOverviewRuler: true, // Hide the cursor in the overview ruler
          renderLineHighlight: "line",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          contextmenu: true,
          roundedSelection: true,
          renderControlCharacters: true,
          renderWhitespace: "none",
          links: true,
        }}
      />
    </div>
  );
};

export default EnigmaEditor;
