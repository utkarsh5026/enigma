import { motion } from "framer-motion";
import { BookOpen, Terminal, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import EditorToolbarButton from "./toolbar-button";
import ExamplesDropdown from "./examples-dropdown";
import { useMobile } from "../../hooks/use-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CategoryExample {
  key: string;
  name: string;
}

interface ExampleCategory {
  key: string;
  emoji: string;
  name: string;
  description: string;
  examples: CategoryExample[];
}

interface ToolBarProps {
  selectedExample: string;
  loadExample: (example: string) => void;
  categorizedExamples: ExampleCategory[];
}

const ToolBar: React.FC<ToolBarProps> = ({
  selectedExample,
  loadExample,
  categorizedExamples,
}) => {
  const { isMobile, isPhone } = useMobile();
  const [showExamplesDropdown, setShowExamplesDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      className="border-b border-(--tokyo-comment)/20 bg-tokyo-bg backdrop-blur-md relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-(--tokyo-purple)/5" />

      <div
        className={`relative z-10 flex items-center justify-between ${isPhone ? "px-3 py-2" : "px-4 py-3"
          }`}
      >
        {/* Brand Section */}
        <div className="flex items-center gap-3 min-w-0">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-tokyo-blue rounded-xl blur-sm opacity-50" />

            <div
              className={`relative rounded-xl bg-tokyo-blue shadow-lg ${isPhone ? "p-2" : "p-2.5"
                }`}
            >
              <Terminal size={isPhone ? 16 : 20} className="text-white" />
            </div>
          </motion.div>

          <div className="min-w-0 flex-1">
            <motion.h1
              className={`font-bold text-[var(--tokyo-fg)] ${isPhone ? "text-base" : "text-xl"
                }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isPhone ? "Enigma" : "Enigma Explorer"}
            </motion.h1>
            {!isPhone && (
              <motion.p
                className="text-xs text-[var(--tokyo-comment)] flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles size={10} className="text-[var(--tokyo-yellow)]" />
                Interactive Language Environment
              </motion.p>
            )}
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ExamplesDropdown
              showExamplesDropdown={showExamplesDropdown}
              handleOpenChange={setShowExamplesDropdown}
              selectedExample={selectedExample}
              categorizedExamples={categorizedExamples}
              loadExample={loadExample}
            />
          </motion.div>

          {/* Subtle divider */}
          <div className="w-px h-5 bg-[var(--tokyo-comment)]/30" />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <EditorToolbarButton
              icon={<BookOpen size={isMobile ? 14 : 16} />}
              tooltip="Documentation"
              onClick={() => navigate("/guide")}
              className="hover:bg-[var(--tokyo-blue)]/10 hover:text-[var(--tokyo-blue)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <EditorToolbarButton
              icon={<FaGithub size={isMobile ? 14 : 16} />}
              tooltip="Source Code"
              onClick={() =>
                window.open("https://github.com/utkarsh5026/enigma", "_blank")
              }
              className="hover:bg-[var(--tokyo-purple)]/10 hover:text-[var(--tokyo-purple)]"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--tokyo-purple)]/50" />
    </motion.div>
  );
};

export default ToolBar;
