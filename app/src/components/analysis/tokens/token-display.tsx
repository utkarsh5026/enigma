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
import { Button } from "@/components/ui/button";
import {
  Terminal,
  Play,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { getTokenCategory, getCategoryIcon } from "./tokens-info";
import CodeTokens from "./code-tokens";
import TokenBadge from "./token-badge";

interface TokenDisplayProps {
  tokens: Token[];
  code: string;
  isTokenizing: boolean;
  error: string | null;
  hasTokens: boolean;
  isCodeChanged: (code: string) => boolean;
  onTokenize: (code: string) => void;
  onClearTokens: () => void;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({
  tokens,
  code,
  isTokenizing,
  error,
  hasTokens,
  isCodeChanged,
  onTokenize,
  onClearTokens,
}) => {
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

  const handleTokenize = () => {
    onTokenize(code);
  };

  const codeHasContent = code.trim().length > 0;
  const showCodeChanged = codeHasContent && hasTokens && isCodeChanged(code);

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
            Manually analyze your code to view the token stream from lexical
            analysis
          </CardDescription>

          {/* Tokenize Controls */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleTokenize}
              disabled={!codeHasContent || isTokenizing}
              className="bg-tokyo-blue hover:bg-tokyo-blue/90 text-white disabled:opacity-50"
              size="sm"
            >
              {isTokenizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Tokenizing...
                </>
              ) : (
                <>
                  <Play size={16} className="mr-2" />
                  Tokenize Code
                </>
              )}
            </Button>

            {hasTokens && (
              <Button
                onClick={onClearTokens}
                variant="outline"
                size="sm"
                className="border-tokyo-comment text-tokyo-comment hover:bg-tokyo-comment/10"
              >
                <RotateCcw size={16} className="mr-2" />
                Clear
              </Button>
            )}

            {/* Status Indicators */}
            {showCodeChanged && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center text-tokyo-orange text-sm"
              >
                <AlertCircle size={16} className="mr-1" />
                Code changed - click tokenize to update
              </motion.div>
            )}

            {hasTokens && !showCodeChanged && !isTokenizing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center text-tokyo-green text-sm"
              >
                <CheckCircle2 size={16} className="mr-1" />
                Tokens up to date
              </motion.div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-tokyo-red/10 border border-tokyo-red/30 rounded-lg p-3 mt-2"
            >
              <div className="flex items-center text-tokyo-red text-sm">
                <AlertCircle size={16} className="mr-2" />
                <span className="font-medium">Tokenization Error:</span>
              </div>
              <p className="text-tokyo-red/80 text-sm mt-1">{error}</p>
            </motion.div>
          )}
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
            isEmpty={!hasTokens && !isTokenizing}
            isTokenizing={isTokenizing}
            code={code}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TokenDisplay;
