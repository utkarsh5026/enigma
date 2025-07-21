import {
  useCallback,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { editor } from "monaco-editor";
import { useMonaco } from "@monaco-editor/react";
import { Loader2, Code2, Zap } from "lucide-react";
import useEnigmaEditor from "../hooks/use-enigma-editor";
import { useEditorHighlighting } from "../hooks/use-editor-highlighting";
import CustomEditor from "./custom-editor";

interface EnhancedEnigmaEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  className?: string;
  onHighlightingReady?: (
    highlightFn: (
      line: number,
      column: number,
      endLine?: number,
      endColumn?: number
    ) => void
  ) => void;
}

export interface EnigmaEditorRef {
  highlightRange: (
    line: number,
    column: number,
    endLine?: number,
    endColumn?: number
  ) => void;
  clearHighlight: () => void;
  focus: () => void;
}

const EnigmaEditor = forwardRef<EnigmaEditorRef, EnhancedEnigmaEditorProps>(
  ({ code, onCodeChange, className = "", onHighlightingReady }, ref) => {
    const { isReady } = useEnigmaEditor();
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const monaco = useMonaco();

    // Use the highlighting hook
    const { highlightRange, clearHighlight, setEditorInstance } =
      useEditorHighlighting();

    // Expose highlighting functions via ref
    useImperativeHandle(
      ref,
      () => ({
        highlightRange,
        clearHighlight,
        focus: () => {
          if (editorRef.current) {
            editorRef.current.focus();
          }
        },
      }),
      [highlightRange, clearHighlight]
    );

    const handleEditorDidMount = useCallback(
      (editor: editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
        setIsLoading(false);

        // Set up the highlighting functionality
        setEditorInstance(editor);

        // Notify parent that highlighting is ready
        if (onHighlightingReady) {
          onHighlightingReady(highlightRange);
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

          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
            editor.trigger("", "editor.action.startFindReplaceAction", null);
          });

          editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
            () => {
              editor.trigger("", "editor.action.quickCommand", null);
            }
          );

          // Add custom command for clearing highlights
          editor.addCommand(monaco.KeyCode.Escape, () => {
            clearHighlight();
          });
        }

        // Dimension tracking
        const updateDimensions = () => {
          // const layout = editor.getLayoutInfo();
          // Additional logic if needed
        };

        editor.onDidLayoutChange(updateDimensions);
        updateDimensions();

        // Auto-focus (desktop only)
        if (window.innerWidth >= 768) {
          setTimeout(() => editor.focus(), 100);
        }

        console.log("EnigmaEditor: Highlighting functionality ready");
      },
      [
        monaco,
        setEditorInstance,
        onHighlightingReady,
        highlightRange,
        clearHighlight,
      ]
    );

    const handleEditorChange = useCallback(
      (value: string | undefined) => {
        if (value !== undefined) {
          onCodeChange(value);
        }
      },
      [onCodeChange]
    );

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
          <CustomEditor
            code={code}
            onCodeChange={onCodeChange}
            handleEditorDidMount={handleEditorDidMount}
            handleEditorChange={handleEditorChange}
          />
        </div>
      </div>
    );
  }
);

EnigmaEditor.displayName = "EnigmaEditor";

export default EnigmaEditor;
