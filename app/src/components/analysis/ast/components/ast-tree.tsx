// src/components/analysis/ast/components/ast-tree.tsx (Updated)

import { AnimatePresence, motion } from "framer-motion";
import ParserErrors from "./parser-errors";
import AstNode from "./ast-node";
import { ParseError } from "@/lang/parser/core";
import { Node, Program } from "@/lang/ast/ast";
import AstStats from "./ast-stats";

interface AstTreeProps {
  program: Program;
  parserErrors: ParseError[];
  forceRefresh: number;
  nodeCount: number;
  highlightedNodes: Set<string>;
  onNodeClick?: (node: Node) => void;
}

const AstTree: React.FC<AstTreeProps> = ({
  program,
  parserErrors,
  forceRefresh,
  nodeCount,
  highlightedNodes,
  onNodeClick,
}) => {
  return (
    <div className="p-6">
      {/* Parser Errors */}
      <AnimatePresence>
        {parserErrors && parserErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <ParserErrors errors={parserErrors} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AST Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
        key={forceRefresh}
      >
        {/* Connection guide */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-tokyo-comment/30" />

        {/* Root node */}
        <AstNode
          node={program}
          depth={0}
          path="root"
          isLast={true}
          onNodeClick={onNodeClick}
        />
      </motion.div>

      <AstStats
        nodeCount={nodeCount}
        statementsLength={program.getStatements().length}
        errorsLength={highlightedNodes.size}
        parserErrorsLength={parserErrors.length}
      />
    </div>
  );
};

export default AstTree;
