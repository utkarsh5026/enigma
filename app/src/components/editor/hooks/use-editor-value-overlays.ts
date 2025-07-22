/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from "react";
import { editor } from "monaco-editor";
import { Node } from "@/lang/ast";

const DIRECT_OVERLAY_STYLES = "direct-overlay-styles";

export interface ExecutionHighlight {
  overlayId?: string;
  decorationIds: string[];
  node: Node;
}

export const useDirectValueOverlays = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const overlayContainerRef = useRef<HTMLDivElement | null>(null);
  const activeOverlaysRef = useRef<
    Map<string, { element: HTMLElement; decorations: string[] }>
  >(new Map());
  const currentHighlightRef = useRef<ExecutionHighlight | null>(null);

  const setEditorInstance = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor) => {
      editorRef.current = editorInstance;
      const editorDom = editorInstance.getDomNode();
      if (!editorDom) return;
      const existing = editorDom.querySelector(".direct-overlay-container");
      if (existing) {
        existing.remove();
      }

      const container = document.createElement("div");
      container.className = "direct-overlay-container";
      container.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 1000;
        overflow: hidden;
      `;

      editorDom.appendChild(container);
      overlayContainerRef.current = container;
      if (!document.getElementById(DIRECT_OVERLAY_STYLES)) {
        const style = document.createElement("style");
        style.id = DIRECT_OVERLAY_STYLES;
        document.head.appendChild(style);
      }
    },
    []
  );

  const removeOverlay = useCallback((overlayId: string) => {
    const overlay = activeOverlaysRef.current.get(overlayId);
    if (!overlay || !editorRef.current) return;

    try {
      if (overlay.element && overlay.element.parentNode) {
        overlay.element.remove();
      }

      if (overlay.decorations?.length > 0) {
        editorRef.current.deltaDecorations(overlay.decorations, []);
      }

      activeOverlaysRef.current.delete(overlayId);
    } catch (error) {
      console.error("❌ Error removing overlay:", error);
    }
  }, []);

  const clearAllOverlays = useCallback(() => {
    activeOverlaysRef.current.forEach((overlay, id) => {
      try {
        if (overlay.element) {
          overlay.element.remove();
        }
        if (overlay.decorations?.length > 0 && editorRef.current) {
          editorRef.current.deltaDecorations(overlay.decorations, []);
        }
      } catch (error) {
        console.error("❌ Error clearing overlay:", id, error);
      }
    });
    activeOverlaysRef.current.clear();
    if (currentHighlightRef.current && editorRef.current) {
      const { decorationIds } = currentHighlightRef.current;
      editorRef.current.deltaDecorations(decorationIds, []);
      currentHighlightRef.current = null;
    }
  }, []);

  const clearExecutionHighlight = useCallback(() => {
    if (currentHighlightRef.current && editorRef.current) {
      const { decorationIds } = currentHighlightRef.current;
      editorRef.current.deltaDecorations(decorationIds, []);
      currentHighlightRef.current = null;
    }
  }, []);

  const scrollToPosition = useCallback(
    (
      line: number,
      column: number,
      options: {
        centerInView?: boolean;
        smoothScroll?: boolean;
        setCursor?: boolean;
      } = {}
    ) => {
      if (!editorRef.current) {
        return;
      }

      const {
        centerInView = true,
        smoothScroll = true,
        setCursor = true,
      } = options;

      try {
        const position = { lineNumber: line, column };

        if (centerInView) {
          editorRef.current.revealLineInCenter(line, smoothScroll ? 1 : 0);
        } else {
          editorRef.current.revealLine(line, smoothScroll ? 1 : 0);
        }

        if (setCursor) {
          editorRef.current.setPosition(position);
        }
      } catch (error) {
        console.error("❌ Error scrolling to position:", error);
      }
    },
    []
  );

  const scrollToNode = useCallback(
    (
      node: Node,
      options: {
        centerInView?: boolean;
        smoothScroll?: boolean;
        setCursor?: boolean;
      } = {}
    ) => {
      if (!node) return;

      try {
        const range = node.nodeRange();
        if (!range?.start) return;

        scrollToPosition(range.start.line, range.start.column, options);
      } catch (error) {
        console.error("❌ Error scrolling to node:", error);
      }
    },
    [scrollToPosition]
  );

  const highlightCurrentExecution = useCallback(
    (
      node: Node,
      options: {
        scrollToCenter?: boolean;
        smoothScroll?: boolean;
      } = {}
    ) => {
      if (!editorRef.current || !node) return null;

      try {
        if (currentHighlightRef.current) {
          const { decorationIds } = currentHighlightRef.current;
          editorRef.current.deltaDecorations(decorationIds, []);
        }

        const range = node.nodeRange();
        if (!range?.start) return null;

        const monacoRange = new (window as any).monaco.Range(
          range.start.line,
          range.start.column,
          range.end?.line || range.start.line,
          range.end?.column || range.start.column + 1
        );

        const decorationIds = editorRef.current.deltaDecorations(
          [],
          [
            {
              range: monacoRange,
              options: {
                className: "execution-highlight-current",
                isWholeLine: false,
              },
            },
          ]
        );

        currentHighlightRef.current = {
          decorationIds,
          node,
        };

        // Scroll to the current execution position
        const { scrollToCenter = true, smoothScroll = true } = options;

        if (scrollToCenter) {
          editorRef.current.revealRangeInCenter(
            monacoRange,
            smoothScroll ? 1 : 0
          );
          editorRef.current.setPosition({
            lineNumber: range.start.line,
            column: range.start.column,
          });
        }
        return decorationIds;
      } catch (error) {
        console.error("❌ Error highlighting execution:", error);
        return null;
      }
    },
    []
  );

  const addValueOverlay = useCallback(
    (
      node: Node,
      value: string,
      options: {
        duration?: number;
        persistent?: boolean;
        scrollToView?: boolean;
        centerInView?: boolean;
      } = {}
    ) => {
      if (!editorRef.current || !overlayContainerRef.current || !node) {
        console.error("❌ Editor, container, or node not available");
        return null;
      }

      try {
        // Clear all existing overlays before adding new one
        clearAllOverlays();

        const range = node.nodeRange();
        const { scrollToView = false, centerInView = true } = options;
        if (scrollToView) {
          scrollToNode(node, {
            centerInView,
            smoothScroll: true,
            setCursor: false,
          });
        }

        const targetLine = range.end.line;
        const targetColumn = range.end.column + 1;

        const pixelPosition = editorRef.current.getScrolledVisiblePosition({
          lineNumber: targetLine,
          column: targetColumn,
        });

        if (!pixelPosition) {
          return null;
        }

        const overlayId = `overlay-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 5)}`;
        const overlayElement = document.createElement("div");
        overlayElement.className = "direct-value-overlay";
        overlayElement.textContent = value;
        overlayElement.id = overlayId;

        const offsetY = 8;
        overlayElement.style.left = `${pixelPosition.left}px`;
        overlayElement.style.top = `${pixelPosition.top - offsetY}px`;

        overlayContainerRef.current.appendChild(overlayElement);
        const monacoRange = new (window as any).monaco.Range(
          range.start.line,
          range.start.column,
          range.end.line,
          range.end.column
        );

        const decorationIds = editorRef.current.deltaDecorations(
          [],
          [
            {
              range: monacoRange,
              options: {
                className: "execution-highlight",
                isWholeLine: false,
              },
            },
          ]
        );

        activeOverlaysRef.current.set(overlayId, {
          element: overlayElement,
          decorations: decorationIds,
        });

        if (!options.persistent) {
          const duration = options.duration || 2000;
          setTimeout(() => {
            removeOverlay(overlayId);
          }, duration);
        }
      } catch (error) {
        console.error("❌ Error adding overlay:", error);
        return null;
      }
    },
    [scrollToNode, removeOverlay, clearAllOverlays] // Added clearAllOverlays to dependencies
  );

  const updateScrollPosition = useCallback(() => {
    if (!editorRef.current || !overlayContainerRef.current) return;

    activeOverlaysRef.current.forEach((_, id) => {
      removeOverlay(id);
    });
  }, [removeOverlay]);

  const setupScrollListener = useCallback(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const disposable = editor.onDidScrollChange(() => {
      updateScrollPosition();
    });

    return disposable;
  }, [updateScrollPosition]);

  return {
    setEditorInstance,
    addValueOverlay,
    removeOverlay,
    clearAllOverlays,
    highlightCurrentExecution,
    clearExecutionHighlight,
    scrollToPosition,
    scrollToNode,
    setupScrollListener,
    isReady: !!editorRef.current,
  };
};
