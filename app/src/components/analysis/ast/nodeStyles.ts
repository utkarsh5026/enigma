// nodeStyles.ts

// Categorize node types
export const getNodeCategory = (nodeType: string): string => {
  if (nodeType.includes("Statement")) return "Statement";
  if (nodeType.includes("Expression")) return "Expression";
  if (nodeType.includes("Literal")) return "Literal";
  if (nodeType === "Program") return "Program";
  if (nodeType === "Identifier") return "Identifier";
  return "Node";
};

// Get monochromatic styling based on node type category
export const getNodeStyle = (
  nodeType: string
): { border: string; background: string; text: string } => {
  const category = getNodeCategory(nodeType);

  // Tokyo Night inspired colors
  switch (category) {
    case "Program":
      return {
        border: "border-[#7aa2f7]/30",
        background: "bg-[#1a1b26]",
        text: "text-[#7aa2f7]", // Blue
      };
    case "Statement":
      return {
        border: "border-[#9d7cd8]/30",
        background: "bg-[#1a1b26]",
        text: "text-[#9d7cd8]", // Purple
      };
    case "Expression":
      return {
        border: "border-[#7dcfff]/30",
        background: "bg-[#1a1b26]",
        text: "text-[#7dcfff]", // Cyan
      };
    case "Literal":
      return {
        border: "border-[#9ece6a]/30",
        background: "bg-[#1a1b26]",
        text: "text-[#9ece6a]", // Green
      };
    case "Identifier":
      return {
        border: "border-[#e0af68]/30",
        background: "bg-[#1a1b26]",
        text: "text-[#e0af68]", // Yellow
      };
    default:
      return {
        border: "border-[#a9b1d6]/20",
        background: "bg-[#1a1b26]",
        text: "text-[#a9b1d6]", // Default text
      };
  }
};
