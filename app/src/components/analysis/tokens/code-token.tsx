import { Badge } from "@/components/ui/badge";
import { getTokenCategory } from "./tokens-info";
import { cn } from "@/lib/utils";
import { Token } from "@/lang/token/token";

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
  return (
    <div
      key={`line-${lineNum}`}
      className="relative text-sm overflow-x-auto p-2 border-l-2 border-l-tokyo-bg-highlight mb-1 font-source-code-pro bg-tokyo-bg-dark rounded-r min-h-[2rem]"
    >
      <span className="absolute left-2 top-2 select-none text-tokyo-fg-dark w-8 text-right">
        {lineNum}
      </span>

      <div className="ml-12 relative">
        {lineTokens.map((token, index) => {
          const category = getTokenCategory(token.type);
          const shouldShow = !activeFilter || activeFilter === category;
          const startPos = token.start();

          // Calculate the left position based on the token's start column
          // Using ch units to align with character positions
          const leftPosition = `${startPos.column}ch`;

          return (
            <Badge
              key={`${lineNum}-${index}-${token.literal}-${token.position.column}`}
              variant="outline"
              className={cn(
                "absolute rounded px-1.5 py-0.5 shadow-sm whitespace-nowrap",
                !shouldShow && "opacity-30 scale-95"
              )}
              style={{
                left: leftPosition,
                top: "0",
              }}
              onMouseEnter={() => setHoveredToken(token)}
              onMouseLeave={() => setHoveredToken(null)}
            >
              {token.literal || " "}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default CodeToken;
