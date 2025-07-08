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
  // Regex to match text within single or double quotes
  const quotePattern = /["']([^"']+)["']/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = quotePattern.exec(description)) !== null) {
    // Add text before the quote
    if (match.index > lastIndex) {
      parts.push(description.slice(lastIndex, match.index));
    }

    // Add the quoted text as a badge
    parts.push(
      <Badge
        key={`badge-${match.index}`}
        variant="secondary"
        className="mx-1 bg-[var(--tokyo-blue)]/20 text-[var(--tokyo-blue)] border-[var(--tokyo-blue)]/30 font-mono font-bold"
      >
        {match[1]}
      </Badge>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last quote
  if (lastIndex < description.length) {
    parts.push(description.slice(lastIndex));
  }

  return <span>{parts}</span>;
}
