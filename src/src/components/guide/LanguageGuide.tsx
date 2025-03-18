import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Terminal, Variable, Play, Grid, BookOpen } from "lucide-react";
import { examplePrograms, languageFeatures } from "./data";
import SyntaxReference from "./SyntaxReference";
import FeatureCard from "./FeatureCard";
import CodeExample from "./CodeExample";
import { highlightSyntax } from "./syntax";

const LanguageGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "examples" | "reference"
  >("overview");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-4">
          <Terminal size={36} className="text-[#4d9375]" />
          <h1 className="text-4xl font-bold text-white">
            Enigma Programming Language
          </h1>
        </div>
        <p className="text-[#8b949e] text-lg max-w-3xl mx-auto">
          A dynamically-typed language with first-class functions, closures, and
          a clean, expressive syntax. Designed for readability and productivity.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex justify-center mb-8 border-b border-[#30363d]">
        <button
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === "overview"
              ? "text-[#4d9375] border-b-2 border-[#4d9375]"
              : "text-[#8b949e] hover:text-white"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          <span className="flex items-center gap-2">
            <Grid size={16} />
            Language Overview
          </span>
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === "examples"
              ? "text-[#4d9375] border-b-2 border-[#4d9375]"
              : "text-[#8b949e] hover:text-white"
          }`}
          onClick={() => setActiveTab("examples")}
        >
          <span className="flex items-center gap-2">
            <Code size={16} />
            Code Examples
          </span>
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === "reference"
              ? "text-[#4d9375] border-b-2 border-[#4d9375]"
              : "text-[#8b949e] hover:text-white"
          }`}
          onClick={() => setActiveTab("reference")}
        >
          <span className="flex items-center gap-2">
            <BookOpen size={16} />
            Syntax Reference
          </span>
        </button>
      </div>

      {/* Tab content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === "overview" && (
          <div>
            <Card className="bg-[#0d1117] border-[#30363d] mb-8">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-white">
                  Language Features
                </CardTitle>
                <CardDescription>
                  Key elements and capabilities of the Enigma language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {languageFeatures.map((feature) => (
                    <FeatureCard
                      key={feature.title}
                      title={feature.title}
                      icon={feature.icon}
                      description={feature.description}
                      example={feature.example}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-[#0d1117] border-[#30363d]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Code size={18} className="text-[#4d9375]" />
                    Higher-order Functions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#8b949e] mb-3">
                    Functions in Enigma are first-class citizens, allowing you
                    to pass them as arguments, return them from other functions,
                    and assign them to variables.
                  </p>
                  <div className="bg-[#161b22] rounded-md p-3 font-mono text-sm text-[#e6edf3]">
                    {highlightSyntax(`// Function that takes a function
let twice = fn(f, x) {
  return f(f(x));
};

// Usage
let addOne = fn(x) { return x + 1; };
let result = twice(addOne, 5);  // returns 7`)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0d1117] border-[#30363d]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Variable size={18} className="text-[#4d9375]" />
                    Closures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#8b949e] mb-3">
                    Enigma functions create closures, capturing the environment
                    where they were defined, which enables powerful patterns
                    like function factories and stateful functions.
                  </p>
                  <div className="bg-[#161b22] rounded-md p-3 font-mono text-sm text-[#e6edf3]">
                    {highlightSyntax(`// Counter factory using closure
let makeCounter = fn() {
  let count = 0;  // This variable is captured
  
  return fn() {
    count = count + 1;
    return count;
  };
};

let counter = makeCounter();
counter();  // returns 1
counter();  // returns 2`)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#0d1117] border-[#30363d]">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Terminal size={18} className="text-[#4d9375]" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#8b949e] mb-4">
                  Ready to start coding in Enigma? Here's a simple "Hello World"
                  program to get you started:
                </p>
                <div className="bg-[#161b22] rounded-md p-4 font-mono text-sm text-[#e6edf3] mb-6">
                  {highlightSyntax(`// Define a greeting function
let greet = fn(name) {
  return "Hello, " + name + "!";
};

// Call the function
let message = greet("World");

// Print to console
puts(message);  // Outputs: Hello, World!`)}
                </div>

                <h3 className="text-white font-medium mb-2">
                  Key Points to Remember:
                </h3>
                <ul className="text-[#8b949e] space-y-2 mb-4">
                  <li className="flex gap-2">
                    <span className="text-[#4d9375]">•</span>
                    <span>
                      Variables are declared with{" "}
                      <code className="bg-[#161b22] px-1 py-0.5 rounded">
                        let
                      </code>{" "}
                      and constants with{" "}
                      <code className="bg-[#161b22] px-1 py-0.5 rounded">
                        const
                      </code>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4d9375]">•</span>
                    <span>
                      Functions are defined with{" "}
                      <code className="bg-[#161b22] px-1 py-0.5 rounded">
                        fn
                      </code>{" "}
                      keyword and always return a value
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4d9375]">•</span>
                    <span>
                      Statements end with semicolons{" "}
                      <code className="bg-[#161b22] px-1 py-0.5 rounded">
                        ;
                      </code>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4d9375]">•</span>
                    <span>
                      Code blocks are enclosed in braces{" "}
                      <code className="bg-[#161b22] px-1 py-0.5 rounded">
                        {}
                      </code>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4d9375]">•</span>
                    <span>
                      String concatenation uses the{" "}
                      <code className="bg-[#161b22] px-1 py-0.5 rounded">
                        +
                      </code>{" "}
                      operator
                    </span>
                  </li>
                </ul>

                <div className="bg-[#1c2128] rounded-md p-4 border border-[#30363d] flex items-start gap-3">
                  <div className="text-yellow-400 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Pro Tip</h4>
                    <p className="text-[#8b949e] text-sm">
                      Try exploring the interactive editor in this tool to
                      experiment with Enigma code. You can write code and
                      instantly see the tokens and AST representation to better
                      understand how the language works.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "examples" && (
          <div>
            <div className="mb-6 bg-[#1c2128] rounded-lg p-5 border border-[#30363d]">
              <h2 className="text-xl font-bold text-white mb-3">
                Example Programs
              </h2>
              <p className="text-[#8b949e]">
                Explore these example programs to learn Enigma programming
                patterns and techniques. Each example demonstrates different
                language features and coding approaches.
              </p>
            </div>

            {examplePrograms.map((example) => (
              <CodeExample
                key={example.title}
                title={example.title}
                description={example.description}
                code={example.code}
              />
            ))}

            <div className="mt-8 p-4 bg-[#161b22] border border-[#30363d] rounded-md">
              <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                <Play size={18} className="text-[#4d9375]" />
                Try It Yourself
              </h3>
              <p className="text-[#8b949e] mb-3">
                The best way to learn Enigma is by writing your own programs.
                Try modifying these examples or creating new ones in the editor
                to deepen your understanding of the language.
              </p>
              <button className="bg-[#4d9375] hover:bg-[#3a7057] text-white py-2 px-4 rounded-md transition-colors text-sm font-medium">
                Open in Editor
              </button>
            </div>
          </div>
        )}

        {activeTab === "reference" && (
          <div>
            <div className="mb-6 bg-[#1c2128] rounded-lg p-5 border border-[#30363d]">
              <h2 className="text-xl font-bold text-white mb-3">
                Syntax Reference
              </h2>
              <p className="text-[#8b949e]">
                A comprehensive reference of Enigma's syntax and language
                constructs. Use this guide to understand the building blocks of
                the language and how they fit together.
              </p>
            </div>

            <SyntaxReference />

            <div className="mt-8 p-4 bg-[#161b22] border border-[#30363d] rounded-md">
              <h3 className="text-lg font-medium text-white mb-2">
                Understanding AST Nodes
              </h3>
              <p className="text-[#8b949e]">
                Each syntax element in Enigma corresponds to a node in the
                Abstract Syntax Tree (AST). The AST view in the editor shows how
                your code is parsed and structured by the language interpreter.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-[#0d1117] p-3 rounded-md border border-[#30363d]">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-purple-600">Statements</Badge>
                  </div>
                  <p className="text-[#8b949e] text-sm">
                    Statements are complete instructions that perform actions.
                    Examples: variable declarations, return statements, loops.
                  </p>
                </div>

                <div className="bg-[#0d1117] p-3 rounded-md border border-[#30363d]">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-600">Expressions</Badge>
                  </div>
                  <p className="text-[#8b949e] text-sm">
                    Expressions are code that evaluates to a value. Examples:
                    function calls, operations, literals.
                  </p>
                </div>

                <div className="bg-[#0d1117] p-3 rounded-md border border-[#30363d]">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-600">Literals</Badge>
                  </div>
                  <p className="text-[#8b949e] text-sm">
                    Literals are fixed values in the code. Examples: integers,
                    strings, booleans, arrays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageGuide;
