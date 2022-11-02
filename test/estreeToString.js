import estreeToString from '../src/estreeToString.js';
import {commentParserToESTree} from '../src/commentParserToESTree.js';
import {parseComment} from '../src/parseComment.js';

const singleLineWithTag = {
  type: 'JsdocBlock',
  delimiter: '/**',
  description: '',
  descriptionLines: [],
  initial: '',
  terminal: '*/',
  endLine: 0,
  lastDescriptionLine: 0,
  lineEnd: '',
  postDelimiter: ' ',
  tags: [
    {
      delimiter: '',
      description: '',
      descriptionLines: [],
      lineEnd: '',
      name: '',
      parsedType: {
        type: 'JsdocTypeName',
        value: 'string'
      },
      postDelimiter: '',
      postName: '',
      postTag: ' ',
      postType: ' ',
      tag: 'type',
      type: 'JsdocTag',
      rawType: 'string',
      initial: '',
      typeLines: [
        {
          delimiter: '',
          postDelimiter: '',
          rawType: 'string',
          initial: '',
          type: 'JsdocTypeLine'
        }
      ]
    }
  ]
};

const jsdocBlock = {
  type: 'JsdocBlock',
  delimiter: '/**',
  description: '',
  descriptionLines: [],
  initial: '',
  terminal: '*/',
  endLine: 4,
  lastDescriptionLine: 1,
  lineEnd: '',
  postDelimiter: '',
  tags: [
    {
      delimiter: '*',
      description: 'multi-line\ndescription',
      descriptionLines: [
        {
          delimiter: '*',
          description: 'multi-line',
          postDelimiter: ' ',
          initial: ' ',
          type: 'JsdocDescriptionLine'
        },
        {
          delimiter: '',
          description: 'description',
          postDelimiter: '',
          initial: ' ',
          type: 'JsdocDescriptionLine'
        }
      ],
      lineEnd: '',
      name: 'Some',
      parsedType: {
        type: 'JsdocTypeName',
        value: 'string'
      },
      postDelimiter: ' ',
      postName: '',
      postTag: ' ',
      postType: ' ',
      tag: 'param',
      type: 'JsdocTag',
      rawType: 'string',
      initial: ' ',
      typeLines: [
        {
          delimiter: '',
          postDelimiter: '',
          rawType: 'string',
          initial: '',
          type: 'JsdocTypeLine'
        }
      ]
    }
  ]
};

const jsdocBlockMultilineDesc = {
  type: 'JsdocBlock',
  delimiter: '/**',
  description: '',
  descriptionLines: [
    {
      delimiter: '*',
      description: 'multi-line',
      postDelimiter: ' ',
      initial: ' ',
      type: 'JsdocDescriptionLine'
    },
    {
      delimiter: '*',
      description: 'description',
      postDelimiter: ' ',
      initial: ' ',
      type: 'JsdocDescriptionLine'
    }
  ],
  initial: '',
  terminal: '*/',
  endLine: 4,
  lastDescriptionLine: 1,
  lineEnd: '',
  postDelimiter: '',
  tags: [
    {
      delimiter: '*',
      description: 'multi-line\ndescription',
      descriptionLines: [
      ],
      lineEnd: '',
      name: 'Some',
      parsedType: {
        type: 'JsdocTypeName',
        value: 'string'
      },
      postDelimiter: ' ',
      postName: '',
      postTag: ' ',
      postType: ' ',
      tag: 'param',
      type: 'JsdocTag',
      rawType: 'string',
      initial: ' ',
      typeLines: [
        {
          delimiter: '',
          postDelimiter: '',
          rawType: 'string',
          initial: '',
          type: 'JsdocTypeLine'
        }
      ]
    }
  ]
};

const jsdocBlockNoTags = {
  type: 'JsdocBlock',
  delimiter: '/**',
  description: 'test',
  descriptionLines: [
    {
      delimiter: '*',
      description: 'test',
      postDelimiter: ' ',
      initial: ' ',
      type: 'JsdocDescriptionLine'
    }
  ],
  initial: '',
  terminal: '*/',
  endLine: 2,
  lastDescriptionLine: 1,
  lineEnd: '',
  postDelimiter: '',
  tags: []
};

