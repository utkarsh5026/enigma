import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useMonacoEditor } from "../hooks/use-monaco-editor";

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
  useMonacoEditor();

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
