import React, { useMemo } from "react";
import MonacoEditor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { FileText } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

interface CustomEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  handleEditorDidMount: (editor: editor.IStandaloneCodeEditor) => void;
  handleEditorChange: (value: string | undefined) => void;
}

const CustomEditor: React.FC<CustomEditorProps> = ({
  code,
  handleEditorDidMount,
  handleEditorChange,
}) => {
  const { isTablet, isMobile } = useMobile();

  const responsiveConfig = useMemo(() => {
    if (isMobile) {
      return {
        fontSize: 14,
        lineHeight: 20,
        padding: { top: 12, bottom: 12, left: 8, right: 8 },
        lineNumbers: "off" as const,
        minimap: { enabled: false },
        folding: false,
        wordWrap: "on" as const,
      };
    } else if (isTablet) {
      return {
        fontSize: 16,
        lineHeight: 24,
        padding: { top: 16, bottom: 16, left: 12, right: 12 },
        lineNumbers: "on" as const,
        minimap: { enabled: true },
        folding: true,
        wordWrap: "on" as const,
      };
    } else {
      return {
        fontSize: 16,
        lineHeight: 28,
        padding: { top: 20, bottom: 20, left: 16, right: 16 },
        lineNumbers: "on" as const,
        minimap: { enabled: true },
        folding: true,
        wordWrap: "on" as const,
      };
    }
  }, [isMobile, isTablet]);

  return (
    <MonacoEditor
      className="h-full"
      value={code}
      language="enigma"
      theme="enigma-enhanced"
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      loading={
        <div className="flex h-full w-full items-center justify-center bg-tokyo-bg-dark">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-tokyo-blue" />
            <span className="text-tokyo-fg-dark">Preparing editor...</span>
          </div>
        </div>
      }
      options={{
        // Enhanced visual settings
        fontSize: responsiveConfig.fontSize,
        lineHeight: responsiveConfig.lineHeight,
        fontFamily:
          "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'SF Mono', Menlo, Monaco, 'Courier New', monospace",
        fontLigatures: true,
        fontWeight: "300",
        letterSpacing: 0.5,

        // Enhanced layout
        lineNumbers: responsiveConfig.lineNumbers,
        lineNumbersMinChars: 4,
        lineDecorationsWidth: 10,
        tabSize: 2,
        insertSpaces: true,
        detectIndentation: false,
        scrollBeyondLastLine: false,
        scrollBeyondLastColumn: 5,
        automaticLayout: true,
        wordWrap: responsiveConfig.wordWrap,
        wordWrapColumn: 120,
        wrappingIndent: "indent",
        padding: responsiveConfig.padding,

        // Enhanced minimap
        minimap: {
          enabled: responsiveConfig.minimap.enabled,
          side: "right",
          size: "proportional",
          showSlider: "always",
          renderCharacters: true,
          maxColumn: 120,
          scale: 1,
        },

        // Enhanced scrollbar
        scrollbar: {
          vertical: "visible",
          horizontal: "visible",
          verticalScrollbarSize: 14,
          horizontalScrollbarSize: 14,
          verticalSliderSize: 14,
          horizontalSliderSize: 14,
          arrowSize: 11,
          useShadows: true,
          verticalHasArrows: false,
          horizontalHasArrows: false,
          alwaysConsumeMouseWheel: false,
          handleMouseWheel: true,
        },

        // Enhanced visual features
        overviewRulerBorder: false,
        overviewRulerLanes: 3,
        hideCursorInOverviewRuler: false,
        renderLineHighlight: "all",
        renderLineHighlightOnlyWhenFocus: false,
        smoothScrolling: true,
        cursorBlinking: "expand",
        cursorSmoothCaretAnimation: "on",
        cursorWidth: 2,
        cursorStyle: "line",
        contextmenu: window.innerWidth >= 768,
        roundedSelection: true,
        renderControlCharacters: false,
        renderWhitespace: "selection",
        renderFinalNewline: "on",

        // Enhanced links and decorators
        links: true,
        colorDecorators: true,

        // Enhanced bracket features
        bracketPairColorization: {
          enabled: true,
          independentColorPoolPerBracketType: true,
        },
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
        folding: responsiveConfig.folding,
        foldingHighlight: true,
        foldingStrategy: "indentation",
        showFoldingControls: "mouseover",
        unfoldOnClickAfterEndOfLine: false,
        selectOnLineNumbers: true,

        // Enhanced suggestions and IntelliSense
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true,
        },
        quickSuggestionsDelay: 100,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: "on",
        wordBasedSuggestions: "currentDocument",
        suggestSelection: "first",
        tabCompletion: "on",

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
          loop: true,
        },

        // Performance optimizations
        stopRenderingLineAfter: 10000,
        mouseWheelScrollSensitivity: 1,
        fastScrollSensitivity: 5,
        multiCursorModifier: "ctrlCmd",
        multiCursorMergeOverlapping: true,
        accessibilitySupport: "auto",
        unicodeHighlight: {
          nonBasicASCII: false,
          invisibleCharacters: true,
          ambiguousCharacters: true,
        },

        // Enhanced formatting
        formatOnPaste: true,
        formatOnType: true,
        autoIndent: "full",
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        autoSurround: "languageDefined",

        // Enhanced drag and drop
        dragAndDrop: true,
        dropIntoEditor: { enabled: true },

        // Enhanced performance for large files
        largeFileOptimizations: true,

        // Mobile optimizations
        ...(isMobile && {
          acceptSuggestionOnEnter: "off",
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          wordBasedSuggestions: "off",
          parameterHints: { enabled: false },
          hover: { enabled: false },
          occurrencesHighlight: "off",
          selectionHighlight: false,
          contextmenu: false,
        }),
      }}
    />
  );
};

export default CustomEditor;