const blockWithTagNameYetNoType = {
  delimiter: '/**',
  description: '',
  descriptionLines: [],
  initial: '',
  terminal: '*/',
  endLine: 2,
  lastDescriptionLine: 1,
  lineEnd: '',
  postDelimiter: '',
  tags: [
    {
      delimiter: '*',
      description: '',
      descriptionLines: [],
      lineEnd: '',
      name: 'TagNameNoType',
      parsedType: null,
      postDelimiter: ' ',
      postName: '',
      postTag: ' ',
      postType: '',
      rawType: '',
      initial: ' ',
      tag: 'param',
      type: 'JsdocTag',
      typeLines: []
    }
  ],
  type: 'JsdocBlock'
};

const jsdocBlockEmptyTags = {
  ...JSON.parse(JSON.stringify(jsdocBlockNoTags)),
  tags: []
};

describe('`estreeToString`', function () {
  it(
    'handles stringifying block with multi-line block description',
    function () {
      const str = estreeToString(jsdocBlockMultilineDesc);
      expect(str).to.equal(`/**
 * multi-line
 * description
 * @param {string} Some
 */`);
    }
  );

  it('handles stringifying block with multi-line tag description', function () {
    const str = estreeToString(jsdocBlock);
    expect(str).to.equal(`/**
 * @param {string} Some
 * multi-line
 description
 */`);
  });

  it('handles stringifying single line', function () {
    const str = estreeToString(singleLineWithTag);
    expect(str).to.equal(`/** @type {string} */`);
  });

  it('handles stringifying block without tags', function () {
    const str = estreeToString(jsdocBlockNoTags);
    expect(str).to.equal(`/**
 * test
 */`);
  });

  it('handles stringifying block with missing `tags`', function () {
    const str = estreeToString(jsdocBlockEmptyTags);
    expect(str).to.equal(`/**
 * test
 */`);
  });

  it('handles stringifying block with tag name yet no type', function () {
    const str = estreeToString(blockWithTagNameYetNoType);
    expect(str).to.equal(`/**
 * @param TagNameNoType
 */`);
  });

  it(
    'handles multiline jsdoc comment with tag and ' +
      'multiline type (preserving multiline)',
    () => {
      const parsedComment = parseComment({
        value: `*
 * @typedef {{
 *   a: string;
 * }} SomeName
 *`
      });

      const ast = commentParserToESTree(parsedComment, 'typescript');
      const str = estreeToString(ast, {
        preferRawType: true
      });
      expect(str).to.equal(`/**
 * @typedef {{
 *   a: string;
 * }} SomeName
 */`);
    }
  );

  it(
    'handles `preferRawType` with no `typeLines`',
    () => {
      const parsedComment = parseComment({
        value: `*
 * @typedef SomeName
 `
      });

      const ast = commentParserToESTree(parsedComment, 'typescript');
      const str = estreeToString(ast, {
        preferRawType: true
      });
      expect(str).to.equal(`/**
 * @typedef SomeName
 */`);
    }
  );

  it(
    'handles single line with indent',
    () => {
      const parsedComment = parseComment({
        value: `* @type {SomeType} `
      }, '    ');

      const ast = commentParserToESTree(parsedComment, 'typescript');
      const str = estreeToString(ast);
      expect(str).to.equal(`    /** @type {SomeType} */`);
    }
  );

  it(
    'handles multiline jsdoc comment with tag and multiline type',
    () => {
      const parsedComment = parseComment({
        value: `*
 * @type {{
 *   a: string;
 * }} SomeName
 *`
      });

      const ast = commentParserToESTree(parsedComment, 'typescript');
      const str = estreeToString(ast);
      expect(str).to.equal(`/**
 * @type {{a: string}} SomeName
 */`);
    }
  );

  it('throws upon encountering an unhandled node type', function () {
    expect(() => {
      estreeToString({
        type: 'UnknownType'
      });
    }).to.throw('Unhandled node type: UnknownType');
  });
});
