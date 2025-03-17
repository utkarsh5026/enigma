import React, { useEffect, useMemo } from "react";
import { getKeywords } from "../lang/token/token";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
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

      // Define the cyberpunk-inspired theme
      monaco.editor.defineTheme("enigmaDark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "ff7b72" }, // red tone
          { token: "identifier", foreground: "d2a8ff" }, // purple tone
          { token: "type", foreground: "79c0ff" }, // blue tone
          { token: "number", foreground: "f2cc60" }, // yellow tone
          { token: "string", foreground: "a5d6ff" }, // light blue tone
          { token: "comment", foreground: "8b949e", fontStyle: "italic" },
          { token: "operator", foreground: "ff7b72" }, // red tone
          { token: "delimiter", foreground: "8b949e" },
          { token: "brackets", foreground: "8b949e" },
        ],
        colors: {
          "editor.background": "#0d1117", // Dark background
          "editor.foreground": "#e6edf3", // Light text
          "editorCursor.foreground": "#4d9375", // Green cursor
          "editor.lineHighlightBackground": "#161b22", // Slightly lighter for line highlight
          "editor.selectionBackground": "#3b4149", // Selection color
          "editorLineNumber.foreground": "#484f58", // Line number color
          "editorLineNumber.activeForeground": "#8b949e", // Active line number
          "editorIndentGuide.background": "#21262d", // Indent guide
          "editorIndentGuide.activeBackground": "#30363d", // Active indent guide
          "editorGutter.background": "#0d1117", // Gutter background
          "editor.inactiveSelectionBackground": "#272e38", // Inactive selection
        },
      });
    }
  }, [monaco, keywords]);

  // Pre-defined code samples for demonstration
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

  const handleEditorDidMount = (editor: any) => {
    // Set initial value if code is empty
    if (!code) {
      onCodeChange(sampleCode);
    }

    // Setup editor
    editor.updateOptions({
      renderLineHighlight: "all",
      cursorBlinking: "phase",
      cursorSmoothCaretAnimation: "on",
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
          renderIndentGuides: true,
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
