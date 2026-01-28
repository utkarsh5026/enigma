import { motion } from "framer-motion";

interface GetStartedProps {
  onClose: () => void;
  setCurrentStep: (step: number) => void;
}

const GetStarted: React.FC<GetStartedProps> = ({
  onClose,
  setCurrentStep,
}: {
  onClose: () => void;
  setCurrentStep: (step: number) => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[var(--tokyo-green)] shadow-2xl"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="white"
            className="ml-1"
          >
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </motion.div>
        <h3 className="mb-2 text-xl font-bold text-[var(--tokyo-fg)]">
          Start Coding Right Away!
        </h3>
        <p className="text-[var(--tokyo-comment)]">
          Choose from example programs or write your own code
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-semibold text-[var(--tokyo-fg)]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--tokyo-blue)"
              strokeWidth="2"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            Example Programs
          </h4>
          <div className="space-y-2">
            {[
              "Hello World & Basics",
              "Variables & Functions",
              "Object-Oriented Programming",
              "Advanced Algorithms",
            ].map((example, index) => (
              <motion.div
                key={example}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="flex items-center gap-2 text-sm text-[var(--tokyo-comment)]"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--tokyo-blue)"
                  strokeWidth="2"
                >
                  <polyline points="9,18 15,12 9,6" />
                </svg>
                {example}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-semibold text-[var(--tokyo-fg)]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--tokyo-green)"
              strokeWidth="2"
            >
              <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
            </svg>
            Quick Tips
          </h4>
          <div className="space-y-2">
            {[
              "Click 'Debug' for step-by-step execution",
              "Try the AST viewer to see code structure",
              "Use the token analyzer to understand parsing",
              "Check the console for program output",
            ].map((tip, index) => (
              <motion.div
                key={tip}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="flex items-center gap-2 text-sm text-[var(--tokyo-comment)]"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--tokyo-green)]" />
                {tip}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <button
          onClick={onClose}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--tokyo-green)] px-6 py-3 font-medium text-white transition-all duration-200 hover:opacity-90"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
          Start Exploring Enigma
        </button>
        <button
          onClick={() => setCurrentStep(0)}
          className="flex items-center justify-center gap-2 rounded-lg border border-[var(--tokyo-comment)] px-6 py-3 font-medium text-[var(--tokyo-fg)] transition-all duration-200 hover:bg-[var(--tokyo-bg-dark)]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
          Review Introduction
        </button>
      </div>
    </div>
  );
};

export default GetStarted;
