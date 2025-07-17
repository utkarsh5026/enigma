import { useCallback, useEffect, useRef, useState } from "react";
import { LanguageEvaluator } from "@/lang/exec/evaluation";
import { Environment } from "@/lang/exec/objects";
import { ExecutionState } from "@/lang/exec/steps/step-info";
import { useProgram } from "@/hooks/use-program";

export const useExecutionControls = (code: string) => {
  const [executionState, setExecutionState] = useState<ExecutionState | null>(
    null
  );
  const [evaluator, setEvaluator] = useState<LanguageEvaluator | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [autoRunSpeed, setAutoRunSpeed] = useState<number>(1000);
  const autoRunRef = useRef<NodeJS.Timeout | null>(null);
  const { program, parserErrors, parse } = useProgram(code);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    parse();
  }, [parse]);

  const prepareExecution = useCallback(() => {
    try {
      setError(null);

      if (!program) {
        setError("No code to execute. Please enter some code in the editor.");
        return false;
      }

      const errors = parserErrors;
      if (errors.length > 0) {
        setError(`Parser errors: ${errors.map((e) => e.message).join(", ")}`);
        return false;
      }

      const evaluator = new LanguageEvaluator();
      setEvaluator(evaluator);

      evaluator.evaluateProgram(program, new Environment());
      evaluator.getStepStorage().goToStep(0);
      console.dir(evaluator.getStepStorage().getSteps(), { depth: null });
      const initialState = evaluator.getCurrentExecutionState();
      setExecutionState(initialState);

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(`Error preparing execution: ${message}`);
      return false;
    }
  }, [program, parserErrors]);

  const executeStep = useCallback(() => {
    console.log("executeStep");
    try {
      if (!evaluator) {
        console.error("No evaluator found. Please prepare execution first.");
        setError("No evaluator found. Please prepare execution first.");
        return false;
      }

      evaluator.getStepStorage().nextStep();
      console.log("currentStep", evaluator.getStepStorage().getCurrentStep());
      const newState = evaluator.getCurrentExecutionState();
      console.dir(newState, { depth: null });
      setExecutionState({ ...newState });

      if (newState.isComplete) {
        setIsRunning(false);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error executing step:", error);
      const message = error instanceof Error ? error.message : String(error);
      setError(`Execution error: ${message}`);
      setIsRunning(false);
      return false;
    }
  }, [evaluator]);

  const goBackStep = useCallback(() => {
    try {
      if (!evaluator) {
        console.error("No evaluator found. Please prepare execution first.");
        setError("No evaluator found. Please prepare execution first.");
        return false;
      }

      evaluator.getStepStorage().previousStep();
      const newState = evaluator.getCurrentExecutionState();
      setExecutionState({ ...newState });

      if (newState.isComplete) {
        setIsRunning(false);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error going back:", error);
      const message = error instanceof Error ? error.message : String(error);
      setError(`Error going back: ${message}`);
      return false;
    }
  }, [evaluator]);

  const startAutoRun = useCallback(() => {
    if (autoRunRef.current) clearInterval(autoRunRef.current);
    setIsRunning(true);

    autoRunRef.current = setInterval(() => {
      const hasMoreSteps = executeStep();
      if (!hasMoreSteps && autoRunRef.current) {
        clearInterval(autoRunRef.current);
        autoRunRef.current = null;
        setIsRunning(false);
      }
    }, autoRunSpeed);
  }, [executeStep, autoRunSpeed]);

  const stopAutoRun = useCallback(() => {
    if (autoRunRef.current) {
      clearInterval(autoRunRef.current);
      autoRunRef.current = null;
    }
    setIsRunning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (autoRunRef.current) clearInterval(autoRunRef.current);
    };
  }, []);

  return {
    executionState,
    isRunning,
    autoRunSpeed,
    error,
    prepareExecution,
    executeStep,
    goBackStep,
    startAutoRun,
    stopAutoRun,
    setAutoRunSpeed,
    setError,
  };
};
