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
          className={`flex h-full w-full items-center justify-center bg-[var(--tokyo-bg-dark)] ${className}`}
        >
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--tokyo-purple)]" />
            <p className="text-sm text-[var(--tokyo-fg-dark)]">
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
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--tokyo-bg-dark)] transition-opacity duration-300">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Code2 className="h-12 w-12 animate-pulse text-[var(--tokyo-purple)]" />
                <Zap className="absolute -top-1 -right-1 h-6 w-6 animate-bounce text-[var(--tokyo-yellow)]" />
              </div>
              <p className="text-sm font-medium text-[var(--tokyo-fg-dark)]">
                Initializing Enhanced Editor...
              </p>
              <div className="text-xs text-[var(--tokyo-comment)]">
                Setting up direct positioning and debugging tools
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Editor with Debug Support */}
        <div className="relative h-full w-full">
          <CustomEditor
            code={code}
            onCodeChange={onCodeChange}
            handleEditorDidMount={handleEditorDidMount}
            handleEditorChange={handleEditorChange}
          />

          {/* Debug overlay indicator */}
          {!isLoading && (
            <div className="pointer-events-none absolute top-2 right-2 text-xs text-[var(--tokyo-comment)]/50">
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
