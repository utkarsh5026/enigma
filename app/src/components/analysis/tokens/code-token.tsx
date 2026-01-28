import { Badge } from "@/components/ui/badge";
import { getTokenCategory } from "./tokens-info";
import { cn } from "@/lib/utils";
import { Token } from "@/lang/token/token";
import React from "react"; // Added missing import

interface CodeTokenProps {
  lineNum: number;
  lineTokens: Token[];
  activeFilter: string | null;
  hoveredToken: Token | null;
  setHoveredToken: (token: Token | null) => void;
}

const CodeToken: React.FC<CodeTokenProps> = ({
  lineNum,
  lineTokens,
  activeFilter,
  setHoveredToken,
}) => {
  // Sort tokens by column position to ensure proper order
  const sortedTokens = [...lineTokens].sort(
    (a, b) => a.start().column - b.start().column
  );

  return (
    <div
      key={`line-${lineNum}`}
      className="font-source-code-pro relative mb-1 min-h-[2rem] rounded-r border-l-2 border-l-tokyo-bg-highlight bg-tokyo-bg-dark p-2 text-sm"
    >
      <span className="absolute top-2 left-2 w-8 text-right text-tokyo-fg-dark select-none">
        {lineNum}
      </span>

      <div className="ml-12 flex flex-wrap items-start gap-x-1 gap-y-1 leading-relaxed">
        {sortedTokens.map((token, index) => {
          const category = getTokenCategory(token.type);
          const shouldShow = !activeFilter || activeFilter === category;
          const prevToken = index > 0 ? sortedTokens[index - 1] : null;

          const spacingElements = [];
          if (prevToken) {
            const prevEnd =
              prevToken.start().column + (prevToken.literal?.length || 0);
            const currentStart = token.start().column;
            const spaceBetween = currentStart - prevEnd;

            // Add spacing elements for significant gaps (more than 1 space)
            if (spaceBetween > 1) {
              spacingElements.push(
                <span
                  key={`spacing-${lineNum}-${index}`}
                  className="text-tokyo-fg-dark/30 select-none"
                  style={{ minWidth: `${Math.min(spaceBetween - 1, 8)}ch` }}
                >
                  {spaceBetween > 8 ? "..." : ""}
                </span>
              );
            }
          }

          return (
            <React.Fragment
              key={`${lineNum}-${index}-${token.literal}-${token.position.column}`}
            >
              {spacingElements}
              <Badge
                variant="outline"
                className={cn(
                  "rounded px-1.5 py-0.5 whitespace-nowrap shadow-sm transition-all duration-200",
                  !shouldShow && "scale-95 opacity-30",
                  "hover:scale-105 hover:shadow-md"
                )}
                onMouseEnter={() => setHoveredToken(token)}
                onMouseLeave={() => setHoveredToken(null)}
                title={`Line ${lineNum}, Column ${token.start().column}: ${
                  token.type
                }`}
              >
                {token.literal || " "}
              </Badge>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CodeToken;
