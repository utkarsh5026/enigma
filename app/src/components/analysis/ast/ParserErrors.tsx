// ParserErrors.tsx
import { AlertTriangle } from "lucide-react";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ParserErrorsProps {
  errors: { message: string; line: number; column: number }[];
}

/**
 * ParserErrors component displays a list of parser errors.
 *
 * This component takes an array of errors as props and renders them in a user-friendly format.
 * Each error includes a message, line number, and column number, displayed in a styled list.
 */
const ParserErrors: React.FC<ParserErrorsProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <Collapsible className="mb-6 border border-[#f7768e] rounded-md overflow-hidden">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-[#1a0e12] hover:bg-[#281218] text-[#f7768e] transition-colors focus:outline-none">
        <div className="flex items-center">
          <AlertTriangle size={16} className="mr-2" />
          <h3 className="font-medium">Parser Errors ({errors.length})</h3>
        </div>
        <span className="text-xs opacity-70">Click to expand</span>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="bg-[#0d1117] p-3 border-t border-[#f7768e]/30">
          <ul className="space-y-2 text-sm">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start text-[#f7768e]/90">
                <span className="font-mono bg-[#24131a] px-1.5 py-0.5 rounded mr-2 text-xs">
                  Ln {error.line}, Col {error.column}
                </span>
                <span className="opacity-90">{error.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ParserErrors;
