import { useCallback, useEffect, useState } from "react";
import { useExecutionControls } from "./use-execution";
import { useDirectValueOverlays } from "@/components/editor/hooks/use-editor-value-overlays";

/**
 * 🎮 Debug Hook for Interactive Code Execution
 *
 * 🔍 A powerful hook that provides debugging capabilities for code execution:
 * - Step-by-step code execution with visual feedback
 * - Value overlays showing results of expressions
 * - Syntax highlighting for current execution point
 * - Debug mode for enhanced logging
 *
 * 🎯 Features:
 * - Toggle step mode for granular execution control
 * - Show/hide value overlays
 * - Enable/disable debug mode
 * - Forward/backward stepping through code
 * - Visual execution state tracking
 *
 * 🚀 Example:
 * ```ts
 * const {
 *   isStepMode,
 *   debugMode,
 *   executeStep,
 *   goBackStep
 *   // ...other controls
 * } = useDebug(code);
 * ```
 */
export const useDebug = (code: string) => {
  const [isStepMode, setIsStepMode] = useState(false);

  const {
    executionState,
    prepareExecution: originalPrepareExecution,
    executeStep: originalExecuteStep,
    goBackStep: originalGoBackStep,
    error: executionError,
    setError,
    getStepLocationInfo,
  } = useExecutionControls(code);

  const {
    setEditorInstance: setDirectOverlayEditor,
    addValueOverlay,
    clearAllOverlays,
    highlightCurrentExecution,
    clearExecutionHighlight,
    setupScrollListener,
    isReady: isOverlayReady,
  } = useDirectValueOverlays();

  const prepareExecution = useCallback(() => {
    clearAllOverlays();
    clearExecutionHighlight();

    return originalPrepareExecution();
  }, [originalPrepareExecution, clearAllOverlays, clearExecutionHighlight]);

  const executeStep = useCallback(() => {
    clearExecutionHighlight();

    const success = originalExecuteStep();

    if (success && executionState?.currentStep && isOverlayReady) {
      const { node, result, stepType } = executionState.currentStep;

      if (node) {
        try {
          highlightCurrentExecution(node);
        } catch (error) {
          console.error("❌ Error highlighting execution:", error);
        }
      }

      if (result && node) {
        const value = result.inspect();

        const nodeType = node.constructor.name;
        const isExpression =
          nodeType.includes("Expression") || nodeType.includes("Literal");
        const isEvaluation = stepType === "After";
        const hasMeaningfulValue =
          value &&
          value !== "null" &&
          value !== "undefined" &&
          value !== "" &&
          value !== "NaN" &&
          value !== node.toString();

        const shouldShowOverlay =
          (isExpression || isEvaluation) && hasMeaningfulValue;

        if (shouldShowOverlay) {
          try {
            addValueOverlay(node, value, {
              duration: 0,
              persistent: false,
            });
          } catch (error) {
            console.error("❌ Error adding overlay:", error);
          }
        }
      }
    }

    return success;
  }, [
    originalExecuteStep,
    executionState,
    isOverlayReady,
    clearExecutionHighlight,
    highlightCurrentExecution,
    addValueOverlay,
  ]);

  const goBackStep = useCallback(() => {
    clearAllOverlays();
    clearExecutionHighlight();
    return originalGoBackStep();
  }, [originalGoBackStep, clearAllOverlays, clearExecutionHighlight]);

  const resetExecution = useCallback(() => {
    clearAllOverlays();
    clearExecutionHighlight();
    setError(null);
  }, [clearAllOverlays, clearExecutionHighlight, setError]);

  useEffect(() => {
    if (!isStepMode) {
      clearAllOverlays();
      clearExecutionHighlight();
      resetExecution();
    }
  }, [isStepMode, clearAllOverlays, clearExecutionHighlight, resetExecution]);

  return {
    // Debug controls
    isStepMode,
    setIsStepMode,
    executionState,

    // Execution controls
    prepareExecution,
    executeStep,
    goBackStep,
    resetExecution,
    executionError,
    getStepLocationInfo,
    setDirectOverlayEditor,
    setupScrollListener,
    clearAllOverlays,
    clearExecutionHighlight,
  };
};
