import { motion } from "framer-motion";
import { Terminal, Coffee } from "lucide-react";

interface StatusBarProps {
  tokens: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ tokens }) => {
  return (
    <motion.div className="shrink-0 border-t border-[var(--tokyo-comment)]/40 px-4 py-2 flex items-center justify-between text-xs bg-[var(--tokyo-bg-dark)]/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--tokyo-blue)] animate-pulse"></div>
          <span className="text-[var(--tokyo-blue)] font-medium">
            Enigma v0.1.0
          </span>
        </div>
        <div className="flex items-center gap-1 text-[var(--tokyo-fg-dark)]">
          <Terminal size={12} />
          <span>Tokens: {tokens}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[var(--tokyo-green)]">
          <div className="w-2 h-2 rounded-full bg-[var(--tokyo-green)] animate-pulse"></div>
          <span>Ready</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--tokyo-fg-dark)]">
          <Coffee size={12} />
          <span>Made with ❤️ by Utkarsh Priyadarshi</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusBar;
