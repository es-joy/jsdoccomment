/**
 * Obtained originally from {@link https://github.com/eslint/eslint/blob/master/lib/util/source-code.js#L313}.
 *
 * @license MIT
 */

/**
 * @typedef {number} Integer
 */

/**
 * Checks if the given token is a comment token or not.
 *
 * @param {import('eslint').AST.Token | {
 *   type: import('eslint').AST.TokenType|"Line"|"Block"|"Shebang"
 * }} token - The token to check.
 * @returns {boolean} `true` if the token is a comment token.
 */
const isCommentToken = (token) => {
  return token.type === 'Line' || token.type === 'Block' ||
    token.type === 'Shebang';
};

/**
 * @param {import('eslint').Rule.Node & {
 *   declaration?: {
 *     decorators: any[]
 *   },
 *   decorators?: any[]
 * }} node
 * @returns {boolean}
 */
const getDecorator = (node) => {
  return node?.declaration?.decorators?.[0] || node?.decorators?.[0] ||
      node?.parent?.decorators?.[0];
};

/**
 * Check to see if it is a ES6 export declaration.
 *
 * @param {import('eslint').Rule.Node|
 *   import('@typescript-eslint/types').TSESTree.Node
 * } astNode An AST node.
 * @returns {boolean} whether the given node represents an export declaration.
 * @private
 */
const looksLikeExport = function (astNode) {
  return astNode.type === 'ExportDefaultDeclaration' ||
    astNode.type === 'ExportNamedDeclaration' ||
    astNode.type === 'ExportAllDeclaration' ||
    astNode.type === 'ExportSpecifier';
};

/**
 * @param {import('eslint').Rule.Node|
 *   import('@typescript-eslint/types').TSESTree.Node} astNode
 * @returns {import('eslint').Rule.Node|
 *   import('@typescript-eslint/types').TSESTree.Node}
 */
const getTSFunctionComment = function (astNode) {
  const {parent} = astNode;
  /* c8 ignore next 3 */
  if (!parent) {
    return astNode;
  }
  const grandparent = parent.parent;
  /* c8 ignore next 3 */
  if (!grandparent) {
    return astNode;
  }
  const greatGrandparent = grandparent.parent;
  const greatGreatGrandparent = greatGrandparent && greatGrandparent.parent;

  // istanbul ignore if
  if (parent.type !== 'TSTypeAnnotation') {
    return astNode;
  }

  switch (grandparent.type) {
  case 'PropertyDefinition':
  case 'ClassProperty':
  case 'TSDeclareFunction':
  case 'TSMethodSignature':
  case 'TSPropertySignature':
    return grandparent;
  case 'ArrowFunctionExpression':
    /* c8 ignore next 3 */
    if (!greatGrandparent) {
      return astNode;
    }
    // istanbul ignore else
    if (
      greatGrandparent.type === 'VariableDeclarator'

    // && greatGreatGrandparent.parent.type === 'VariableDeclaration'
    ) {
      /* c8 ignore next 3 */
      if (!greatGreatGrandparent) {
        return astNode;
      }
      return greatGreatGrandparent.parent;
    }

    // istanbul ignore next
    return astNode;
  case 'FunctionExpression':
    /* c8 ignore next 3 */
    if (!greatGreatGrandparent) {
      return astNode;
    }
    // istanbul ignore else
    if (greatGrandparent.type === 'MethodDefinition') {
      return greatGrandparent;
    }

  // Fallthrough
  default:
    // istanbul ignore if
    if (grandparent.type !== 'Identifier') {
      // istanbul ignore next
      return astNode;
    }
  }

  /* c8 ignore next 3 */
  if (!greatGreatGrandparent) {
    return astNode;
  }

  // istanbul ignore next
  switch (greatGrandparent.type) {
  case 'ArrowFunctionExpression':
    // istanbul ignore else
    if (
      greatGreatGrandparent.type === 'VariableDeclarator' &&
      greatGreatGrandparent.parent.type === 'VariableDeclaration'
    ) {
      return greatGreatGrandparent.parent;
    }

    // istanbul ignore next
    return astNode;
  case 'FunctionDeclaration':
    return greatGrandparent;
  case 'VariableDeclarator':
    // istanbul ignore else
    if (greatGreatGrandparent.type === 'VariableDeclaration') {
      return greatGreatGrandparent;
    }

    // Fallthrough
  default:
    // istanbul ignore next
    return astNode;
  }
};

const invokedExpression = new Set(
  ['CallExpression', 'OptionalCallExpression', 'NewExpression']
);
const allowableCommentNode = new Set([
  'AssignmentPattern',
  'VariableDeclaration',
  'ExpressionStatement',
  'MethodDefinition',
  'Property',
  'ObjectProperty',
  'ClassProperty',
  'PropertyDefinition',
  'ExportDefaultDeclaration',
  'ReturnStatement'
]);

