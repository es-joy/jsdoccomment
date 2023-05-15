export function hasSeeWithLink(spec: import('comment-parser').Spec): boolean;
export const defaultNoTypes: string[];
export const defaultNoNames: string[];
export function getTokenizers({ noTypes, noNames }?: {
    noTypes?: string[] | undefined;
    noNames?: string[] | undefined;
}): import("comment-parser/lib/parser/tokenizers/index.js").Tokenizer[];
/**
 * Accepts a comment token and converts it into `comment-parser` AST.
 * @param {{value: string}} commentNode
 * @param {string} [indent=""] Whitespace
 * @returns {import('./index.js').JsdocBlockWithInline}
 */
export function parseComment(commentNode: {
    value: string;
}, indent?: string | undefined): import('./index.js').JsdocBlockWithInline;
//# sourceMappingURL=parseComment.d.ts.map