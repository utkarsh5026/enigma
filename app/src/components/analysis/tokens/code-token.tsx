import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  getTokenColor,
  getTokenCategory,
  getCategoryIcon,
} from "./tokens-info";
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
  hoveredToken,
  setHoveredToken,
}) => {
  return (
    <pre
      key={`line-${lineNum}`}
      className="text-sm whitespace-pre-wrap overflow-x-auto p-2 border-l-2 border-l-tokyo-bg-highlight mb-1 font-family-mono bg-tokyo-bg-dark rounded-r"
    >
      <span className="mr-4 select-none text-tokyo-fg-dark w-8 inline-block text-right">
        {lineNum}
      </span>

      <TooltipProvider>
        {lineTokens.map((token, idx) => {
          const category = getTokenCategory(token.type);
          const shouldShow = !activeFilter || activeFilter === category;

          return (
            <Tooltip key={`token-${lineNum}-${idx}`}>
              <TooltipTrigger asChild>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 mx-0.5 shadow-sm",
                    getTokenColor(token.type),
                    !shouldShow && "opacity-30 scale-95",
                    hoveredToken === token && "ring-1 ring-white/30",
                    "cursor-pointer"
                  )}
                  onMouseEnter={() => setHoveredToken(token)}
                  onMouseLeave={() => setHoveredToken(null)}
                >
                  {token.literal || " "}
                </span>
              </TooltipTrigger>
              <TooltipContent
                className="p-0 overflow-hidden bg-tokyo-bg-dark border border-tokyo-bg-highlight font-cascadia-code"
                side="bottom"
                sideOffset={5}
              >
                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-tokyo-fg-dark">Type:</div>
                    <Badge
                      className={cn("font-mono", getTokenColor(token.type))}
                    >
                      {token.type}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-sm text-tokyo-fg-dark">Category:</div>
                    <Badge
                      variant="outline"
                      className="font-normal bg-tokyo-bg text-tokyo-fg flex items-center"
                    >
                      {getCategoryIcon(category)}
                      {category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-sm text-tokyo-fg-dark">Position:</div>
                    <span className="font-mono text-tokyo-fg">
                      Line {token.position.line}, Col {token.position.column}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-sm text-tokyo-fg-dark">Literal:</div>
                    <code className="px-2 py-1 bg-tokyo-bg-highlight/50 rounded font-mono text-tokyo-fg">
                      {token.literal || "<empty>"}
                    </code>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </pre>
  );
};

export default CodeToken;
