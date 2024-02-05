export function hasSeeWithLink(spec: import('comment-parser').Spec): boolean;
export const defaultNoTypes: string[];
export const defaultNoNames: string[];
/**
 * Can't import `comment-parser/es6/parser/tokenizers/index.js`,
 *   so we redefine here.
 */
export type CommentParserTokenizer = (spec: import('comment-parser').Spec) => import('comment-parser').Spec;
/**
 * Can't import `comment-parser/es6/parser/tokenizers/index.js`,
 *   so we redefine here.
 * @typedef {(spec: import('comment-parser').Spec) =>
 *   import('comment-parser').Spec} CommentParserTokenizer
 */
/**
 * @param {object} [cfg]
 * @param {string[]} [cfg.noTypes]
 * @param {string[]} [cfg.noNames]
 * @returns {CommentParserTokenizer[]}
 */
export function getTokenizers({ noTypes, noNames }?: {
    noTypes?: string[] | undefined;
    noNames?: string[] | undefined;
} | undefined): CommentParserTokenizer[];
/**
 * Accepts a comment token or complete comment string and converts it into
 * `comment-parser` AST.
 * @param {string | {value: string}} commentOrNode
 * @param {string} [indent] Whitespace
 * @returns {import('./index.js').JsdocBlockWithInline}
 */
export function parseComment(commentOrNode: string | {
    value: string;
}, indent?: string | undefined): import('./index.js').JsdocBlockWithInline;
//# sourceMappingURL=parseComment.d.ts.map