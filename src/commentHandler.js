import esquery from 'esquery';

import {
  visitorKeys as jsdocTypePrattParserVisitorKeys
} from 'jsdoc-type-pratt-parser';

import {
  commentParserToESTree, jsdocVisitorKeys
} from './commentParserToESTree.js';

/* eslint-disable jsdoc/reject-any-type -- Arbitrary settings */
/**
 * @param {{
 *   mode: import('jsdoc-type-pratt-parser').ParseMode,
 *   [key: string]: any
 * }} settings
 * @returns {import('.').CommentHandler}
 */
const commentHandler = (settings) => {
  /* eslint-enable jsdoc/reject-any-type -- Arbitrary settings */
  /**
   * @type {import('.').CommentHandler}
   */
  return (commentSelector, jsdoc) => {
    const {mode} = settings;

    const selector = esquery.parse(commentSelector);

    const ast = commentParserToESTree(jsdoc, mode);

    const castAst = /** @type {unknown} */ (ast);

    return esquery.matches(/** @type {import('estree').Node} */ (
      castAst
    ), selector, undefined, {
      visitorKeys: {
        ...jsdocTypePrattParserVisitorKeys,
        ...jsdocVisitorKeys
      }
    });
  };
};

export {commentHandler};
