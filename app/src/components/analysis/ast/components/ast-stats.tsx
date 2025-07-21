import { motion } from "framer-motion";
import { Info } from "lucide-react";

interface AstStatsProps {
  nodeCount: number;
  statementsLength: number;
  errorsLength: number;
  parserErrorsLength: number;
}

const AstStats: React.FC<AstStatsProps> = ({
  nodeCount,
  statementsLength,
  errorsLength,
  parserErrorsLength,
}: AstStatsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-8 space-y-4"
    >
      {/* Statistics */}
      <div className="p-4 bg-tokyo-bg-highlight/30 rounded-lg border border-tokyo-comment">
        <div className="flex items-center gap-2 mb-3">
          <Info size={16} className="text-tokyo-blue" />
          <span className="text-sm font-medium text-tokyo-fg">
            AST Statistics
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex flex-col">
            <span className="text-tokyo-comment">Total Nodes</span>
            <span className="text-tokyo-blue font-mono">{nodeCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-tokyo-comment">Statements</span>
            <span className="text-tokyo-green font-mono">
              {statementsLength || 0}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-tokyo-comment">Search Results</span>
            <span className="text-tokyo-yellow font-mono">{errorsLength}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-tokyo-comment">Parser Errors</span>
            <span className="text-tokyo-red font-mono">
              {parserErrorsLength}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AstStats;
