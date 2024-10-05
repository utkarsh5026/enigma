import React from "react";
import { Token, TokenType } from "../lang/token/token";
import { motion } from "framer-motion";
import { Table } from "antd";

const getTokenColor = (type: TokenType): string => {
  const colorMap: Record<TokenType, string> = {
    [TokenType.IDENTIFIER]: "#61dafb", // light blue
    [TokenType.INT]: "#98c379", // light green
    [TokenType.STRING]: "#e5c07b", // light yellow
    [TokenType.FUNCTION]: "#c678dd", // light purple
    [TokenType.LET]: "#c678dd",
    [TokenType.IF]: "#c678dd",
    [TokenType.ELSE]: "#c678dd",
    [TokenType.RETURN]: "#c678dd",
    [TokenType.WHILE]: "#c678dd",
    [TokenType.BREAK]: "#c678dd",
    [TokenType.CONTINUE]: "#c678dd",
    [TokenType.TRUE]: "#e06c75", // light red
    [TokenType.FALSE]: "#e06c75",
    [TokenType.ASSIGN]: "#56b6c2", // light cyan
    [TokenType.PLUS]: "#56b6c2",
    [TokenType.MINUS]: "#56b6c2",
    [TokenType.BANG]: "#56b6c2",
    [TokenType.ASTERISK]: "#56b6c2",
    [TokenType.SLASH]: "#56b6c2",
    [TokenType.EQ]: "#56b6c2",
    [TokenType.NOT_EQ]: "#56b6c2",
    [TokenType.ILLEGAL]: "",
    [TokenType.EOF]: "",
    [TokenType.MODULUS]: "",
    [TokenType.LESS_THAN]: "",
    [TokenType.GREATER_THAN]: "",
    [TokenType.COMMA]: "",
    [TokenType.SEMICOLON]: "",
    [TokenType.COLON]: "",
    [TokenType.LPAREN]: "",
    [TokenType.RPAREN]: "",
    [TokenType.LBRACE]: "",
    [TokenType.RBRACE]: "",
    [TokenType.LBRACKET]: "",
    [TokenType.RBRACKET]: "",
    [TokenType.PLUS_ASSIGN]: "",
    [TokenType.MINUS_ASSIGN]: "",
    [TokenType.ASTERISK_ASSIGN]: "",
    [TokenType.SLASH_ASSIGN]: "",
    [TokenType.AND]: "",
    [TokenType.OR]: "",
    [TokenType.BITWISE_AND]: "",
    [TokenType.BITWISE_OR]: "",
    [TokenType.BITWISE_XOR]: "",
    [TokenType.BITWISE_NOT]: "",
    [TokenType.BITWISE_LEFT_SHIFT]: "",
    [TokenType.BITWISE_RIGHT_SHIFT]: "",
  };
  return colorMap[type] || "#abb2bf"; // light gray for default
};

const styles = {
  container: {
    backgroundColor: "#282c34",
    padding: "2rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#e6e6e6",
    textAlign: "center" as const,
  },
  lineContainer: {
    backgroundColor: "#21252b",
    overflow: "hidden",
    marginBottom: "1.5rem",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)",
  },
  lineHeader: {
    backgroundColor: "#3e4451",
    padding: "0.75rem 1.25rem",
    fontWeight: "600",
    color: "#e6e6e6",
    fontSize: "1.1rem",
  },
};

interface TokenDisplayProps {
  tokens: Token[];
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ tokens }) => {
  const tokensByLine = tokens.reduce((acc, token) => {
    const { line } = token.position;
    if (!acc[line]) {
      acc[line] = [];
    }
    acc[line].push(token);
    return acc;
  }, {} as Record<number, Token[]>);

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text: TokenType) => (
        <span style={{ color: getTokenColor(text), fontWeight: "bold" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Literal",
      dataIndex: "literal",
      key: "literal",
      render: (text: string) => (
        <code
          style={{
            backgroundColor: "#2c313a",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.25rem",
            fontFamily: "'Fira Code', monospace",
          }}
        >
          {text}
        </code>
      ),
    },
    {
      title: "Column",
      dataIndex: ["position", "column"],
      key: "column",
    },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Token Analysis</h2>
      {Object.entries(tokensByLine).map(([line, lineTokens]) => (
        <motion.div
          key={line}
          style={styles.lineContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={styles.lineHeader}>Line {line}</div>
          <Table
            dataSource={lineTokens}
            columns={columns}
            pagination={false}
            size="small"
            rowKey={(record, index) =>
              `${record.position.line}-${record.position.column}-${index}`
            }
          />
        </motion.div>
      ))}
    </div>
  );
};

export default TokenDisplay;
