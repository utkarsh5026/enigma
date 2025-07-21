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
    <pre
      key={`line-${lineNum}`}
      className="text-sm whitespace-pre-wrap overflow-x-auto p-2 border-l-2 border-l-tokyo-bg-highlight mb-1 font-source-code-pro bg-tokyo-bg-dark rounded-r"
    >
      <span className="mr-4 select-none text-tokyo-fg-dark w-8 inline-block text-right">
        {lineNum}
      </span>

      {lineTokens.map((token) => {
        const category = getTokenCategory(token.type);
        const shouldShow = !activeFilter || activeFilter === category;

        return (
          <Badge
            variant="outline"
            className={cn(
              "rounded px-1.5 py-0.5 mx-0.5 shadow-sm",
              !shouldShow && "opacity-30 scale-95"
            )}
            onMouseEnter={() => setHoveredToken(token)}
            onMouseLeave={() => setHoveredToken(null)}
          >
            {token.literal || " "}
          </Badge>
        );
      })}
    </pre>
  );
};

export default CodeToken;
