import * as estree from 'estree';
import * as comment_parser from 'comment-parser';
import * as jsdoc_type_pratt_parser from 'jsdoc-type-pratt-parser';
export * from 'jsdoc-type-pratt-parser';
export { visitorKeys as jsdocTypeVisitorKeys } from 'jsdoc-type-pratt-parser';
import * as _typescript_eslint_types from '@typescript-eslint/types';
import * as eslint from 'eslint';

type JsdocTypeLine = {
  delimiter: string;
  postDelimiter: string;
  rawType: string;
  initial: string;
  type: 'JsdocTypeLine';
};
type JsdocDescriptionLine = {
  delimiter: string;
  description: string;
  postDelimiter: string;
  initial: string;
  type: 'JsdocDescriptionLine';
};
/**
 * An inline tag whose `text` is the unescaped label value.
 */
type JsdocInlineTagNoType = {
  format: 'pipe' | 'plain' | 'prefix' | 'space';
  namepathOrURL: string;
  tag: string;
  text: string;
};
type JsdocInlineTag = JsdocInlineTagNoType & {
  type: 'JsdocInlineTag';
};
type JsdocTag = {
  delimiter: string;
  description: string;
  descriptionLines: JsdocDescriptionLine[];
  initial: string;
  inlineTags: JsdocInlineTag[];
  name: string;
  postDelimiter: string;
  postName: string;
  postTag: string;
  postType: string;
  rawType: string;
  parsedType: jsdoc_type_pratt_parser.RootResult | null;
  tag: string;
  type: 'JsdocTag';
  typeLines: JsdocTypeLine[];
};
type Integer = number;
type JsdocBlock = {
  delimiter: string;
  delimiterLineBreak: string;
  description: string;
  descriptionEndLine?: Integer;
  descriptionLines: JsdocDescriptionLine[];
  descriptionStartLine?: Integer;
  hasPreterminalDescription: 0 | 1;
  hasPreterminalTagDescription?: 1;
  initial: string;
  inlineTags: JsdocInlineTag[];
  lastDescriptionLine?: Integer;
  endLine: Integer;
  lineEnd: string;
  postDelimiter: string;
  tags: JsdocTag[];
  terminal: string;
  preterminalLineBreak: string;
  type: 'JsdocBlock';
};
type JtppOptions = {
  module?: boolean;
  strictMode?: boolean;
  asyncFunctionBody?: boolean;
  classContext?: boolean;
  computedPropertyParser?: (text: string, options?: any) => unknown;
};
type CommentParserToESTreeOptions = {
  /**
   * By default, empty lines are
   * compacted; set to 'preserve' to preserve empty comment lines.
   */
  spacing?: 'preserve' | 'compact' | undefined;
  throwOnTypeParsingErrors?: boolean | undefined;
  jsdocTypePrattParserArgs?: JtppOptions | undefined;
};
/**
 * @typedef {{
 *   module?: boolean;
 *   strictMode?: boolean;
 *   asyncFunctionBody?: boolean;
 *   classContext?: boolean;
 *   computedPropertyParser?: (text: string, options?: any) => unknown;
 * }} JtppOptions
 */
/**
 * @typedef {object} CommentParserToESTreeOptions
 * @property {'compact'|'preserve'} [spacing] By default, empty lines are
 *        compacted; set to 'preserve' to preserve empty comment lines.
 * @property {boolean} [throwOnTypeParsingErrors]
 * @property {JtppOptions} [jsdocTypePrattParserArgs]
 */
/**
 * Converts comment parser AST to ESTree format.
 * @param {import('./index.js').JsdocBlockWithInline} jsdoc
 * @param {import('jsdoc-type-pratt-parser').ParseMode} mode
 * @param {CommentParserToESTreeOptions} [opts]
 * @returns {JsdocBlock}
 */
declare function commentParserToESTree(
  jsdoc: JsdocBlockWithInline,
  mode?: jsdoc_type_pratt_parser.ParseMode,
  { spacing, throwOnTypeParsingErrors, jsdocTypePrattParserArgs }?: CommentParserToESTreeOptions,
): JsdocBlock;
declare namespace jsdocVisitorKeys {
  let JsdocBlock: string[];
  let JsdocDescriptionLine: never[];
  let JsdocTypeLine: never[];
  let JsdocTag: string[];
  let JsdocInlineTag: never[];
}

/**
 * @param {{
 *   mode: import('jsdoc-type-pratt-parser').ParseMode,
 *   [key: string]: any
 * }} settings
 * @param {import('./commentParserToESTree.js').
 *   CommentParserToESTreeOptions} [commentParserToESTreeOptions]
 * @returns {import('./index.js').CommentHandler}
 */
declare function commentHandler(
  settings: {
    mode: jsdoc_type_pratt_parser.ParseMode;
    [key: string]: any;
  },
  commentParserToESTreeOptions?: CommentParserToESTreeOptions,
): CommentHandler;

