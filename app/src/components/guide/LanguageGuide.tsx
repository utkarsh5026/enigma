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
    <div className="container mx-auto py-8 px-4 relative">
      {/* Decorative blurred circles */}
      <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-[#4d9375]/20 filter blur-[100px] opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-40 -right-20 w-96 h-96 rounded-full bg-[#7aa2f7]/20 filter blur-[120px] opacity-40 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 rounded-full bg-[#bb9af7]/10 filter blur-[120px] opacity-30 pointer-events-none"></div>

      <div className="relative z-10 mb-12 text-center">
        <div className="inline-flex items-center justify-center gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4d9375] to-[#7aa2f7] blur-lg opacity-70"></div>
            <div className="relative bg-[#1a1b26] p-3 rounded-full border border-[#4d9375]/30">
              <Terminal size={40} className="text-[#4d9375]" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4d9375] via-[#7aa2f7] to-[#bb9af7] text-transparent bg-clip-text">
            Enigma Programming Language
          </h1>
        </div>
        <p className="text-[#a9b1d6] text-lg max-w-3xl mx-auto leading-relaxed">
          A dynamically-typed language with first-class functions, closures, and
          a clean, expressive syntax. Designed for readability and productivity.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex justify-center mb-10 border-b border-[#30363d]/40">
        <button
          className={`px-8 py-4 text-sm font-medium relative ${
            activeTab === "overview"
              ? "text-[#4d9375]"
              : "text-[#8b949e] hover:text-white"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          <span className="flex items-center gap-2">
            <Grid size={16} />
            Language Overview
          </span>
          {activeTab === "overview" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4d9375]/80 to-[#4d9375]/20"></span>
          )}
        </button>
        <button
          className={`px-8 py-4 text-sm font-medium relative ${
            activeTab === "examples"
              ? "text-[#4d9375]"
              : "text-[#8b949e] hover:text-white"
          }`}
          onClick={() => setActiveTab("examples")}
        >
          <span className="flex items-center gap-2">
            <Code size={16} />
            Code Examples
          </span>
          {activeTab === "examples" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4d9375]/80 to-[#4d9375]/20"></span>
          )}
        </button>
        <button
          className={`px-8 py-4 text-sm font-medium relative ${
            activeTab === "reference"
              ? "text-[#4d9375]"
              : "text-[#8b949e] hover:text-white"
          }`}
          onClick={() => setActiveTab("reference")}
        >
          <span className="flex items-center gap-2">
            <BookOpen size={16} />
            Syntax Reference
          </span>
          {activeTab === "reference" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4d9375]/80 to-[#4d9375]/20"></span>
          )}
        </button>
      </div>

      {/* Tab content */}
      <div className="max-w-4xl mx-auto relative z-10">
        {activeTab === "overview" && (
          <div>
            <Card className="bg-[#0d1117]/60 border-[#30363d]/50 backdrop-blur-xl mb-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4d9375]/5 to-[#7aa2f7]/5 pointer-events-none"></div>
              <CardHeader className="pb-2 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#4d9375]/10 rounded-full filter blur-3xl"></div>
                <CardTitle className="text-2xl font-bold text-white">
                  Language Features
                </CardTitle>
                <CardDescription className="text-[#a9b1d6]">
                  Key elements and capabilities of the Enigma language
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-3">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <Card className="bg-[#0d1117]/60 border-[#30363d]/50 backdrop-blur-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7aa2f7]/5 to-transparent pointer-events-none"></div>
                <CardHeader className="pb-2 relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#7aa2f7]/10 rounded-full filter blur-2xl"></div>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Code size={18} className="text-[#7aa2f7]" />
                    Higher-order Functions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#a9b1d6] mb-4 leading-relaxed">
                    Functions in Enigma are first-class citizens, allowing you
                    to pass them as arguments, return them from other functions,
                    and assign them to variables.
                  </p>
                  <div className="bg-[#161b22]/80 border border-[#30363d]/30 rounded-lg p-4 font-mono text-sm text-[#e6edf3] backdrop-blur-sm">
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

              <Card className="bg-[#0d1117]/60 border-[#30363d]/50 backdrop-blur-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#bb9af7]/5 to-transparent pointer-events-none"></div>
                <CardHeader className="pb-2 relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#bb9af7]/10 rounded-full filter blur-2xl"></div>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Variable size={18} className="text-[#bb9af7]" />
                    Closures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#a9b1d6] mb-4 leading-relaxed">
                    Enigma functions create closures, capturing the environment
                    where they were defined, which enables powerful patterns
                    like function factories and stateful functions.
                  </p>
                  <div className="bg-[#161b22]/80 border border-[#30363d]/30 rounded-lg p-4 font-mono text-sm text-[#e6edf3] backdrop-blur-sm">
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

            <Card className="bg-[#0d1117]/60 border-[#30363d]/50 backdrop-blur-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#e0af68]/5 to-transparent pointer-events-none"></div>
              <CardHeader className="pb-2 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#e0af68]/10 rounded-full filter blur-3xl"></div>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Terminal size={18} className="text-[#e0af68]" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#a9b1d6] mb-5 leading-relaxed">
                  Ready to start coding in Enigma? Here's a simple "Hello World"
                  program to get you started:
                </p>
                <div className="bg-[#161b22]/80 border border-[#30363d]/30 rounded-lg p-5 font-mono text-sm text-[#e6edf3] mb-8 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -top-6 -left-6 w-12 h-12 bg-[#4d9375]/20 rounded-full filter blur-xl"></div>
                  <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-[#7aa2f7]/20 rounded-full filter blur-xl"></div>
                  {highlightSyntax(`// Define a greeting function
let greet = fn(name) {
  return "Hello, " + name + "!";
};

// Call the function
let message = greet("World");

// Print to console
puts(message);  // Outputs: Hello, World!`)}
                </div>

                <h3 className="text-white font-medium mb-3 text-lg">
                  Key Points to Remember:
                </h3>
                <ul className="text-[#a9b1d6] space-y-3 mb-6 ml-1">
                  <li className="flex gap-3 items-start">
                    <span className="text-[#4d9375] bg-[#4d9375]/10 p-1 rounded-full flex items-center justify-center w-5 h-5 mt-0.5">
                      •
                    </span>
                    <span>
                      Variables are declared with{" "}
                      <code className="bg-[#161b22]/80 px-2 py-0.5 rounded text-[#f7768e]">
                        let
                      </code>{" "}
                      and constants with{" "}
                      <code className="bg-[#161b22]/80 px-2 py-0.5 rounded text-[#f7768e]">
                        const
                      </code>
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-[#4d9375] bg-[#4d9375]/10 p-1 rounded-full flex items-center justify-center w-5 h-5 mt-0.5">
                      •
                    </span>
                    <span>
                      Functions are defined with{" "}
                      <code className="bg-[#161b22]/80 px-2 py-0.5 rounded text-[#bb9af7]">
                        fn
                      </code>{" "}
                      keyword and always return a value
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-[#4d9375] bg-[#4d9375]/10 p-1 rounded-full flex items-center justify-center w-5 h-5 mt-0.5">
                      •
                    </span>
                    <span>
                      Statements end with semicolons{" "}
                      <code className="bg-[#161b22]/80 px-2 py-0.5 rounded text-[#89ddff]">
                        ;
                      </code>
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-[#4d9375] bg-[#4d9375]/10 p-1 rounded-full flex items-center justify-center w-5 h-5 mt-0.5">
                      •
                    </span>
                    <span>
                      Code blocks are enclosed in braces{" "}
                      <code className="bg-[#161b22]/80 px-2 py-0.5 rounded text-[#89ddff]">
                        {}
                      </code>
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-[#4d9375] bg-[#4d9375]/10 p-1 rounded-full flex items-center justify-center w-5 h-5 mt-0.5">
                      •
                    </span>
                    <span>
                      String concatenation uses the{" "}
                      <code className="bg-[#161b22]/80 px-2 py-0.5 rounded text-[#ff9e64]">
                        +
                      </code>{" "}
                      operator
                    </span>
                  </li>
                </ul>

                <div className="bg-gradient-to-br from-[#1c2128]/80 to-[#1c2128]/60 rounded-xl p-6 border border-[#30363d]/50 backdrop-blur-md flex items-start gap-4 relative overflow-hidden">
                  <div className="absolute -top-10 -left-10 w-20 h-20 bg-[#e0af68]/20 rounded-full filter blur-2xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-[#e0af68]/10 rounded-full filter blur-2xl"></div>
                  <div className="text-[#e0af68] bg-[#e0af68]/10 p-2 rounded-lg flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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
                  <div className="relative">
                    <h4 className="text-white font-medium text-lg mb-2">
                      Pro Tip
                    </h4>
                    <p className="text-[#a9b1d6] leading-relaxed">
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
            <div className="mb-8 bg-gradient-to-br from-[#1c2128]/80 to-[#1c2128]/60 rounded-xl p-6 border border-[#30363d]/50 backdrop-blur-md relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#7aa2f7]/10 rounded-full filter blur-3xl"></div>
              <h2 className="text-xl font-bold text-white mb-3 relative z-10">
                Example Programs
              </h2>
              <p className="text-[#a9b1d6] leading-relaxed relative z-10">
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

            <div className="mt-10 bg-gradient-to-br from-[#1c2128]/80 to-[#161b22]/80 rounded-xl p-6 border border-[#30363d]/50 backdrop-blur-md relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#4d9375]/10 rounded-full filter blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                  <div className="bg-[#4d9375]/10 p-1.5 rounded-lg">
                    <Play size={18} className="text-[#4d9375]" />
                  </div>
                  Try It Yourself
                </h3>
                <p className="text-[#a9b1d6] mb-4 leading-relaxed">
                  The best way to learn Enigma is by writing your own programs.
                  Try modifying these examples or creating new ones in the
                  editor to deepen your understanding of the language.
                </p>
                <button className="bg-gradient-to-r from-[#4d9375] to-[#3a7057] text-white py-2.5 px-5 rounded-lg transition-all text-sm font-medium hover:shadow-lg hover:shadow-[#4d9375]/20">
                  Open in Editor
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reference" && (
          <div>
            <div className="mb-8 bg-gradient-to-br from-[#1c2128]/80 to-[#1c2128]/60 rounded-xl p-6 border border-[#30363d]/50 backdrop-blur-md relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#bb9af7]/10 rounded-full filter blur-3xl"></div>
              <h2 className="text-xl font-bold text-white mb-3 relative z-10">
                Syntax Reference
              </h2>
              <p className="text-[#a9b1d6] leading-relaxed relative z-10">
                A comprehensive reference of Enigma's syntax and language
                constructs. Use this guide to understand the building blocks of
                the language and how they fit together.
              </p>
            </div>

            <SyntaxReference />

            <div className="mt-10 bg-gradient-to-br from-[#161b22]/80 to-[#161b22]/60 rounded-xl p-6 border border-[#30363d]/50 backdrop-blur-md">
              <h3 className="text-lg font-medium text-white mb-3">
                Understanding AST Nodes
              </h3>
              <p className="text-[#a9b1d6] mb-5 leading-relaxed">
                Each syntax element in Enigma corresponds to a node in the
                Abstract Syntax Tree (AST). The AST view in the editor shows how
                your code is parsed and structured by the language interpreter.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#0d1117]/60 p-4 rounded-lg border border-[#30363d]/50 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600/20 rounded-full filter blur-xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-purple-600/90 text-white backdrop-blur-sm">
                        Statements
                      </Badge>
                    </div>
                    <p className="text-[#a9b1d6] text-sm leading-relaxed">
                      Statements are complete instructions that perform actions.
                      Examples: variable declarations, return statements, loops.
                    </p>
                  </div>
                </div>

                <div className="bg-[#0d1117]/60 p-4 rounded-lg border border-[#30363d]/50 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600/20 rounded-full filter blur-xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-600/90 text-white backdrop-blur-sm">
                        Expressions
                      </Badge>
                    </div>
                    <p className="text-[#a9b1d6] text-sm leading-relaxed">
                      Expressions are code that evaluates to a value. Examples:
                      function calls, operations, literals.
                    </p>
                  </div>
                </div>

                <div className="bg-[#0d1117]/60 p-4 rounded-lg border border-[#30363d]/50 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-600/20 rounded-full filter blur-xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-600/90 text-white backdrop-blur-sm">
                        Literals
                      </Badge>
                    </div>
                    <p className="text-[#a9b1d6] text-sm leading-relaxed">
                      Literals are fixed values in the code. Examples: integers,
                      strings, booleans, arrays.
                    </p>
                  </div>
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