/**
 * Reduces the provided node to the appropriate node for evaluating
 * JSDoc comment status.
 *
 * @param {import('eslint').Rule.Node|
 *   import('@typescript-eslint/types').TSESTree.Node} node An AST node.
 * @param {import('eslint').SourceCode} sourceCode The ESLint SourceCode.
 * @returns {import('eslint').Rule.Node|
 * import('@typescript-eslint/types').TSESTree.Node} The AST node that
 *   can be evaluated for appropriate JSDoc comments.
 */
const getReducedASTNode = function (node, sourceCode) {
  let {parent} = node;

  switch (node.type) {
  case 'TSFunctionType':
    return getTSFunctionComment(node);
  case 'TSInterfaceDeclaration':
  case 'TSTypeAliasDeclaration':
  case 'TSEnumDeclaration':
  case 'ClassDeclaration':
  case 'FunctionDeclaration':
    return looksLikeExport(parent) ? parent : node;

  case 'TSDeclareFunction':
  case 'ClassExpression':
  case 'ObjectExpression':
  case 'ArrowFunctionExpression':
  case 'TSEmptyBodyFunctionExpression':
  case 'FunctionExpression':
    if (
      !invokedExpression.has(parent.type)
    ) {
      let token = node;
      do {
        token = sourceCode.getTokenBefore(token, {includeComments: true});
      } while (token && token.type === 'Punctuator' && token.value === '(');

      if (token && token.type === 'Block') {
        return node;
      }

      if (sourceCode.getCommentsBefore(node).length) {
        return node;
      }

      while (
        !sourceCode.getCommentsBefore(parent).length &&
        !(/Function/u).test(parent.type) &&
        !allowableCommentNode.has(parent.type)
      ) {
        ({parent} = parent);

        if (!parent) {
          break;
        }
      }
      if (parent && parent.type !== 'FunctionDeclaration' &&
        parent.type !== 'Program'
      ) {
        if (parent.parent && parent.parent.type === 'ExportNamedDeclaration') {
          return parent.parent;
        }

        return parent;
      }
    }

    return node;

  default:
    return node;
  }
};

/**
 * Checks for the presence of a JSDoc comment for the given node and returns it.
 *
 * @param {import('eslint').Rule.Node|
 *   import('@typescript-eslint/types').TSESTree.Node
 * } astNode The AST node to get the comment for.
 * @param {import('eslint').SourceCode} sourceCode
 * @param {{maxLines: Integer, minLines: Integer}} settings
 * @returns {Token|null} The Block comment token containing the JSDoc comment
 *    for the given node or null if not found.
 * @private
 */
const findJSDocComment = (astNode, sourceCode, settings) => {
  const {minLines, maxLines} = settings;
  let currentNode = astNode;
  let tokenBefore = null;

  while (currentNode) {
    const decorator = getDecorator(currentNode);
    if (decorator) {
      currentNode = decorator;
    }
    tokenBefore = sourceCode.getTokenBefore(
      currentNode, {includeComments: true}
    );
    if (
      tokenBefore && tokenBefore.type === 'Punctuator' &&
      tokenBefore.value === '('
    ) {
      [tokenBefore] = sourceCode.getTokensBefore(currentNode, {
        count: 2,
        includeComments: true
      });
    }
    if (!tokenBefore || !isCommentToken(tokenBefore)) {
      return null;
    }
    if (tokenBefore.type === 'Line') {
      currentNode = tokenBefore;
      continue;
    }
    break;
  }

  if (
    tokenBefore.type === 'Block' &&
    (/^\*\s/u).test(tokenBefore.value) &&
    currentNode.loc.start.line - tokenBefore.loc.end.line >= minLines &&
    currentNode.loc.start.line - tokenBefore.loc.end.line <= maxLines
  ) {
    return tokenBefore;
  }

  return null;
};

/**
 * Retrieves the JSDoc comment for a given node.
 *
 * @param {import('eslint').SourceCode} sourceCode The ESLint SourceCode
 * @param {import('eslint').Rule.Node|
 *   import('@typescript-eslint/types').TSESTree.Node
 * } node The AST node to get the comment for.
 * @param {{maxLines: Integer, minLines: Integer}} settings The
 *   settings in context
 * @returns {import('eslint').AST.Token|null} The Block comment
 *   token containing the JSDoc comment for the given node or
 *   null if not found.
 * @public
 */
const getJSDocComment = function (sourceCode, node, settings) {
  const reducedNode = getReducedASTNode(node, sourceCode);

  return findJSDocComment(reducedNode, sourceCode, settings);
};

export {
  getReducedASTNode, getJSDocComment, getDecorator, findJSDocComment
};
