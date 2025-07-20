import React, { useCallback, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useMonaco } from "@monaco-editor/react";
import { Loader2, Code2, Zap, FileText } from "lucide-react";
import useEnigmaEditor from "../hooks/use-enigma-editor";
interface EnhancedEnigmaEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  className?: string;
}

const sampleCode = `// Welcome to Enhanced Enigma Editor! ✨
// This editor features advanced syntax highlighting, smart completions, and beautiful visuals

let fibonacci = fn(n) {
  if (n < 2) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
};

// Calculate fibonacci sequence
let numbers = range(0, 10);
for (let i = 0; i < len(numbers); i = i + 1) {
  let result = fibonacci(numbers[i]);
  println(f"fibonacci({numbers[i]}) = {result}");
}

// Working with arrays and strings
let fruits = ["apple", "banana", "cherry"];
let message = f"We have {len(fruits)} fruits: {join(fruits, ", ")}";
println(message);

// Hash operations
let person = {"name": "Alice", "age": 30, "city": "Tokyo"};
let keys_list = keys(person);
println(f"Person keys: {join(keys_list, ", ")}");
`;

const EnhancedEnigmaEditor: React.FC<EnhancedEnigmaEditorProps> = ({
  code,
  onCodeChange,
  className = "",
}) => {
  const { isReady } = useEnigmaEditor();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const monaco = useMonaco();

  // Enhanced responsive configuration
  const getResponsiveConfig = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

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
  }, []);

  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;
      setIsLoading(false);

      if (!code) {
        onCodeChange(sampleCode);
      }

      editor.updateOptions({
        theme: "enigma-enhanced",
        renderLineHighlight: "all",
        cursorBlinking: "expand",
        cursorSmoothCaretAnimation: "on",
        cursorWidth: 2,
        cursorStyle: "line",
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: "active",
          bracketPairsHorizontal: "active",
          highlightActiveBracketPair: true,
          indentation: true,
          highlightActiveIndentation: true,
        },
        smoothScrolling: true,
        mouseWheelScrollSensitivity: 1,
        fastScrollSensitivity: 5,
        multiCursorModifier: "ctrlCmd",
        wordBasedSuggestions: "currentDocument",
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true,
        },
        parameterHints: {
          enabled: true,
          cycle: true,
        },
        hover: {
          enabled: true,
          delay: 300,
          sticky: true,
        },
        suggest: {
          showKeywords: true,
          showSnippets: true,
          showFunctions: true,
          showConstructors: true,
          showFields: true,
          showVariables: true,
          showClasses: true,
          showStructs: true,
          showInterfaces: true,
          showModules: true,
          showProperties: true,
          showEvents: true,
          showOperators: true,
          showUnits: true,
          showValues: true,
          showConstants: true,
          showEnums: true,
          showEnumMembers: true,
          showColors: true,
          showFiles: true,
          showReferences: true,
          showFolders: true,
          showTypeParameters: true,
          showIssues: true,
          showUsers: true,
          insertMode: "replace",
        },
      });

      // Enhanced keyboard shortcuts
      if (monaco) {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
          editor.trigger("", "actions.find", null);
        });
      }

      if (monaco) {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
          editor.trigger("", "editor.action.startFindReplaceAction", null);
        });
      }

      if (monaco) {
        editor.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
          () => {
            editor.trigger("", "editor.action.quickCommand", null);
          }
        );
      }

      // Dimension tracking
      const updateDimensions = () => {
        // const layout = editor.getLayoutInfo();
        // setEditorDimensions({ width: layout.width, height: layout.height });
      };

      editor.onDidLayoutChange(updateDimensions);
      updateDimensions();

      // Auto-focus (desktop only)
      if (window.innerWidth >= 768) {
        setTimeout(() => editor.focus(), 100);
      }
    },
    [code, onCodeChange, monaco]
  );

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        onCodeChange(value);
      }
    },
    [onCodeChange]
  );

  const responsiveConfig = getResponsiveConfig();

  if (!isReady) {
    return (
      <div
        className={`h-full w-full flex items-center justify-center bg-[#0d1117] ${className}`}
      >
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <p className="text-gray-400 text-sm">Loading Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* Enhanced Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#0d1117] flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Code2 className="h-12 w-12 text-purple-400 animate-pulse" />
              <Zap className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              Initializing Editor...
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Editor */}
      <div className="h-full w-full relative">
        <MonacoEditor
          className="h-full"
          value={code}
          language="enigma"
          theme="enigma-enhanced"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          loading={
            <div className="h-full w-full flex items-center justify-center bg-[#0d1117]">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-blue-400" />
                <span className="text-gray-400">Preparing editor...</span>
              </div>
            </div>
          }
          options={{
            // Enhanced visual settings
            fontSize: responsiveConfig.fontSize,
            lineHeight: responsiveConfig.lineHeight,
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Menlo, Monaco, 'Courier New', monospace",
            fontLigatures: true,
            fontWeight: "400",
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
            ...(window.innerWidth < 768 && {
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
      </div>
    </div>
  );
};

export default EnhancedEnigmaEditor;
