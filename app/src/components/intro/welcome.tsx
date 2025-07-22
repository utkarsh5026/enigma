import { motion } from "framer-motion";

const Welcome = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div className="relative mx-auto w-24 h-24 mb-6">
          {/* Animated logo */}
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-br from-[var(--tokyo-blue)] to-[var(--tokyo-purple)] rounded-2xl opacity-20"
          />
          <div className="relative bg-gradient-to-br from-[var(--tokyo-blue)] to-[var(--tokyo-purple)] rounded-2xl p-6 shadow-2xl">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <polyline points="4,17 10,11 4,5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
          </div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--tokyo-green)] rounded-full flex items-center justify-center"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <polygon points="12,2 15.09,8.26 22,9 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9 8.91,8.26" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-[var(--tokyo-fg)]">
          What is Enigma?
        </h3>
        <div className="space-y-3 text-[var(--tokyo-fg-dark)] leading-relaxed">
          <p>
            <strong className="text-[var(--tokyo-blue)]">Enigma</strong> is a
            modern, educational programming language designed to help you
            understand how programming languages work under the hood.
          </p>
          <p>
            This interactive environment lets you write code and see exactly how
            it's processed - from individual tokens to abstract syntax trees to
            step-by-step execution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[var(--tokyo-bg-dark)]/50 rounded-lg p-4 border border-[var(--tokyo-comment)]/20"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--tokyo-blue)"
            strokeWidth="2"
            className="mb-2"
          >
            <polyline points="16,18 22,12 16,6" />
            <polyline points="8,6 2,12 8,18" />
          </svg>
          <h4 className="font-semibold text-[var(--tokyo-fg)] mb-1">
            Learn by Doing
          </h4>
          <p className="text-xs text-[var(--tokyo-comment)]">
            Write real code and see how it's interpreted
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[var(--tokyo-bg-dark)]/50 rounded-lg p-4 border border-[var(--tokyo-comment)]/20"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--tokyo-green)"
            strokeWidth="2"
            className="mb-2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-4-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <h4 className="font-semibold text-[var(--tokyo-fg)] mb-1">
            Visual Debugging
          </h4>
          <p className="text-xs text-[var(--tokyo-comment)]">
            Step through execution with live value overlays
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
