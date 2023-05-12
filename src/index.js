/**
 * @typedef {import('./commentParserToESTree.js').JsdocInlineTagNoType & {
 *   start: number,
 *   end: number,
 * }} InlineTag
 */

/**
 * @typedef {{preferRawType?: boolean}} ESTreeToStringOptions
 */

/**
 * @callback CommentHandler
 * @param {string} commentSelector
 * @param {import('comment-parser').Block & {
 *   inlineTags: import('./commentParserToESTree.js').JsdocInlineTagNoType[]
 * }} jsdoc
 * @returns {boolean}
 */

export {visitorKeys as jsdocTypeVisitorKeys} from 'jsdoc-type-pratt-parser';

export * from 'jsdoc-type-pratt-parser';

export {default as commentHandler} from './commentHandler.js';

export {default as toCamelCase} from './toCamelCase.js';

export * from './parseComment.js';

export * from './commentParserToESTree.js';

export * from './jsdoccomment.js';

export {default as estreeToString} from './estreeToString.js';
