import {commentParserToESTree} from '../src/commentParserToESTree.js';
import {parseComment} from '../src/parseComment.js';

const singleLineWithTag = {
  type: 'JsdocBlock',
  delimiter: '/**',
  description: '',
  descriptionLines: [],
  end: '*/',
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
      start: '',
      typeLines: [
        {
          delimiter: '',
          postDelimiter: '',
          rawType: 'string',
          start: '',
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
        end: '*/',
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
            start: '',
            tag: 'type',
            type: 'JsdocTag',
            typeLines: [
              {
                delimiter: '',
                postDelimiter: '',
                rawType: 'badValue<',
                start: '',
                type: 'JsdocTypeLine'
              }
            ]
          }
        ],
        type: 'JsdocBlock'
      });
    }
  );

  // Only resume if parser known to handle all expected types
  // it('throws with bad injected type in single line jsdoc comment', () => {
  //   const parsedComment = parseComment({
  //     value: `* @type {string} `
  //   });
  //
  //   parsedComment.source[0].tokens.type = 'badValue<';
  //
  //   expect(() => {
  //     commentParserToESTree(parsedComment, 'jsdoc');
  //   }).to.throw("No parslet found for token: 'EOF'");
  // });

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
      end: '*/',
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
          start: '',
          typeLines: [
            {
              delimiter: '',
              postDelimiter: '',
              rawType: 'string',
              start: '',
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
      end: '*/',
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
          start: ' ',
          typeLines: [
            {
              delimiter: '',
              postDelimiter: '',
              rawType: 'string',
              start: '',
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
      end: '*/',
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
          start: ' ',
          typeLines: [
            {
              delimiter: '',
              postDelimiter: '',
              rawType: 'string',
              start: '',
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
        end: '*/',
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
            postType: '',
            rawType: '{\n  a: string;\nb: number;\n  c: null\n}',
            start: ' ',
            tag: 'type',
            type: 'JsdocTag',
            typeLines: [
              {
                delimiter: '',
                postDelimiter: '',
                rawType: '{',
                start: '',
                type: 'JsdocTypeLine'
              },
              {
                delimiter: '*',
                postDelimiter: ' ',
                rawType: '  a: string;',
                start: ' ',
                type: 'JsdocTypeLine'
              },
              {
                delimiter: '',
                postDelimiter: '',
                rawType: 'b: number;',
                start: '     ',
                type: 'JsdocTypeLine'
              },
              {
                delimiter: '*',
                postDelimiter: ' ',
                rawType: '  c: null',
                start: ' ',
                type: 'JsdocTypeLine'
              },
              {
                delimiter: '*',
                postDelimiter: ' ',
                rawType: '}',
                start: ' ',
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
        end: '*/',
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
                start: '',
                type: 'JsdocDescriptionLine'
              },
              {
                delimiter: '',
                description: 'description',
                postDelimiter: '',
                start: ' ',
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
            start: ' ',
            typeLines: [
              {
                delimiter: '',
                postDelimiter: '',
                rawType: 'string',
                start: '',
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
            delimiter: '',
            description: 'Some',
            postDelimiter: '',
            start: '',
            type: 'JsdocDescriptionLine'
          },
          {
            delimiter: '*',
            description: 'multiline',
            postDelimiter: ' ',
            start: ' ',
            type: 'JsdocDescriptionLine'
          },
          {
            delimiter: '',
            description: 'description',
            postDelimiter: '',
            start: ' ',
            type: 'JsdocDescriptionLine'
          }
        ],
        end: '*/',
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
      end: '*/',
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
          start: ' ',
          tag: 'param',
          type: 'JsdocTag',
          typeLines: []
        }
      ],
      type: 'JsdocBlock'
    });
  });
});
