export { visitorKeys as jsdocTypeVisitorKeys } from "jsdoc-type-pratt-parser";
export * from "jsdoc-type-pratt-parser";
export * from "./parseComment.js";
export * from "./commentParserToESTree.js";
export * from "./jsdoccomment.js";
export { default as commentHandler } from "./commentHandler.js";
export { default as toCamelCase } from "./toCamelCase.js";
export { default as estreeToString } from "./estreeToString.js";
export type InlineTag = import('./commentParserToESTree.js').JsdocInlineTagNoType & {
    start: number;
    end: number;
};
export type ESTreeToStringOptions = {
    preferRawType?: boolean;
};
export type CommentHandler = (commentSelector: string, jsdoc: import('comment-parser').Block & {
    inlineTags: import('./commentParserToESTree.js').JsdocInlineTagNoType[];
}) => boolean;
//# sourceMappingURL=index.d.ts.map