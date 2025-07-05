import { motion } from "framer-motion";
import { TreePine } from "lucide-react";

const EmptyAst = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-tokyo-blue/20 to-tokyo-purple/20 rounded-full blur-xl" />
        <div className="relative bg-gradient-to-br from-tokyo-bg-highlight to-tokyo-bg-dark p-6 rounded-full border border-tokyo-comment">
          <TreePine size={48} className="text-tokyo-comment" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-tokyo-fg mb-2">
        No AST to Display
      </h3>
      <p className="text-tokyo-comment max-w-md leading-relaxed">
        Enter some Enigma code in the editor to see its Abstract Syntax Tree
        representation. The AST shows how your code is parsed and structured.
      </p>

      <div className="mt-6 p-4 bg-tokyo-bg-highlight/50 rounded-lg border border-tokyo-comment max-w-sm">
        <p className="text-sm text-tokyo-fg mb-2">Try this example:</p>
        <code className="text-xs text-tokyo-blue font-mono">
          let x = 5 + 3;
        </code>
      </div>
    </motion.div>
  );
};

export default EmptyAst;