/**
 * @todo convert for use by escodegen (until may be patched to support
 *   custom entries?).
 * @param {import('./commentParserToESTree.js').JsdocBlock|
 *   import('./commentParserToESTree.js').JsdocDescriptionLine|
 *   import('./commentParserToESTree.js').JsdocTypeLine|
 *   import('./commentParserToESTree.js').JsdocTag|
 *   import('./commentParserToESTree.js').JsdocInlineTag|
 *   import('jsdoc-type-pratt-parser').RootResult
 * } node
 * @param {import('./index.js').ESTreeToStringOptions} [opts]
 * @throws {Error}
 * @returns {string}
 */
declare function estreeToString(
  node:
    JsdocBlock | JsdocDescriptionLine | JsdocTypeLine | JsdocTag | JsdocInlineTag | jsdoc_type_pratt_parser.RootResult,
  opts?: ESTreeToStringOptions,
): string;

type Token =
  | eslint.AST.Token
  | estree.Comment
  | {
      type: eslint.AST.TokenType | 'Line' | 'Block' | 'Shebang';
      range: [number, number];
      value: string;
    };
type ESLintOrTSNode = eslint.Rule.Node | _typescript_eslint_types.TSESTree.Node;
/**
 * The type accepted in node parameter positions of the public comment-finding
 * helpers. It is deliberately looser than {@link ESLintOrTSNode}: callers pass
 * nodes typed against their own copy of `@typescript-eslint/types`, and when
 * that copy differs from the one resolved here the two `TSESTree` unions are
 * nominally distinct and, being large and recursive, can exceed the
 * type-checker's comparison depth. Requiring only `type` lets any AST node
 * through while the helpers narrow internally; return types keep the precise
 * {@link ESLintOrTSNode}.
 *
 * `ESLintOrTSNode` is deliberately *not* part of this union: including it makes
 * the checker relate arguments against the full recursive `TSESTree.Node` union
 * anyway, which is what overflows.
 */
type ESLintOrTSNodeInput = {
  type: string;
};
type int = number;
type DecoratedNode =
  | ESLintOrTSNode
  | estree.Comment
  | (eslint.Rule.Node & {
      declaration?: any;
      decorators?: any[];
    });
type Settings = {
  maxLines: int;
  minLines: int;
  skipInvokedExpressionsForCommentFinding?: boolean;
  [name: string]: any;
};
/**
 * @typedef {{
 *   maxLines: int,
 *   minLines: int,
 *   skipInvokedExpressionsForCommentFinding?: boolean,
 *   [name: string]: any
 * }} Settings
 */
/**
 * Reduces the provided node to the appropriate node for evaluating
 * JSDoc comment status.
 *
 * @param {ESLintOrTSNodeInput} nodeInput An AST node.
 * @param {import('eslint').SourceCode} sourceCode The ESLint SourceCode.
 * @param {Settings} [settings]
 * @returns {ESLintOrTSNode} The AST node that
 *   can be evaluated for appropriate JSDoc comments.
 */
declare function getReducedASTNode(
  nodeInput: ESLintOrTSNodeInput,
  sourceCode: eslint.SourceCode,
  settings?: Settings,
): ESLintOrTSNode;
/**
 * Retrieves the JSDoc comment for a given node.
 *
 * @param {import('eslint').SourceCode} sourceCode The ESLint SourceCode
 * @param {ESLintOrTSNodeInput} node The AST node to get
 *   the comment for.
 * @param {Settings} settings The settings in context
 * @param {{checkOverloads?: boolean}} [opts]
 * @returns {Token|null} The Block comment
 *   token containing the JSDoc comment for the given node or
 *   null if not found.
 * @public
 */
declare function getJSDocComment(
  sourceCode: eslint.SourceCode,
  node: ESLintOrTSNodeInput,
  settings: Settings,
  opts?: {
    checkOverloads?: boolean;
  },
): Token | null;
/**
 * Retrieves the comment preceding a given node.
 *
 * @param {import('eslint').SourceCode} sourceCode The ESLint SourceCode
 * @param {ESLintOrTSNodeInput} node The AST node to get
 *   the comment for.
 * @param {{maxLines: int, minLines: int, [name: string]: any}} settings The
 *   settings in context
 * @returns {Token|null} The Block comment
 *   token containing the JSDoc comment for the given node or
 *   null if not found.
 * @public
 */
declare function getNonJsdocComment(
  sourceCode: eslint.SourceCode,
  node: ESLintOrTSNodeInput,
  settings: {
    maxLines: int;
    minLines: int;
    [name: string]: any;
  },
): Token | null;
/**
 * @typedef {(
 *   ESLintOrTSNode|
 *   import('estree').Comment|
 *   import('eslint').Rule.Node & {declaration?: any, decorators?: any[]}
 * )} DecoratedNode
 */
