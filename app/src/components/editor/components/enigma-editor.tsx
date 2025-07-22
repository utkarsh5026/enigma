/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useImperativeHandle, forwardRef } from "react";
import { editor } from "monaco-editor";
import { useMonaco } from "@monaco-editor/react";
import { Loader2, Code2, Zap } from "lucide-react";
import useEnigmaEditor from "../hooks/use-enigma-editor";
import type { HightLightFn } from "../hooks/use-editor-highlighting";
import CustomEditor from "./custom-editor";
import "../styles/highlight.css";
import "../styles/overlay.css";
import { useEditorMount } from "../hooks/use-editor-mount";

interface EnhancedEnigmaEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  className?: string;
  onHighlightingReady?: (highlightRange: HightLightFn) => void;
  onEditorMount?: (editor: editor.IStandaloneCodeEditor) => void;
}

export interface EnigmaEditorRef {
  highlightRange: HightLightFn;
  clearHighlight: () => void;
  focus: () => void;
  getEditor: () => editor.IStandaloneCodeEditor | null;
  insertTextAtCursor: (text: string) => void;
  setCursorPosition: (line: number, column: number) => void;
}

const EnigmaEditor = forwardRef<EnigmaEditorRef, EnhancedEnigmaEditorProps>(
  (
    { code, onCodeChange, className = "", onHighlightingReady, onEditorMount },
    ref
  ) => {
    const { isReady } = useEnigmaEditor();
    const monaco = useMonaco();

    const {
      editorRef,
      isLoading,
      handleEditorDidMount,
      highlightRange,
      clearHighlight,
    } = useEditorMount({
      onHighlightingReady,
      onEditorMount,
      monaco,
    });

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
        getEditor: () => editorRef.current,
        insertTextAtCursor: (text: string) => {
          if (editorRef.current) {
            const position = editorRef.current.getPosition();
            if (position) {
              editorRef.current.executeEdits("", [
                {
                  range: new (window as any).monaco.Range(
                    position.lineNumber,
                    position.column,
                    position.lineNumber,
                    position.column
                  ),
                  text,
                  forceMoveMarkers: true,
                },
              ]);
            }
          }
        },
        setCursorPosition: (line: number, column: number) => {
          if (editorRef.current) {
            editorRef.current.setPosition({ lineNumber: line, column });
            editorRef.current.revealLineInCenter(line);
          }
        },
      }),
      [highlightRange, clearHighlight, editorRef]
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
          className={`h-full w-full flex items-center justify-center bg-[var(--tokyo-bg-dark)] ${className}`}
        >
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--tokyo-purple)]" />
            <p className="text-[var(--tokyo-fg-dark)] text-sm">
              Loading Editor...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={`relative h-full w-full ${className}`}>
        {/* Enhanced Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[var(--tokyo-bg-dark)] flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Code2 className="h-12 w-12 text-[var(--tokyo-purple)] animate-pulse" />
                <Zap className="h-6 w-6 text-[var(--tokyo-yellow)] absolute -top-1 -right-1 animate-bounce" />
              </div>
              <p className="text-[var(--tokyo-fg-dark)] text-sm font-medium">
                Initializing Enhanced Editor...
              </p>
              <div className="text-xs text-[var(--tokyo-comment)]">
                Setting up direct positioning and debugging tools
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Editor with Debug Support */}
        <div className="h-full w-full relative">
          <CustomEditor
            code={code}
            onCodeChange={onCodeChange}
            handleEditorDidMount={handleEditorDidMount}
            handleEditorChange={handleEditorChange}
          />

          {/* Debug overlay indicator */}
          {!isLoading && (
            <div className="absolute top-2 right-2 text-xs text-[var(--tokyo-comment)]/50 pointer-events-none">
              Enhanced Debug Mode
            </div>
          )}
        </div>
      </div>
    );
  }
);

EnigmaEditor.displayName = "EnigmaEditor";

export default EnigmaEditor;
