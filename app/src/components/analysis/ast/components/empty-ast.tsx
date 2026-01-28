import { motion } from "framer-motion";
import { GitBranch, Code2, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyAstProps {
  onParse?: () => void;
  isParsing?: boolean;
  canParse?: boolean;
}

const EmptyAst: React.FC<EmptyAstProps> = ({
  onParse,
  isParsing = false,
  canParse = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex min-h-full flex-col items-center justify-center p-8 text-center lg:p-12"
    >
      {/* Main Icon with enhanced animations */}
      <motion.div
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="relative mb-8"
      >
        {/* Animated background glow */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-(--tokyo-blue)/20 blur-2xl"
        />

        {/* Icon container */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative rounded-2xl border border-tokyo-comment/30 bg-tokyo-bg-highlight p-8 shadow-2xl"
        >
          <GitBranch size={64} className="text-tokyo-blue" />

          {/* Floating elements */}
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-2 -right-2 rounded-full bg-tokyo-green p-1.5"
          >
            <Code2 size={12} className="text-white" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex max-w-2xl flex-col items-center justify-center"
      >
        <h3 className="mb-4 text-2xl font-bold text-tokyo-fg lg:text-3xl">
          Ready to Parse Your Code?
        </h3>

        <p className="mb-8 text-lg leading-relaxed text-tokyo-comment">
          Write some Enigma code in the editor, then hit the{" "}
          <span className="inline-flex items-center gap-1 rounded bg-(--tokyo-green)/20 px-2 py-1 font-mono text-sm text-tokyo-green">
            <Zap size={12} />
            Parse Code
          </span>{" "}
          button to visualize its Abstract Syntax Tree structure.
        </p>

        {/* Parse Button */}
        {onParse && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8"
          >
            <Button
              onClick={onParse}
              disabled={isParsing || !canParse}
              size="lg"
              className="flex cursor-pointer items-center gap-3 rounded-xl bg-tokyo-green/50 px-8 py-3 text-lg font-semibold text-white shadow-xl transition-all hover:bg-tokyo-green/20 hover:text-tokyo-green hover:shadow-md hover:shadow-tokyo-green/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isParsing ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Zap size={20} />
              )}
              {isParsing ? "Parsing Code..." : "Parse Code Now"}
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mt-8 rounded-2xl border border-(--tokyo-blue)/20 bg-(--tokyo-blue)/10 p-6 backdrop-blur-sm"
      >
        <p className="mb-2 text-sm text-tokyo-fg-dark">
          💡 The AST shows how your code is structured internally
        </p>
        <p className="text-xs text-tokyo-comment">
          Perfect for understanding parsing, debugging, and learning language
          design
        </p>
      </motion.div>
    </motion.div>
  );
};

export default EmptyAst;
