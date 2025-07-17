import { AnimatePresence, motion } from "framer-motion";
import ParserErrors from "./parser-errors";
import AstNode from "./AstNode";
import { Info } from "lucide-react";
import { Ast } from "../hooks/use-ast";

interface AstTreeProps {
  ast: Ast;
  forceRefresh: number;
  nodeCount: number;
  highlightedNodes: Set<string>;
}

const AstTree: React.FC<AstTreeProps> = ({
  ast,
  forceRefresh,
  nodeCount,
  highlightedNodes,
}) => {
  return (
    <div className="p-6">
      {/* Parser Errors */}
      <AnimatePresence>
        {ast.errors && ast.errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <ParserErrors errors={ast.errors} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AST Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
        key={forceRefresh} // Force re-render when refreshed
      >
        {/* Connection guide */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-tokyo-comment/30 to-transparent" />

        {/* Root node */}
        <AstNode node={ast.program} depth={0} path="root" isLast={true} />
      </motion.div>

      {/* Legend and Statistics */}
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
                {ast.program.getStatements().length || 0}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-tokyo-comment">Search Results</span>
              <span className="text-tokyo-yellow font-mono">
                {highlightedNodes.size}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-tokyo-comment">Parser Errors</span>
              <span className="text-tokyo-red font-mono">
                {ast.errors?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AstTree;
