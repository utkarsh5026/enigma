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
      } flex items-center justify-between bg-[var(--tokyo-bg-dark)]/50 text-xs backdrop-blur-sm`}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--tokyo-blue)]"></div>
          <span className="font-medium text-[var(--tokyo-blue)]">
            {isPhone ? "v0.1.0" : "Enigma v0.1.0"}
          </span>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1 text-[var(--tokyo-fg-dark)]">
          <Terminal size={10} />
          <span>{isPhone ? tokens : `Tokens: ${tokens}`}</span>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <div className="flex flex-shrink-0 items-center gap-1 text-[var(--tokyo-green)] sm:gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--tokyo-green)]"></div>
          <span>Ready</span>
        </div>
        {!isPhone && (
          <div className="flex items-center gap-2 truncate text-[var(--tokyo-fg-dark)]">
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
