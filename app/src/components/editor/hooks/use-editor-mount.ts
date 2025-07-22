import { useCallback, useRef, useState } from "react";
import { editor } from "monaco-editor";
import { useMobile } from "@/hooks/use-mobile";
import { HightLightFn, useEditorHighlighting } from "./use-editor-highlighting";
import { Monaco } from "@monaco-editor/react";

interface UseEditorMountProps {
  onHighlightingReady?: (highlightRange: HightLightFn) => void;
  onEditorMount?: (editor: editor.IStandaloneCodeEditor) => void;
  monaco: Monaco | null;
}

export const useEditorMount = ({
  onHighlightingReady,
  onEditorMount,
  monaco,
}: UseEditorMountProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isMobile } = useMobile();

  const { highlightRange, clearHighlight, setEditorInstance } =
    useEditorHighlighting();

  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;
      setIsLoading(false);

      setEditorInstance(editor);
      if (onHighlightingReady) {
        onHighlightingReady(highlightRange);
      }

      if (onEditorMount) {
        onEditorMount(editor);
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
        glyphMargin: true,
        lineNumbers: "on",
        lineNumbersMinChars: 3,
        folding: true,
        foldingStrategy: "indentation",
        showFoldingControls: "mouseover",
      });

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

        editor.addCommand(monaco.KeyCode.Escape, () => {
          clearHighlight();
        });
      }

      const updateDimensions = () => {
        const layout = editor.getLayoutInfo();
        console.log("📐 Editor layout updated:", {
          width: layout.width,
          height: layout.height,
          contentWidth: layout.contentWidth,
          contentHeight: layout.height,
        });
      };

      editor.onDidLayoutChange(updateDimensions);
      updateDimensions();

      if (!isMobile) {
        setTimeout(() => {
          editor.focus();
        }, 100);
      }
    },
    [
      monaco,
      setEditorInstance,
      onHighlightingReady,
      onEditorMount,
      highlightRange,
      clearHighlight,
      isMobile,
    ]
  );

  return {
    editorRef,
    isLoading,
    handleEditorDidMount,
    highlightRange,
    clearHighlight,
  };
};
