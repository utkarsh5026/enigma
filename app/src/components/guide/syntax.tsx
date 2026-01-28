import { keywords, operators } from "./data";

export const highlightSyntax = (code: string) => {
  const lines = code.split("\n");

  return (
    <pre className="font-source-code-pro overflow-x-auto text-sm font-semibold whitespace-pre">
      {lines.map((line, lineIndex) => {
        // Process line for syntax highlighting
        const result = [];
        let currentWord = "";
        let inString = false;

        const processCurrentWord = () => {
          if (currentWord === "") return;

          let element;
          if (keywords.includes(currentWord)) {
            element = (
              <span
                key={`word-${lineIndex}-${result.length}`}
                className="text-[#ff7b72]"
              >
                {currentWord}
              </span>
            );
          } else if (operators.includes(currentWord)) {
            element = (
              <span
                key={`word-${lineIndex}-${result.length}`}
                className="text-[#ff7b72]"
              >
                {currentWord}
              </span>
            );
          } else if (!isNaN(Number(currentWord))) {
            element = (
              <span
                key={`word-${lineIndex}-${result.length}`}
                className="text-[#f2cc60]"
              >
                {currentWord}
              </span>
            );
          } else {
            element = (
              <span key={`word-${lineIndex}-${result.length}`}>
                {currentWord}
              </span>
            );
          }

          result.push(element);
          currentWord = "";
        };

        for (let i = 0; i < line.length; i++) {
          const char = line[i];

          // Handle comments
          if (char === "/" && line[i + 1] === "/" && !inString) {
            processCurrentWord();
            result.push(
              <span
                key={`comment-${lineIndex}`}
                className="text-[#8b949e] italic"
              >
                {line.substring(i)}
              </span>
            );
            break;
          }

          // Handle strings
          if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
            processCurrentWord();
            inString = !inString;

            if (inString) {
              currentWord = '"';
            } else {
              currentWord += '"';
              result.push(
                <span
                  key={`string-${lineIndex}-${i}`}
                  className="text-[#a5d6ff]"
                >
                  {currentWord}
                </span>
              );
              currentWord = "";
            }
            continue;
          }

          if (inString) {
            currentWord += char;
            continue;
          }

          // Handle word boundaries and operators
          if (
            /\s/.test(char) ||
            operators.includes(char) ||
            "(){}[];,:".includes(char)
          ) {
            processCurrentWord();

            if (operators.includes(char)) {
              result.push(
                <span key={`op-${lineIndex}-${i}`} className="text-[#ff7b72]">
                  {char}
                </span>
              );
            } else if ("(){}[];,:".includes(char)) {
              result.push(
                <span
                  key={`punct-${lineIndex}-${i}`}
                  className="text-[#8b949e]"
                >
                  {char}
                </span>
              );
            } else {
              result.push(<span key={`space-${lineIndex}-${i}`}>{char}</span>);
            }
          } else {
            currentWord += char;
          }
        }

        processCurrentWord();

        return (
          <div
            key={`line-${lineIndex}`}
            className="font-['JetBrains Mono'] leading-relaxed"
          >
            {result}
          </div>
        );
      })}
    </pre>
  );
};
