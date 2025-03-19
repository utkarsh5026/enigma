import { X } from "lucide-react";
import React from "react";

interface ParserErrorsProps {
  errors: { message: string; line: number; column: number }[];
}

/**
 * ParserErrors component displays a list of parser errors.
 *
 * This component takes an array of errors as props and renders them in a user-friendly format.
 * Each error includes a message, line number, and column number, which are displayed in a styled list.
 *
 * Props:
 * - errors: An array of error objects, where each object contains:
 *   - message: A string describing the error.
 *   - line: A number indicating the line where the error occurred.
 *   - column: A number indicating the column where the error occurred.
 *
 * If there are no errors, the component returns null and does not render anything.
 */
const ParserErrors: React.FC<ParserErrorsProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
      <div className="flex items-center mb-2">
        <X size={16} className="text-red-600 dark:text-red-400 mr-2" />
        <h3 className="text-red-700 dark:text-red-300 font-medium">
          Parser Errors ({errors.length})
        </h3>
      </div>
      <ul className="space-y-1 text-sm">
        {errors.map((error) => (
          <li key={error.message} className="text-red-600 dark:text-red-400">
            <span className="font-mono bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded mr-2">
              Ln {error.line}, Col {error.column}
            </span>
            {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParserErrors;
