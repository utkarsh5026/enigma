import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { sampleCodeSnippets, getRandomSampleCode } from "@/utils/snippets";
import ToolBar from "./editor-toolbar";
import StatusBar from "./status-bar";
import { useMobile } from "@/hooks/use-mobile";
import { DesktopLayout, MobileLayout } from "./responsive-layouts";
import { useTokens } from "@/hooks/use-tokens";

const examples = Object.keys(sampleCodeSnippets);

const Enigma: React.FC = () => {
  const [code, setCode] = useState("");
  const { tokens } = useTokens(code);
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
        examples={examples}
      />

      <motion.div className="flex-1 min-h-0">
        {isMobile ? (
          <MobileLayout
            code={code}
            handleCodeChange={handleCodeChange}
            tokens={tokens}
          />
        ) : (
          <DesktopLayout
            code={code}
            handleCodeChange={handleCodeChange}
            tokens={tokens}
          />
        )}
      </motion.div>

      <StatusBar tokens={tokens.length} />
    </motion.div>
  );
};

export default Enigma;
