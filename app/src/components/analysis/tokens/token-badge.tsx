import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Token } from "@/lang/token/token";
import { getTokenCategory } from "./tokens-info";

interface TokenBadgeProps {
  tokens: Token[];
  uniqueCategories: string[];
  activeFilter: string | null;
}

const TokenBadge: React.FC<TokenBadgeProps> = ({
  tokens,
  uniqueCategories,
  activeFilter,
}) => {
  return (
    <motion.div
      className="bg-tokyo-bg-dark/60 rounded-lg p-3 mb-4 border border-tokyo-bg-highlight/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm">
        <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
          <span className="text-tokyo-fg-dark mr-2">Total Tokens:</span>
          <Badge className="bg-tokyo-cyan">{tokens.length}</Badge>
        </motion.div>

        {uniqueCategories.map((category, index) => {
          const count = tokens.filter(
            (token) => getTokenCategory(token.type) === category
          ).length;

          return (
            <motion.div
              key={category}
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.4 + index * 0.1 },
              }}
            >
              <span className="text-tokyo-fg-dark mr-2">{category}:</span>
              <Badge
                className={cn(
                  activeFilter === category
                    ? "bg-tokyo-green"
                    : "bg-tokyo-bg-highlight"
                )}
              >
                {count}
              </Badge>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TokenBadge;
