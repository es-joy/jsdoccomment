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
 * @returns {Node}
 */
function parseAddingParents (code, config = ESPREE_DEFAULT_CONFIG) {
  const ast = espreeParse(code, config);
  traverse(ast, {
    enter (node, parent) {
      node.parent = parent;
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

    const parsed = getReducedASTNode(ast.body[0], sourceCode);
    expect(parsed.type).to.equal('FunctionDeclaration');
  });
});
