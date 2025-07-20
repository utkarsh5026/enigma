import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  sampleCodeSnippets,
  getRandomSampleCode,
  snippetCategories,
} from "@/utils/snippets";
import ToolBar from "./editor-toolbar";
import StatusBar from "./status-bar";
import { useMobile } from "@/hooks/use-mobile";
import { DesktopLayout, MobileLayout } from "./responsive-layouts";
import { useTokens } from "@/hooks/use-tokens";

// Create categorized examples structure with emojis and display names
const createCategorizedExamples = () => {
  const categoryConfig = {
    beginner: {
      emoji: "🌱",
      name: "Beginner Friendly",
      description: "Start your coding journey",
    },
    algorithms: {
      emoji: "⚡",
      name: "Algorithms",
      description: "Sorting and searching",
    },
    dataStructures: {
      emoji: "🏗️",
      name: "Data Structures",
      description: "Arrays, objects, and more",
    },
    games: {
      emoji: "🎮",
      name: "Games & Fun",
      description: "Interactive programs",
    },
    mathematics: {
      emoji: "🧮",
      name: "Mathematics",
      description: "Number theory and calculations",
    },
    advanced: {
      emoji: "🚀",
      name: "Advanced",
      description: "Complex programming concepts",
    },
    objectOriented: {
      emoji: "🏛️",
      name: "Object-Oriented",
      description: "Classes and inheritance",
    },
    realWorld: {
      emoji: "🌍",
      name: "Real World",
      description: "Practical applications",
    },
    inheritance: {
      emoji: "🧬",
      name: "Inheritance",
      description: "Advanced OOP concepts",
    },
  };

  return Object.entries(snippetCategories).map(([categoryKey, examples]) => ({
    key: categoryKey,
    ...categoryConfig[categoryKey as keyof typeof categoryConfig],
    examples: examples.map((exampleKey) => ({
      key: exampleKey,
      name: formatExampleName(exampleKey),
    })),
  }));
};

// Helper function to format example names nicely
const formatExampleName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
};

const categorizedExamples = createCategorizedExamples();

const Enigma: React.FC = () => {
  const [code, setCode] = useState("");
  const {
    tokens,
    isTokenizing,
    error,
    hasTokens,
    tokenize,
    clearTokens,
    isCodeChanged,
  } = useTokens();
  const [selectedExample, setSelectedExample] = useState<
    keyof typeof sampleCodeSnippets | null
  >(null);
  const { isMobile } = useMobile();

  useEffect(() => {
    const randomExample = getRandomSampleCode();
    handleCodeChange(randomExample);
  }, []);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const loadExample = (exampleKey: keyof typeof sampleCodeSnippets) => {
    const selectedCode = sampleCodeSnippets[exampleKey];
    if (selectedCode) {
      handleCodeChange(selectedCode);
      setSelectedExample(exampleKey);
      clearTokens(); // Clear tokens when loading new example
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const tokenProps = {
    tokens,
    isTokenizing,
    error,
    hasTokens,
    isCodeChanged,
    onTokenize: tokenize,
    onClearTokens: clearTokens,
  };

  return (
    <motion.div
      className="h-screen w-screen flex flex-col bg-[var(--tokyo-bg)] text-[var(--tokyo-fg)] overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <ToolBar
        selectedExample={selectedExample ?? ""}
        loadExample={(example: string) =>
          loadExample(example as keyof typeof sampleCodeSnippets)
        }
        categorizedExamples={categorizedExamples}
      />

      <motion.div className="flex-1 min-h-0">
        {isMobile ? (
          <MobileLayout
            code={code}
            handleCodeChange={handleCodeChange}
            tokenProps={tokenProps}
          />
        ) : (
          <DesktopLayout
            code={code}
            handleCodeChange={handleCodeChange}
            tokenProps={tokenProps}
          />
        )}
      </motion.div>

      <StatusBar tokens={tokens.length} />
    </motion.div>
  );
};

export default Enigma;
