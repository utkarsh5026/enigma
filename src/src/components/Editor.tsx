import React, { useState } from "react";
import EnigmaEditor from "./EnigmaEditor";
import { Col, Layout, Row } from "antd";
import TokenDisplay from "./TokenDisplay";
import Lexer from "../lang/lexer/lexer";
import { Token, TokenType } from "../lang/token/token";

const { Content } = Layout;

const MutantEditor: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [tokens, setTokens] = useState<Token[]>([]);

  const handleCodeChange = (newCode: string) => {
    if (newCode && newCode.length > 0) {
      setCode(newCode);
      const lexer = new Lexer(newCode);
      let token = lexer.nextToken();
      const newTokens: Token[] = [];
      while (token.type != TokenType.EOF) {
        newTokens.push(token);
        token = lexer.nextToken();
      }
      setTokens(newTokens);
    } else {
      setTokens([]);
      setCode("");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", height: "100vh", width: "100vw" }}>
      <Content style={{ padding: "20px 50px", height: "100%" }}>
        <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}></Row>
        <Row gutter={[16, 16]} style={{ height: "100%" }}>
          <Col span={14}>
            <EnigmaEditor code={code} onCodeChange={handleCodeChange} />
          </Col>
          <Col span={10}>
            <TokenDisplay tokens={tokens} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default MutantEditor;
