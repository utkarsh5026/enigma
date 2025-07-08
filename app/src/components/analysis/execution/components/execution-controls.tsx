import {
  RotateCcw,
  Pause,
  Play,
  Clock,
  SkipForward,
  SkipBack,
} from "lucide-react";
import { motion } from "framer-motion";
import { ExecutionState } from "@/lang/exec/stepwise";
import { Slider } from "@/components/ui/slider";

interface ExecutionControlsProps {
  prepareExecution: () => boolean;
  executeStep: () => void;
  goBackStep: () => void;
  isRunning: boolean;
  executionState: ExecutionState | null;
  stopAutoRun: () => void;
  startAutoRun: () => void;
  autoRunSpeed: number;
  setAutoRunSpeed: (speed: number) => void;
}

const ExecutionControls: React.FC<ExecutionControlsProps> = ({
  prepareExecution,
  executeStep,
  goBackStep,
  isRunning,
  executionState,
  stopAutoRun,
  startAutoRun,
  autoRunSpeed,
  setAutoRunSpeed,
}) => {
  return (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={prepareExecution}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-[var(--tokyo-bg-highlight)] hover:bg-[var(--tokyo-comment)] text-[var(--tokyo-fg)] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <RotateCcw size={16} />
        Reset
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-[var(--tokyo-bg-highlight)] hover:bg-[var(--tokyo-comment)] text-[var(--tokyo-fg)] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        onClick={goBackStep}
        disabled={!executionState}
      >
        <SkipBack size={16} />
        Back
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-[var(--tokyo-green)]/80 hover:bg-[var(--tokyo-green)]/10 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer hover:text-[var(--tokyo-green)] hover:shadow-sm hover:shadow-[var(--tokyo-green)]/20"
        onClick={executeStep}
        disabled={!executionState || executionState.isComplete}
      >
        <SkipForward size={16} />
        Step
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-[var(--tokyo-blue)]/80 hover:bg-[var(--tokyo-blue)]/10 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer hover:text-[var(--tokyo-blue)] hover:shadow-sm hover:shadow-[var(--tokyo-blue)]/20"
        onClick={isRunning ? stopAutoRun : startAutoRun}
        disabled={!executionState || executionState.isComplete}
      >
        {isRunning ? <Pause size={16} /> : <Play size={16} />}
        {isRunning ? "Pause" : "Run"}
      </motion.button>

      {/* Speed Control */}
      <div className="flex items-center gap-3 ml-4 bg-[var(--tokyo-bg-highlight)] rounded-lg px-3 py-2">
        <Clock size={14} style={{ color: "var(--tokyo-fg-dark)" }} />
        <span className="text-sm text-[var(--tokyo-fg-dark)]">Speed:</span>
        <Slider
          min={200}
          max={3000}
          step={200}
          value={[autoRunSpeed]}
          onValueChange={(value) => setAutoRunSpeed(value[0])}
          className="w-20"
        />
        <span className="text-xs text-[var(--tokyo-fg-dark)] min-w-[60px]">
          {autoRunSpeed}ms
        </span>
      </div>
    </div>
  );
};

export default ExecutionControls;
