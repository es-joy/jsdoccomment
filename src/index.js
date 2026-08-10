/* eslint-disable unicorn/no-barrel-files -- Reexports with typedefs */
/**
 * An inline tag whose `text` is the unescaped label value.
 * @typedef {import('./commentParserToESTree.js').JsdocInlineTagNoType & {
 *   start: number,
 *   end: number,
 * }} InlineTag
 */

/**
 * @typedef {import('comment-parser').Spec & {
 *   line?: import('./commentParserToESTree.js').Integer,
 *   inlineTags: (import('./commentParserToESTree.js').JsdocInlineTagNoType & {
 *     line?: import('./commentParserToESTree.js').Integer
 *   })[]
 * }} JsdocTagWithInline
 */

/**
 * Expands on comment-parser's `Block` interface.
 * @typedef {{
 *   description: string,
 *   source: import('comment-parser').Line[],
 *   problems: import('comment-parser').Problem[],
 *   tags: JsdocTagWithInline[],
 *   inlineTags: (import('./commentParserToESTree.js').JsdocInlineTagNoType & {
 *     line?: import('./commentParserToESTree.js').Integer
 *   })[]
 * }} JsdocBlockWithInline
 */

/* eslint-disable jsdoc/reject-any-type -- API */
/**
 * @typedef {{
 *   preferRawType?: boolean,
 *   jtppStringificationRules?: (
 *     node: import('estree').Node, options?: any
 *   ) => string
 * }} ESTreeToStringOptions
 */
/* eslint-enable jsdoc/reject-any-type -- API */

/**
 * @callback CommentHandler
 * @param {string} commentSelector
 * @param {import('./index.js').JsdocBlockWithInline} jsdoc
 * @returns {boolean}
 */

export {visitorKeys as jsdocTypeVisitorKeys} from 'jsdoc-type-pratt-parser';

export * from 'jsdoc-type-pratt-parser';

export * from './commentHandler.js';
export * from './commentParserToESTree.js';
export * from './estreeToString.js';
export * from './jsdoccomment.js';
export * from './parseComment.js';
export * from './parseInlineTags.js';
