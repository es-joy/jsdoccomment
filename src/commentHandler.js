import esquery from 'esquery';

import {
  visitorKeys as jsdocTypePrattParserVisitorKeys
} from 'jsdoc-type-pratt-parser';

import {
  commentParserToESTree, jsdocVisitorKeys
} from './commentParserToESTree.js';

/**
 * @callback CommentHandler
 * @param {string} commentSelector
 * @param {import('comment-parser').Block & {
 *   inlineTags: import('./commentParserToESTree.js').JsdocInlineTagNoType[]
* }} jsdoc
 * @returns {boolean}
 */

/**
 * @param {{[name: string]: any}} settings
 * @returns {CommentHandler}
 */
const commentHandler = (settings) => {
  /**
   * @type {CommentHandler}
   */
  return (commentSelector, jsdoc) => {
    const {mode} = settings;

    const selector = esquery.parse(commentSelector);

    const ast = commentParserToESTree(jsdoc, mode);

    const _ast = /** @type {unknown} */ (ast);

    return esquery.matches(/** @type {import('estree').Node} */ (
      _ast
    ), selector, null, {
      visitorKeys: {
        ...jsdocTypePrattParserVisitorKeys,
        ...jsdocVisitorKeys
      }
    });
  };
};

export default commentHandler;
