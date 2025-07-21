import React from "react";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, Activity } from "lucide-react";

export function parseDescriptionWithBadges(
  description: string
): React.ReactElement {
  const doubleQuotePattern = /"([^"]+)"/g;
  const singleQuotePattern = /'([^']+)'/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  const allMatches: Array<{
    match: RegExpExecArray;
    type: "double" | "single";
  }> = [];

  let match;
  while ((match = doubleQuotePattern.exec(description)) !== null) {
    allMatches.push({ match, type: "double" });
  }

  while ((match = singleQuotePattern.exec(description)) !== null) {
    allMatches.push({ match, type: "single" });
  }

  allMatches.sort((a, b) => a.match.index - b.match.index);

  for (const { match, type } of allMatches) {
    if (match.index > lastIndex) {
      parts.push(description.slice(lastIndex, match.index));
    }

    if (type === "double") {
      parts.push(
        <Badge
          key={`badge-${match.index}`}
          variant="secondary"
          className="mx-1 bg-tokyo-blue/20 text-tokyo-blue font-mono font-bold border-none text-sm"
        >
          {match[1]}
        </Badge>
      );
    } else {
      parts.push(
        <Badge
          key={`badge-${match.index}`}
          variant="secondary"
          className="mx-1 bg-tokyo-green/20 text-tokyo-green font-mono font-bold border-none text-sm"
        >
          {match[1]}
        </Badge>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < description.length) {
    parts.push(description.slice(lastIndex));
  }

  return <span>{parts}</span>;
}

export const getStepTypeInfo = (stepType: string) => {
  switch (stepType) {
    case "before":
      return {
        label: "About to Execute",
        icon: <Eye size={16} style={{ color: "var(--tokyo-yellow)" }} />,
        color: "text-[var(--tokyo-yellow)]",
        bgColor: "bg-[var(--tokyo-yellow)]/10",
        borderColor: "border-[var(--tokyo-yellow)]/20",
      };
    case "after":
      return {
        label: "Just Completed",
        icon: <CheckCircle size={16} style={{ color: "var(--tokyo-green)" }} />,
        color: "text-[var(--tokyo-green)]",
        bgColor: "bg-[var(--tokyo-green)]/10",
        borderColor: "border-[var(--tokyo-green)]/20",
      };
    default:
      return {
        label: "Processing",
        icon: <Activity size={16} style={{ color: "var(--tokyo-blue)" }} />,
        color: "text-[var(--tokyo-blue)]",
        bgColor: "bg-[var(--tokyo-blue)]/10",
        borderColor: "border-[var(--tokyo-blue)]/20",
      };
  }
};
