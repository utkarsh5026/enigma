import React, { useState } from "react";
import { Token } from "@/lang/token/token";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTokenCategory, getCategoryIcon } from "./tokens-info";
import CodeTokens from "./code-tokens";

interface TokenDisplayProps {
  tokens: Token[];
}

/**
 * TokenDisplay component displays a visual representation of tokens
 * generated from lexical analysis of source code.
 *
 * This component takes in an array of tokens and organizes them by
 * their respective line numbers. It allows users to filter tokens
 * based on their categories and provides a summary of the total
 * tokens and their counts by category.
 *
 * @param {Token[]} tokens - An array of tokens to be displayed.
 *
 * The component features:
 * - A header with the title "Token Analysis" and a description.
 * - A filter section that allows users to view all tokens or filter
 *   by specific categories.
 * - A summary section that shows the total number of tokens and
 *   counts for each category.
 * - A detailed view of tokens organized by line numbers.
 */
const TokenDisplay: React.FC<TokenDisplayProps> = ({ tokens }) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const tokensByLine = tokens.reduce<Record<number, Token[]>>((acc, token) => {
    const { line } = token.position;
    if (!acc[line]) {
      acc[line] = [];
    }
    acc[line].push(token);
    return acc;
  }, {});

  const uniqueCategories = [
    ...new Set(tokens.map((token) => getTokenCategory(token.type))),
  ];

  const lineNumbers = Object.keys(tokensByLine)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full shadow-lg border-tokyo-bg-highlight bg-tokyo-bg dark:bg-tokyo-bg">
        <CardHeader className="pb-2">
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardTitle className="text-2xl font-bold text-tokyo-fg flex items-center">
              <Terminal size={24} className="mr-2 text-tokyo-cyan" />
              Token Analysis
            </CardTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CardDescription className="text-tokyo-fg-dark">
              Visualized token stream from lexical analysis
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6">
          {tokens.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                staggerChildren: 0.1,
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant={activeFilter === null ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setActiveFilter(null)}
                >
                  All
                </Badge>
              </motion.div>

              {uniqueCategories.map((category, index) => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      delay: 0.3 + index * 0.05,
                    },
                  }}
                >
                  <Badge
                    variant={activeFilter === category ? "default" : "outline"}
                    className="cursor-pointer flex items-center"
                    onClick={() =>
                      setActiveFilter(
                        category === activeFilter ? null : category
                      )
                    }
                  >
                    {getCategoryIcon(category)}
                    {category}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}

          {tokens.length > 0 && (
            <motion.div
              className="bg-tokyo-bg-dark/60 rounded-lg p-3 mb-4 border border-tokyo-bg-highlight/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm">
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
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
                      <span className="text-tokyo-fg-dark mr-2">
                        {category}:
                      </span>
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
          )}

          <CodeTokens
            tokensByLine={tokensByLine}
            activeFilter={activeFilter}
            lineNumbers={lineNumbers}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TokenDisplay;
