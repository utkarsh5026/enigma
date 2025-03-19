// import { parser } from "./enigma.grammar";
// import {
//   LRLanguage,
//   LanguageSupport,
//   indentNodeProp,
//   foldNodeProp,
//   foldInside,
//   delimitedIndent,
// } from "@codemirror/language";
// import { styleTags, tags as t } from "@lezer/highlight";

// export const MutantLanguage = LRLanguage.define({
//   parser: parser.configure({
//     props: [
//       indentNodeProp.add({
//         Block: delimitedIndent({ closing: "}" }),
//         ArrayLiteral: delimitedIndent({ closing: "]" }),
//         ObjectLiteral: delimitedIndent({ closing: "}" }),
//       }),
//       foldNodeProp.add({
//         Block: foldInside,
//         ArrayLiteral: foldInside,
//         ObjectLiteral: foldInside,
//       }),
//       styleTags({
//         Identifier: t.variableName,
//         Boolean: t.bool,
//         String: t.string,
//         Number: t.number,
//         "( )": t.paren,
//         "[ ]": t.squareBracket,
//         "{ }": t.brace,
//         "if else while fn let return break continue": t.keyword,
//         "true false": t.bool,
//         "+ - * / % == != < > <= >= && || & | ^ ~ << >>": t.operator,
//         ", ;": t.separator,
//         ": =": t.definitionOperator,
//       }),
//     ],
//   }),
//   languageData: {
//     commentTokens: { line: "//" },
//   },
// });

// export function mutant() {
//   return new LanguageSupport(MutantLanguage);
// }
