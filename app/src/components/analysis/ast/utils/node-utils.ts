/* eslint-disable @typescript-eslint/no-explicit-any */
export const hasChildren = (node: any): boolean => {
  if (!node || typeof node !== "object") return false;

  for (const key in node) {
    const value = node[key as keyof Node];
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object" &&
      value[0]?.tokenLiteral
    ) {
      return true;
    }
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      value?.tokenLiteral &&
      key !== "token"
    ) {
      return true;
    }
  }
  return false;
};

export const getSimpleProperties = (node: any) => {
  const simpleProps: Record<string, string> = {};
  for (const key in node) {
    const value = node[key as keyof Node];
    if (
      typeof value === "function" ||
      key.startsWith("_") ||
      key === "token" ||
      key === "constructor"
    )
      continue;

    if (
      value === null ||
      typeof value !== "object" ||
      (typeof value === "object" &&
        value !== null &&
        "value" in value &&
        Object.keys(value).length === 1)
    ) {
      if (typeof value === "object" && value !== null && "value" in value) {
        simpleProps[key] = String(value.value);
      } else {
        simpleProps[key] = String(value);
      }
    }
  }
  return simpleProps;
};

// Get complex properties
export const getComplexProperties = (node: any) => {
  const complexProps: Record<string, any> = {};
  for (const key in node) {
    const value = node[key];
    if (
      typeof value === "function" ||
      key.startsWith("_") ||
      key === "token" ||
      key === "constructor"
    )
      continue;

    if (Array.isArray(value) && value.length > 0) {
      if (
        typeof value[0] === "object" &&
        value[0] !== null &&
        value[0]?.tokenLiteral
      ) {
        complexProps[key] = value;
      }
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(
        typeof value === "object" &&
        "value" in value &&
        Object.keys(value).length === 1
      ) &&
      value?.tokenLiteral
    ) {
      complexProps[key] = value;
    }
  }
  return complexProps;
};

export const getNodeSummary = (nodeType: string, node: any) => {
  switch (nodeType) {
    case "Identifier":
      return `Variable: ${node.toString() || ""}`;
    case "IntegerLiteral":
      return `Number: ${node.toString() || ""}`;
    case "FloatLiteral":
      return `Float: ${node.toString() || ""}`;
    case "StringLiteral":
      return `String: "${node.toString() || ""}"`;
    case "InfixExpression":
      return `Operation: ${node.toString() || ""}`;
    case "CallExpression": {
      const funcName = node.func?.toString() || "function";
      return `Call: ${funcName}()`;
    }
    default:
      return nodeType;
  }
};
