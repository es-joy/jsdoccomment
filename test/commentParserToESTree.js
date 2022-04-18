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

describe('commentParserToESTree', function () {
  it('handles single line jsdoc comment with tag', () => {
    const parsedComment = parseComment({
      value: `* @type {string} `
    });

    const ast = commentParserToESTree(parsedComment, 'jsdoc');

    expect(ast).to.deep.equal(singleLineWithTag);
  });

  it('handles name jsdoc comment with tag', () => {
    const code = `*
 * @local
 * @typedef {SomeType} aName
 `;
    const parsedComment = parseComment({
      value: code
    });

    const ast = commentParserToESTree(parsedComment, 'typescript');

    expect(ast.tags[0].name).to.equal('');
  });

  it(
    'silently ignores with bad injected type in single line jsdoc comment',
    () => {
      const parsedComment = parseComment({
        value: `* @type {string} `
      });

      parsedComment.source[0].tokens.type = 'badValue<';

      const parsed = commentParserToESTree(parsedComment, 'jsdoc');

      expect(parsed).to.deep.equal({
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
            parsedType: null,
            postDelimiter: '',
            postName: '',
            postTag: ' ',
            postType: ' ',
            rawType: 'badValue<',
            initial: '',
            tag: 'type',
            type: 'JsdocTag',
            typeLines: [
              {
                delimiter: '',
                postDelimiter: '',
                rawType: 'badValue<',
                initial: '',
                type: 'JsdocTypeLine'
              }
            ]
          }
        ],
        type: 'JsdocBlock'
      });
    }
  );

  it('throws with bad injected type in single line jsdoc comment', () => {
    const parsedComment = parseComment({
      value: `* @type {string} `
    });

    parsedComment.source[0].tokens.type = 'badValue<';

    expect(() => {
      commentParserToESTree(parsedComment, 'jsdoc', {
        throwOnTypeParsingErrors: true
      });
    }).to.throw(
      'Tag @type with raw type `badValue<` had parsing error: No ' +
      "parslet found for token: 'EOF'"
    );
  });

  it('handles multi line jsdoc comment beginning on line 0', () => {
    const parsedComment = parseComment({
      value: `* @type {string}
`
    });

    const ast = commentParserToESTree(parsedComment, 'jsdoc');

    expect(ast).to.deep.equal({
      type: 'JsdocBlock',
      delimiter: '/**',
      description: '',
      descriptionLines: [],
      initial: '',
      terminal: '*/',
      endLine: 1,
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
          postType: '',
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
    });
  });

  it('handles multi line jsdoc comment ending on line 1', () => {
    const parsedComment = parseComment({
      value: `*
 * @type {string}`
    });

    const ast = commentParserToESTree(parsedComment, 'jsdoc');

    expect(ast).to.deep.equal({
      type: 'JsdocBlock',
      delimiter: '/**',
      description: '',
      descriptionLines: [],
      initial: '',
      terminal: '*/',
      endLine: 1,
      lastDescriptionLine: 1,
      lineEnd: '',
      postDelimiter: '',
      tags: [
        {
          delimiter: '*',
          description: '',
          descriptionLines: [],
          lineEnd: '',
          name: '',
          parsedType: {
            type: 'JsdocTypeName',
            value: 'string'
          },
          postDelimiter: ' ',
          postName: '',
          postTag: ' ',
          postType: '',
          tag: 'type',
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
    });
  });

  it('handles multi line jsdoc comment with tag', () => {
    const parsedComment = parseComment({
      value: `*
 * @type {string}
 *`
    });

    const ast = commentParserToESTree(parsedComment, 'jsdoc');

    expect(ast).to.deep.equal({
      type: 'JsdocBlock',
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
          name: '',
          parsedType: {
            type: 'JsdocTypeName',
            value: 'string'
          },
          postDelimiter: ' ',
          postName: '',
          postTag: ' ',
          postType: '',
          tag: 'type',
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
    });
  });

  it(
    'handles multi line jsdoc comment with tag and multiline type',
    () => {
      const parsedComment = parseComment({
        value: `*
 * @type {{
 *   a: string;
     b: number;
 *   c: null
 * }} SomeName
 *`
      });

      const ast = commentParserToESTree(parsedComment, 'jsdoc');

      expect(ast).to.deep.equal({
        delimiter: '/**',
        description: '',
        descriptionLines: [],
        initial: '',
        terminal: '*/',
        endLine: 6,
        lastDescriptionLine: 1,
        lineEnd: '',
        postDelimiter: '',
        tags: [
          {
            delimiter: '*',
            description: '',
            descriptionLines: [],
            lineEnd: '',
            name: 'SomeName',
            parsedType: {
              elements: [
                {
                  key: 'a',
                  meta: {
                    hasLeftSideExpression: false,
                    quote: undefined
                  },
                  optional: false,
                  readonly: false,
                  right: {
                    type: 'JsdocTypeName',
                    value: 'string'
                  },
                  type: 'JsdocTypeKeyValue'
                },
                {
                  key: 'b',
                  meta: {
                    hasLeftSideExpression: false,
                    quote: undefined
                  },
                  optional: false,
                  readonly: false,
                  right: {
                    type: 'JsdocTypeName',
                    value: 'number'
                  },
                  type: 'JsdocTypeKeyValue'
                },
                {
                  key: 'c',
                  meta: {
                    hasLeftSideExpression: false,
                    quote: undefined
                  },
                  optional: false,
                  readonly: false,
                  right: {
                    type: 'JsdocTypeNull'
                  },
                  type: 'JsdocTypeKeyValue'
                }
              ],
              meta: {
                separator: 'semicolon'
              },
              type: 'JsdocTypeObject'
            },
            postDelimiter: ' ',
            postName: '',
            postTag: ' ',
            postType: ' ',
            rawType: '{\n  a: string;\nb: number;\n  c: null\n}',
            initial: ' ',
            tag: 'type',
            type: 'JsdocTag',
            typeLines: [
              {
                delimiter: '',
                postDelimiter: '',
                rawType: '{',
                initial: '',
                type: 'JsdocTypeLine'
              },
              {
                delimiter: '*',
                postDelimiter: ' ',
                rawType: '  a: string;',
                initial: ' ',
                type: 'JsdocTypeLine'
              },
              {
                delimiter: '',
                postDelimiter: '',
                rawType: 'b: number;',
                initial: '     ',
                type: 'JsdocTypeLine'
              },
              {
                delimiter: '*',
                postDelimiter: ' ',
                rawType: '  c: null',
                initial: ' ',
                type: 'JsdocTypeLine'
              },
              {
                delimiter: '*',
                postDelimiter: ' ',
                rawType: '}',
                initial: ' ',
                type: 'JsdocTypeLine'
              }
            ]
          }
        ],
        type: 'JsdocBlock'
      });
    }
  );

  it(
    'handles multi line jsdoc comment with tag and multiline description',
    () => {
      const parsedComment = parseComment({
        value: `*
 * @param {string} Some
 * multiline
 description
 *`
      });

      const ast = commentParserToESTree(parsedComment, 'jsdoc');

      expect(ast).to.deep.equal({
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
            description: 'multiline\ndescription',
            descriptionLines: [
              {
                delimiter: '',
                description: 'multiline',
                postDelimiter: '',
                initial: '',
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
      });
    }
  );

  it(
    'handles multi line jsdoc comment with multiline description',
    () => {
      const parsedComment = parseComment({
        value: `*
 * Some
 * multiline
 description
 *`
      });

      const ast = commentParserToESTree(parsedComment, 'jsdoc');

      expect(ast).to.deep.equal({
        type: 'JsdocBlock',
        delimiter: '/**',
        description: 'Some\nmultiline\ndescription',
        descriptionLines: [
          {
            delimiter: '*',
            description: 'Some',
            postDelimiter: ' ',
            initial: ' ',
            type: 'JsdocDescriptionLine'
          },
          {
            delimiter: '*',
            description: 'multiline',
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
        initial: '',
        terminal: '*/',
        endLine: 4,
        lastDescriptionLine: 4,
        lineEnd: '',
        postDelimiter: '',
        tags: []
      });
    }
  );

  it('handles multi line jsdoc comment with tag and name but no type', () => {
    const parsedComment = parseComment({
      value: `*
 * @param TagNameNoType
 *`
    });

    const ast = commentParserToESTree(parsedComment, 'jsdoc');

    expect(ast).to.deep.equal({
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
    });
  });
});
