import { motion } from "framer-motion";
import { Terminal, Coffee } from "lucide-react";
import { useMobile } from "../../hooks/use-mobile";

interface StatusBarProps {
  tokens: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ tokens }) => {
  const { isMobile, isPhone } = useMobile();

  return (
    <motion.div
      className={`shrink-0 border-t border-[var(--tokyo-comment)]/40 ${
        isMobile ? "px-2 py-1.5" : "px-4 py-2"
      } flex items-center justify-between text-xs bg-[var(--tokyo-bg-dark)]/50 backdrop-blur-sm`}
    >
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-[var(--tokyo-blue)] animate-pulse"></div>
          <span className="text-[var(--tokyo-blue)] font-medium">
            {isPhone ? "v0.1.0" : "Enigma v0.1.0"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[var(--tokyo-fg-dark)] flex-shrink-0">
          <Terminal size={10} />
          <span>{isPhone ? tokens : `Tokens: ${tokens}`}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <div className="flex items-center gap-1 sm:gap-2 text-[var(--tokyo-green)] flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-[var(--tokyo-green)] animate-pulse"></div>
          <span>Ready</span>
        </div>
        {!isPhone && (
          <div className="flex items-center gap-2 text-[var(--tokyo-fg-dark)] truncate">
            <Coffee size={12} />
            <span className="truncate">
              Made with ❤️ by Utkarsh Priyadarshi
            </span>
          </div>
        )}
        {isPhone && (
          <div className="flex items-center gap-1 text-[var(--tokyo-fg-dark)]">
            <Coffee size={10} />
            <span>❤️</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatusBar;
