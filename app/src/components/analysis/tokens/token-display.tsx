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
import { getTokenCategory, getCategoryIcon } from "./tokens-info";
import CodeTokens from "./code-tokens";
import TokenBadge from "./token-badge";

interface TokenDisplayProps {
  tokens: Token[];
}

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
          <CardTitle className="text-2xl font-bold text-tokyo-fg flex items-center">
            <Terminal size={24} className="mr-2 text-tokyo-cyan" />
            Token Analysis
          </CardTitle>

          <CardDescription className="text-tokyo-fg-dark">
            Visualized token stream from lexical analysis
          </CardDescription>
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
            <TokenBadge
              tokens={tokens}
              uniqueCategories={uniqueCategories}
              activeFilter={activeFilter}
            />
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
