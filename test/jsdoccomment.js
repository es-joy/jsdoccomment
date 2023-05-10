// eslint-disable-next-line no-shadow -- Needed for TS
import {expect} from 'chai';
import {parse as espreeParse} from 'espree';
import {traverse} from 'estraverse';
import {SourceCode} from 'eslint';

import {
  getReducedASTNode
  // getJSDocComment, getDecorator, findJSDocComment
} from '../src/index.js';

const ESPREE_DEFAULT_CONFIG = {
  ecmaVersion: 6,
  comment: true,
  tokens: true,
  range: true,
  loc: true
};

/**
 * @param {string} code
 * @param {{
 *   ecmaVersion: number,
 *   comment: boolean,
 *   tokens: boolean,
 *   range: boolean,
 *   loc: boolean
 * }} config
 * @returns {import('eslint').AST.Program}
 */
function parseAddingParents (code, config = ESPREE_DEFAULT_CONFIG) {
  const ast = espreeParse(code, config);
  traverse(ast, {
    enter (node, parent) {
      if (!node || !parent) {
        return;
      }
      /** @type {import('estree').Node & {parent: import('estree').Node}} */ (
        node
      ).parent = parent;
    }
  });
  return ast;
}

describe('`getReducedASTNode`', function () {
  it('gets `FunctionDeclaration`', function () {
    const code = `function quux () {}`;
    const ast = parseAddingParents(code);

    // console.log('ast', Object.keys(ast));

    const sourceCode = new SourceCode(code, ast);

    const parsed = getReducedASTNode(
      /** @type {import('eslint').Rule.Node} */ (ast.body[0]), sourceCode
    );
    expect(parsed.type).to.equal('FunctionDeclaration');
  });
});
