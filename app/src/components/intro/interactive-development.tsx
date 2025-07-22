import { motion } from "framer-motion";

const InteractiveDevelopment = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          {
            icon: (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="4,17 10,11 4,5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
            ),
            title: "Token Analyzer",
            description:
              "See how your code is broken down into individual tokens (keywords, operators, literals)",
            color: "cyan",
            bgColor: "bg-[var(--tokyo-cyan)]/20",
            textColor: "text-[var(--tokyo-cyan)]",
            features: [
              "Lexical analysis",
              "Token categorization",
              "Real-time tokenization",
            ],
          },
          {
            icon: (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="6" y1="3" x2="6" y2="15" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
              </svg>
            ),
            title: "AST Visualizer",
            description:
              "Explore the Abstract Syntax Tree that represents your code's structure",
            color: "blue",
            bgColor: "bg-[var(--tokyo-blue)]/20",
            textColor: "text-[var(--tokyo-blue)]",
            features: [
              "Interactive tree navigation",
              "Node-to-code highlighting",
              "Syntax error detection",
            ],
          },
          {
            icon: (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-4-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ),
            title: "Step Debugger",
            description:
              "Execute your code step-by-step and watch variables change in real-time",
            color: "green",
            bgColor: "bg-[var(--tokyo-green)]/20",
            textColor: "text-[var(--tokyo-green)]",
            features: [
              "Step-by-step execution",
              "Live value overlays",
              "Variable tracking",
            ],
          },
          {
            icon: (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
            ),
            title: "Console Output",
            description:
              "See your program's output and any errors in a clean, organized interface",
            color: "purple",
            bgColor: "bg-[var(--tokyo-purple)]/20",
            textColor: "text-[var(--tokyo-purple)]",
            features: ["Formatted output", "Error reporting", "Execution logs"],
          },
        ].map((tool, index) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="bg-[var(--tokyo-bg-dark)]/30 rounded-lg p-4 border border-[var(--tokyo-comment)]/20"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-2 rounded-lg ${tool.bgColor} flex-shrink-0 mt-1`}
              >
                <div className={tool.textColor}>{tool.icon}</div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[var(--tokyo-fg)] mb-1">
                  {tool.title}
                </h4>
                <p className="text-sm text-[var(--tokyo-comment)] mb-3">
                  {tool.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {tool.features.map((feature) => (
                    <span
                      key={feature}
                      className={`text-xs px-2 py-1 rounded ${tool.bgColor} ${tool.textColor} border border-current/30`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-[var(--tokyo-green)]/10 to-[var(--tokyo-blue)]/10 rounded-lg p-4 border border-[var(--tokyo-green)]/20">
        <h4 className="font-semibold text-[var(--tokyo-fg)] mb-2 flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--tokyo-yellow)"
            strokeWidth="2"
          >
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
          </svg>
          Why This Matters
        </h4>
        <p className="text-sm text-[var(--tokyo-comment)]">
          Understanding how programming languages work internally makes you a
          better programmer. See the journey from source code → tokens → syntax
          tree → execution, and gain deep insights into how computers understand
          and run your programs.
        </p>
      </div>
    </div>
  );
};

export default InteractiveDevelopment;
