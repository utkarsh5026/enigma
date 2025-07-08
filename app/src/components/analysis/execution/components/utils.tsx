import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";
import { Badge } from "@/components/ui/badge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDescriptionWithBadges(
  description: string
): React.ReactElement {
  // Separate patterns for double quotes (identifiers) and single quotes (results)
  const doubleQuotePattern = /"([^"]+)"/g;
  const singleQuotePattern = /'([^']+)'/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Find all matches and sort them by position
  const allMatches: Array<{
    match: RegExpExecArray;
    type: "double" | "single";
  }> = [];

  // Find all double quote matches
  let match;
  while ((match = doubleQuotePattern.exec(description)) !== null) {
    allMatches.push({ match, type: "double" });
  }

  // Find all single quote matches
  while ((match = singleQuotePattern.exec(description)) !== null) {
    allMatches.push({ match, type: "single" });
  }

  // Sort matches by their position in the string
  allMatches.sort((a, b) => a.match.index - b.match.index);

  // Process matches in order
  for (const { match, type } of allMatches) {
    // Add text before the quote
    if (match.index > lastIndex) {
      parts.push(description.slice(lastIndex, match.index));
    }

    // Add the quoted text as a badge with different styles
    if (type === "double") {
      // Identifiers (double quotes) - blue styling
      parts.push(
        <Badge
          key={`badge-${match.index}`}
          variant="secondary"
          className="mx-1 bg-[var(--tokyo-blue)]/20 text-[var(--tokyo-blue)] border-[var(--tokyo-blue)]/30 font-mono font-bold border-none text-sm"
        >
          {match[1]}
        </Badge>
      );
    } else {
      // Expression results (single quotes) - green styling
      parts.push(
        <Badge
          key={`badge-${match.index}`}
          variant="secondary"
          className="mx-1 bg-[var(--tokyo-green)]/20 text-[var(--tokyo-green)] border-[var(--tokyo-green)]/30 font-mono font-bold border-none text-sm"
        >
          {match[1]}
        </Badge>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last quote
  if (lastIndex < description.length) {
    parts.push(description.slice(lastIndex));
  }

  return <span>{parts}</span>;
}
