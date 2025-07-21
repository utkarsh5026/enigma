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
      className="relative text-sm p-2 border-l-2 border-l-tokyo-bg-highlight mb-1 font-source-code-pro bg-tokyo-bg-dark rounded-r min-h-[2rem]"
    >
      <span className="absolute left-2 top-2 select-none text-tokyo-fg-dark w-8 text-right">
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
                  "rounded px-1.5 py-0.5 shadow-sm whitespace-nowrap transition-all duration-200",
                  !shouldShow && "opacity-30 scale-95",
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
