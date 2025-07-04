import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useMonacoEditor } from "../hooks/use-monaco-editor";
import { useMobile } from "@/hooks/use-mobile";

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
 * Now includes mobile-responsive features for better usability on different screen sizes.
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
 * - Mobile-responsive design that adapts to different screen sizes.
 *
 * The editor also handles user interactions, such as focusing the editor and updating the code state
 * when the content changes.
 */
const EnigmaEditor: React.FC<EnigmaEditorProps> = ({ code, onCodeChange }) => {
  const { isMobile, isTablet } = useMobile();

  useMonacoEditor();

  // Responsive configuration
  const getResponsiveConfig = () => {
    if (isMobile) {
      return {
        fontSize: 14,
        padding: { top: 8, bottom: 8 },
        lineNumbers: "off" as const,
        glyphMargin: false,
        scrollbar: {
          vertical: "visible" as const,
          horizontal: "visible" as const,
          verticalScrollbarSize: 14,
          horizontalScrollbarSize: 14,
          verticalSliderSize: 14,
          horizontalSliderSize: 14,
        },
      };
    } else if (isTablet) {
      return {
        fontSize: 16,
        padding: { top: 12, bottom: 12 },
        lineNumbers: "on" as const,
        glyphMargin: true,
        scrollbar: {
          vertical: "visible" as const,
          horizontal: "visible" as const,
          verticalScrollbarSize: 12,
          horizontalScrollbarSize: 12,
          verticalSliderSize: 12,
          horizontalSliderSize: 12,
        },
      };
    } else {
      return {
        fontSize: 20,
        padding: { top: 16, bottom: 16 },
        lineNumbers: "on" as const,
        glyphMargin: true,
        scrollbar: {
          vertical: "visible" as const,
          horizontal: "visible" as const,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
          verticalSliderSize: 10,
          horizontalSliderSize: 10,
        },
      };
    }
  };

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

    // Focus the editor only on desktop to avoid virtual keyboard issues on mobile
    if (!isMobile) {
      editor.focus();
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onCodeChange(value);
    }
  };

  const responsiveConfig = getResponsiveConfig();

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
          minimap: { enabled: !isMobile }, // Disable minimap on mobile
          fontSize: responsiveConfig.fontSize,
          fontFamily:
            "'Source Code Pro', Menlo, Monaco, 'Courier New', monospace",
          fontLigatures: true,
          lineNumbers: responsiveConfig.lineNumbers,
          tabSize: 2,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          padding: responsiveConfig.padding,
          glyphMargin: responsiveConfig.glyphMargin,
          scrollbar: responsiveConfig.scrollbar,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          renderLineHighlight: "line",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          contextmenu: !isMobile, // Disable context menu on mobile to avoid conflicts
          roundedSelection: true,
          renderControlCharacters: !isMobile, // Simplify on mobile
          renderWhitespace: "none",
          links: true,
          // Mobile-specific optimizations
          ...(isMobile && {
            acceptSuggestionOnEnter: "off", // Prevent accidental accepts on mobile
            quickSuggestions: false, // Disable quick suggestions on mobile
            suggestOnTriggerCharacters: false,
            wordBasedSuggestions: "off",
            parameterHints: { enabled: false },
            hover: { enabled: false },
            occurrencesHighlight: "off",
            selectionHighlight: false,
            codeLens: false,
            folding: false,
            foldingHighlight: false,
            unfoldOnClickAfterEndOfLine: false,
            showFoldingControls: "never",
          }),
          // Tablet-specific optimizations
          ...(isTablet && {
            acceptSuggestionOnEnter: "smart",
            quickSuggestions: { other: true, comments: false, strings: false },
            suggestOnTriggerCharacters: true,
            wordBasedSuggestions: "currentDocument",
            parameterHints: { enabled: true },
            hover: { enabled: true },
            occurrencesHighlight: "singleFile",
            selectionHighlight: true,
            codeLens: false,
            folding: true,
            foldingHighlight: true,
          }),
        }}
      />
    </div>
  );
};

export default EnigmaEditor;
