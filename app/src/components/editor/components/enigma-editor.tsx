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

  // Enhanced responsive configuration
  const getResponsiveConfig = () => {
    if (isMobile) {
      return {
        fontSize: 14,
        lineHeight: 20,
        padding: { top: 12, bottom: 12, left: 8, right: 8 },
        lineNumbers: "off" as const,
        glyphMargin: false,
        scrollbar: {
          vertical: "visible" as const,
          horizontal: "visible" as const,
          verticalScrollbarSize: 16,
          horizontalScrollbarSize: 16,
          verticalSliderSize: 16,
          horizontalSliderSize: 16,
          arrowSize: 11,
        },
      };
    } else if (isTablet) {
      return {
        fontSize: 16,
        lineHeight: 24,
        padding: { top: 16, bottom: 16, left: 12, right: 12 },
        lineNumbers: "on" as const,
        glyphMargin: true,
        scrollbar: {
          vertical: "visible" as const,
          horizontal: "visible" as const,
          verticalScrollbarSize: 14,
          horizontalScrollbarSize: 14,
          verticalSliderSize: 14,
          horizontalSliderSize: 14,
          arrowSize: 10,
        },
      };
    } else {
      return {
        fontSize: 18,
        lineHeight: 28,
        padding: { top: 20, bottom: 20, left: 16, right: 16 },
        lineNumbers: "on" as const,
        glyphMargin: true,
        scrollbar: {
          vertical: "visible" as const,
          horizontal: "visible" as const,
          verticalScrollbarSize: 12,
          horizontalScrollbarSize: 12,
          verticalSliderSize: 12,
          horizontalSliderSize: 12,
          arrowSize: 9,
          useShadows: false,
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
      cursorBlinking: "expand",
      cursorSmoothCaretAnimation: "on",
      cursorWidth: 2,
      theme: "enigmaDark",
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        bracketPairsHorizontal: true,
        highlightActiveBracketPair: true,
        indentation: true,
        highlightActiveIndentation: true,
      },
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
    <div className="h-full w-full relative">
      <MonacoEditor
        className="h-full"
        value={code}
        language="enigma"
        theme="enigmaDark"
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          // Enhanced minimap
          minimap: {
            enabled: !isMobile,
            side: "right",
            size: "proportional",
            showSlider: "always",
            renderCharacters: true,
            maxColumn: 120,
          },

          // Enhanced typography
          fontSize: responsiveConfig.fontSize,
          lineHeight: responsiveConfig.lineHeight,
          fontFamily:
            "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Source Code Pro', 'SF Mono', Menlo, Monaco, 'Courier New', monospace",
          fontLigatures: true,
          fontWeight: "400",
          letterSpacing: 0.5,

          // Enhanced layout
          lineNumbers: responsiveConfig.lineNumbers,
          lineNumbersMinChars: 3,
          lineDecorationsWidth: 10,
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false,
          scrollBeyondLastLine: false,
          scrollBeyondLastColumn: 5,
          automaticLayout: true,
          wordWrap: "on",
          wordWrapColumn: 100,
          wrappingIndent: "indent",
          padding: responsiveConfig.padding,
          glyphMargin: responsiveConfig.glyphMargin,

          // Enhanced scrollbar
          scrollbar: {
            ...responsiveConfig.scrollbar,
            alwaysConsumeMouseWheel: false,
            handleMouseWheel: true,
            useShadows: true,
            verticalHasArrows: false,
            horizontalHasArrows: false,
          },

          // Enhanced visual features
          overviewRulerBorder: false,
          overviewRulerLanes: 2,
          hideCursorInOverviewRuler: false,
          renderLineHighlight: "all",
          renderLineHighlightOnlyWhenFocus: false,
          smoothScrolling: true,
          cursorBlinking: "expand",
          cursorSmoothCaretAnimation: "on",
          cursorWidth: 2,
          cursorStyle: "line",
          contextmenu: !isMobile,
          roundedSelection: true,
          renderControlCharacters: false,
          renderWhitespace: "selection",

          links: true,
          colorDecorators: true,

          // Enhanced bracket features
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: "active",
            bracketPairsHorizontal: "active",
            highlightActiveBracketPair: true,
            indentation: true,
            highlightActiveIndentation: true,
          },
          matchBrackets: "always",

          // Enhanced selection and highlighting
          selectionHighlight: true,
          occurrencesHighlight: "singleFile",
          codeLens: false,
          folding: !isMobile,
          foldingHighlight: true,
          foldingStrategy: "indentation",
          showFoldingControls: "mouseover",
          unfoldOnClickAfterEndOfLine: false,

          // Enhanced suggestions and IntelliSense
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
          },
          quickSuggestionsDelay: 100,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnCommitCharacter: true,
          acceptSuggestionOnEnter: "on",
          wordBasedSuggestions: "currentDocument",
          suggestSelection: "first",

          // Enhanced hover and parameter hints
          hover: {
            enabled: true,
            delay: 300,
            sticky: true,
          },
          parameterHints: {
            enabled: true,
            cycle: true,
          },

          // Enhanced find widget
          find: {
            addExtraSpaceOnTop: false,
            autoFindInSelection: "never",
            seedSearchStringFromSelection: "selection",
          },

          // Performance optimizations
          stopRenderingLineAfter: 10000,
          mouseWheelScrollSensitivity: 1,
          fastScrollSensitivity: 5,
          multiCursorModifier: "ctrlCmd",
          multiCursorMergeOverlapping: true,
          accessibilitySupport: "auto",

          // Mobile-specific optimizations
          ...(isMobile && {
            acceptSuggestionOnEnter: "off",
            quickSuggestions: false,
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
            guides: {
              bracketPairs: false,
              bracketPairsHorizontal: false,
              highlightActiveBracketPair: false,
              indentation: false,
              highlightActiveIndentation: false,
            },
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
            guides: {
              bracketPairs: "active",
              bracketPairsHorizontal: false,
              highlightActiveBracketPair: true,
              indentation: true,
              highlightActiveIndentation: true,
            },
          }),
        }}
      />
    </div>
  );
};

export default EnigmaEditor;
