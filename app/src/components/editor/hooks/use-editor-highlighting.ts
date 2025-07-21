/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from "react";
import { editor } from "monaco-editor";
import { Node } from "@/lang/ast";

const HIGHLIGHT_CLASS = "ast-code-highlight";

export interface HighlightPosition {
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
}

export const useEditorHighlighting = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const highlightRange = useCallback(
    (
      startLine: number,
      startColumn: number,
      endLine?: number,
      endColumn?: number,
      duration: number = 3000
    ) => {
      if (!editorRef.current) {
        console.warn("Editor not available for highlighting");
        return;
      }

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Clear previous decorations
      decorationsRef.current = editorRef.current.deltaDecorations(
        decorationsRef.current,
        []
      );

      const model = editorRef.current.getModel();
      if (!model) return;

      // Calculate end position if not provided
      const actualEndLine = endLine || startLine;
      let actualEndColumn = endColumn;

      if (!actualEndColumn) {
        const lineContent = model.getLineContent(startLine);
        const lineLength = lineContent.length;

        // Try to find the end of the current word/token
        let wordEnd = startColumn;

        // If we're at a word character, find the end of the word
        if (
          startColumn <= lineLength &&
          /\w/.test(lineContent[startColumn - 1])
        ) {
          while (wordEnd <= lineLength && /\w/.test(lineContent[wordEnd - 1])) {
            wordEnd++;
          }
        } else {
          while (
            wordEnd <= lineLength &&
            !/[\s()[\]{};,.]/.test(lineContent[wordEnd])
          ) {
            wordEnd++;
          }
        }

        // Ensure we highlight at least something meaningful
        actualEndColumn = Math.max(wordEnd, startColumn + 1);

        // If the word/token is very short, extend the highlight a bit
        if (actualEndColumn - startColumn < 2) {
          actualEndColumn = Math.min(startColumn + 5, lineLength + 1);
        }
      }

      // Create the highlight decoration
      const decoration: editor.IModelDeltaDecoration = {
        range: new (window as any).monaco.Range(
          startLine,
          startColumn,
          actualEndLine,
          actualEndColumn
        ),
        options: {
          className: HIGHLIGHT_CLASS,
          isWholeLine: false,
          minimap: {
            color: "#7aa2f7",
            position: 2,
          },
          overviewRuler: {
            color: "#7aa2f7",
            position: 4,
          },
          glyphMarginClassName: "ast-glyph-highlight",
        },
      };

      // Apply the decoration
      decorationsRef.current = editorRef.current.deltaDecorations(
        [],
        [decoration]
      );

      // Scroll to the highlighted range and center it
      const range = new (window as any).monaco.Range(
        startLine,
        startColumn,
        actualEndLine,
        actualEndColumn
      );
      editorRef.current.revealRangeInCenter(range, 0);

      // Optional: Set cursor position to the highlighted location
      editorRef.current.setPosition({
        lineNumber: startLine,
        column: startColumn,
      });

      // Auto-clear the highlight after the specified duration
      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          if (editorRef.current && decorationsRef.current.length > 0) {
            decorationsRef.current = editorRef.current.deltaDecorations(
              decorationsRef.current,
              []
            );
          }
        }, duration);
      }
    },
    []
  );

  const clearHighlight = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (editorRef.current && decorationsRef.current.length > 0) {
      decorationsRef.current = editorRef.current.deltaDecorations(
        decorationsRef.current,
        []
      );
    }
  }, []);

  const setEditorInstance = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;

      if (!document.getElementById("ast-highlight-styles")) {
        const style = document.createElement("style");
        style.id = "ast-highlight-styles";
        document.head.appendChild(style);
      }
    },
    []
  );

  const highlightNode = useCallback(
    (node: Node, duration?: number) => {
      if (!node || typeof node.position !== "function") {
        console.warn("Invalid node for highlighting:", node);
        return;
      }

      const { line, column } = node.position();
      highlightRange(line, column, undefined, undefined, duration);
    },
    [highlightRange]
  );

  return {
    highlightRange,
    highlightNode,
    clearHighlight,
    setEditorInstance,
    isEditorReady: !!editorRef.current,
  };
};