/**
 * @param {DecoratedNode} node
 * @returns {import('@typescript-eslint/types').TSESTree.Decorator|undefined}
 */
declare function getDecorator(node: DecoratedNode): _typescript_eslint_types.TSESTree.Decorator | undefined;
/**
 * Checks for the presence of a JSDoc comment for the given node and returns it.
 *
 * @param {ESLintOrTSNodeInput} astNode The AST node to get
 *   the comment for.
 * @param {import('eslint').SourceCode} sourceCode
 * @param {{maxLines: int, minLines: int, [name: string]: any}} settings
 * @param {{nonJSDoc?: boolean}} [opts]
 * @returns {Token|null} The Block comment token containing the JSDoc comment
 *    for the given node or null if not found.
 */
declare function findJSDocComment(
  astNode: ESLintOrTSNodeInput,
  sourceCode: eslint.SourceCode,
  settings: {
    maxLines: int;
    minLines: int;
    [name: string]: any;
  },
  opts?: {
    nonJSDoc?: boolean;
  },
): Token | null;
/**
 * Checks for the presence of a comment following the given node and
 * returns it.
 *
 * This method is experimental.
 *
 * @param {import('eslint').SourceCode} sourceCode
 * @param {ESLintOrTSNodeInput} astNodeInput The AST node to get
 *   the comment for.
 * @returns {Token|null} The comment token containing the comment
 *    for the given node or null if not found.
 */
declare function getFollowingComment(sourceCode: eslint.SourceCode, astNodeInput: ESLintOrTSNodeInput): Token | null;

declare function hasSeeWithLink(spec: comment_parser.Spec): boolean;
declare const defaultNoTypes: string[];
declare const defaultNoNames: string[];
/**
 * Can't import `comment-parser/es6/parser/tokenizers/index.js`,
 *   so we redefine here.
 */
type CommentParserTokenizer = (spec: comment_parser.Spec) => comment_parser.Spec;
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
declare function getTokenizers({
  noTypes,
  noNames,
}?: {
  noTypes?: string[] | undefined;
  noNames?: string[] | undefined;
}): CommentParserTokenizer[];
/**
 * Accepts a comment token or complete comment string and converts it into
 * `comment-parser` AST.
 * @param {string | {value: string}} commentOrNode
 * @param {string} [indent] Whitespace
 * @returns {import('./index.js').JsdocBlockWithInline}
 */
declare function parseComment(
  commentOrNode:
    | string
    | {
        value: string;
      },
  indent?: string,
): JsdocBlockWithInline;

/**
 * Splits the `{@ prefix}` from remaining `Spec.lines[].token.description`
 * into the `inlineTags` tokens, and populates `spec.inlineTags`
 * @param {import('comment-parser').Block} block
 * @returns {import('./index.js').JsdocBlockWithInline}
 */
declare function parseInlineTags(block: comment_parser.Block): JsdocBlockWithInline;

/**
 * An inline tag whose `text` is the unescaped label value.
 */
type InlineTag = JsdocInlineTagNoType & {
  start: number;
  end: number;
};
type JsdocTagWithInline = comment_parser.Spec & {
  line?: Integer;
  inlineTags: (JsdocInlineTagNoType & {
    line?: Integer;
  })[];
};
/**
 * Expands on comment-parser's `Block` interface.
 */
type JsdocBlockWithInline = {
  description: string;
  source: comment_parser.Line[];
  problems: comment_parser.Problem[];
  tags: JsdocTagWithInline[];
  inlineTags: (JsdocInlineTagNoType & {
    line?: Integer;
  })[];
};
type ESTreeToStringOptions = {
  preferRawType?: boolean;
  jtppStringificationRules?: (node: estree.Node, options?: any) => string;
};
type CommentHandler = (commentSelector: string, jsdoc: JsdocBlockWithInline) => boolean;

export {
  JsdocBlock,
  JsdocDescriptionLine,
  JsdocInlineTag,
  JsdocTag,
  JsdocTypeLine,
  commentHandler,
  commentParserToESTree,
  defaultNoNames,
  defaultNoTypes,
  estreeToString,
  findJSDocComment,
  getDecorator,
  getFollowingComment,
  getJSDocComment,
  getNonJsdocComment,
  getReducedASTNode,
  getTokenizers,
  hasSeeWithLink,
  jsdocVisitorKeys,
  parseComment,
  parseInlineTags,
};
export type {
  CommentHandler,
  CommentParserToESTreeOptions,
  CommentParserTokenizer,
  DecoratedNode,
  ESLintOrTSNode,
  ESLintOrTSNodeInput,
  ESTreeToStringOptions,
  InlineTag,
  Integer,
  JsdocBlockWithInline,
  JsdocInlineTagNoType,
  JsdocTagWithInline,
  JtppOptions,
  Settings,
  Token,
  int,
};
