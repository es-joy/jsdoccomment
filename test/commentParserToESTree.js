// eslint-disable-next-line no-shadow -- Needed for TS
import {expect} from 'chai';

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
  hasPreterminalDescription: 0,
  hasPreterminalTagDescription: 1,
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
      ],
      inlineTags: []
    }
  ],
  inlineTags: []
};

const singleLineWithMultilineTag = {
  type: 'JsdocBlock',
  delimiter: '/**',
  description: '',
  descriptionLines: [],
  initial: '',
  terminal: '*/',
  endLine: 1,
  hasPreterminalDescription: 0,
  hasPreterminalTagDescription: 1,
  lastDescriptionLine: 0,
  lineEnd: '',
  postDelimiter: ' ',
  tags: [
    {
      delimiter: '',
      description: 'A multiline\ndescription',
      descriptionLines: [
        {
          delimiter: '',
          description: 'A multiline',
          initial: '',
          postDelimiter: '',
          type: 'JsdocDescriptionLine'
        },
        {
          delimiter: '',
          description: 'description',
          initial: '',
          postDelimiter: '',
          type: 'JsdocDescriptionLine'
        }
      ],
      lineEnd: '',
      name: 'aName',
      parsedType: {
        type: 'JsdocTypeName',
        value: 'string'
      },
      postDelimiter: '',
      postName: ' ',
      postTag: ' ',
      postType: ' ',
      tag: 'param',
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
      ],
      inlineTags: []
    }
  ],
  inlineTags: []
};

/**
 * @param {object} cfg
 * @param {string} cfg.description
 * @param {"pipe"|"space"|"prefix"|"plain"} cfg.format
 * @param {string} cfg.namepathOrURL
 * @param {string} cfg.tag
 * @param {string} cfg.text
 */
const singleLineWithInlineTag = ({
  description,
  format,
  namepathOrURL,
  tag,
  text
}) => ({
  type: 'JsdocBlock',
  delimiter: '/**',
  description,
  descriptionLines: [
    {
      delimiter: '/**',
      description,
      initial: '',
      postDelimiter: ' ',
      type: 'JsdocDescriptionLine'
    }
  ],
  descriptionStartLine: 0,
  descriptionEndLine: 0,
  initial: '',
  terminal: '*/',
  endLine: 0,
  hasPreterminalDescription: 1,
  lastDescriptionLine: 0,
  lineEnd: '',
  postDelimiter: ' ',
  tags: [],
  inlineTags: [
    {
      format,
      namepathOrURL,
      tag,
      text,
      type: 'JsdocInlineTag'
    }
  ]
});

/**
 * @param {object} cfg
 * @param {string} cfg.description
 * @param {"pipe"|"space"|"prefix"|"plain"} cfg.format
 * @param {string} cfg.namepathOrURL
 * @param {string} cfg.tag
 * @param {string} cfg.text
 */
const singleTagWithInlineTag = ({
  description,
  format,
  namepathOrURL,
  tag,
  text
}) => ({
  type: 'JsdocBlock',
  delimiter: '/**',
  description: '',
  descriptionLines: [],
  initial: '',
  terminal: '*/',
  endLine: 0,
  hasPreterminalDescription: 0,
  hasPreterminalTagDescription: 1,
  lastDescriptionLine: 0,
  lineEnd: '',
  postDelimiter: ' ',
  tags: [
    {
      delimiter: '',
      description,
      descriptionLines: [
        {
          delimiter: '',
          description,
          initial: '',
          postDelimiter: '',
          type: 'JsdocDescriptionLine'
        }
      ],
      initial: '',
      inlineTags: [
        {
          format,
          namepathOrURL,
          tag,
          text,
          type: 'JsdocInlineTag'
        }
      ],
      lineEnd: '',
      name: '',
      parsedType: null,
      postDelimiter: '',
      postName: '',
      postTag: ' ',
      postType: '',
      rawType: '',
      tag: 'see',
      type: 'JsdocTag',
      typeLines: []
    }
  ],
  inlineTags: []
});

describe('commentParserToESTree', function () {
  it('handles single line jsdoc comment with tag', () => {
    const parsedComment = parseComment({
      value: `* @type {string} `
    });

    const ast = commentParserToESTree(parsedComment, 'jsdoc');

    expect(ast).to.deep.equal(singleLineWithTag);
  });

  it('handles single line jsdoc comment with a multiline tag', () => {
    const parsedComment = parseComment({
      value: `* @param {string} aName A multiline
description`
    });

    const ast = commentParserToESTree(parsedComment, 'jsdoc');

    expect(ast).to.deep.equal(singleLineWithMultilineTag);
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
        hasPreterminalDescription: 0,
        hasPreterminalTagDescription: 1,
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
            ],
            inlineTags: []
          }
        ],
        inlineTags: [],
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

  it('handles multiline jsdoc comment beginning on line 0', () => {
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
      hasPreterminalDescription: 0,
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
          ],
          inlineTags: []
        }
      ],
      inlineTags: []
    });
  });

  it('handles multiline jsdoc comment ending on line 1', () => {
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
      hasPreterminalDescription: 0,
      hasPreterminalTagDescription: 1,
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
          ],
          inlineTags: []
        }
      ],
      inlineTags: []
    });
  });

  it('handles multiline jsdoc comment with tag', () => {
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
      hasPreterminalDescription: 0,
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
          ],
          inlineTags: []
        }
      ],
      inlineTags: []
    });
  });

  it(
    'handles multiline jsdoc comment with tag and multiline type',
    () => {
      const parsedComment = parseComment({
        value: `*
 * @type {{
 *   a: string;
     b: number;
 *   c: null;
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
        hasPreterminalDescription: 0,
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
                    quote: undefined
                  },
                  optional: false,
                  readonly: false,
                  right: {
                    type: 'JsdocTypeName',
                    value: 'string'
                  },
                  type: 'JsdocTypeObjectField'
                },
                {
                  key: 'b',
                  meta: {
                    quote: undefined
                  },
                  optional: false,
                  readonly: false,
                  right: {
                    type: 'JsdocTypeName',
                    value: 'number'
                  },
                  type: 'JsdocTypeObjectField'
                },
                {
                  key: 'c',
                  meta: {
                    quote: undefined
                  },
                  optional: false,
                  readonly: false,
                  right: {
                    type: 'JsdocTypeNull'
                  },
                  type: 'JsdocTypeObjectField'
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
            rawType: '{\n  a: string;\nb: number;\n  c: null;\n}',
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
                rawType: '  c: null;',
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
            ],
            inlineTags: []
          }
        ],
        inlineTags: [],
        type: 'JsdocBlock'
      });
    }
  );

  it(
    'handles multiline jsdoc comment with tag and multiline description',
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
        hasPreterminalDescription: 0,
        lastDescriptionLine: 1,
        lineEnd: '',
        postDelimiter: '',
        tags: [
          {
            delimiter: '*',
            description: '\nmultiline\ndescription',
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
            ],
            inlineTags: []
          }
        ],
        inlineTags: []
      });
    }
  );

  it(
    'handles 0th line jsdoc comments',
    () => {
      const parsedComment = parseComment({
        value: `* Some multiline description *`
      });

      const ast = commentParserToESTree(parsedComment, 'jsdoc');

      expect(ast).to.deep.equal({
        type: 'JsdocBlock',
        delimiter: '/**',
        description: 'Some multiline description *',
        descriptionEndLine: 0,
        descriptionLines: [
          {
            delimiter: '/**',
            description: 'Some multiline description *',
            initial: '',
            postDelimiter: ' ',
            type: 'JsdocDescriptionLine'
          }
        ],
        descriptionStartLine: 0,
        endLine: 0,
        hasPreterminalDescription: 1,
        initial: '',
        lastDescriptionLine: 0,
        lineEnd: '',
        postDelimiter: ' ',
        tags: [],
        inlineTags: [],
        terminal: '*/'
      });
    }
  );

  it(
    'handles multiline 0th line jsdoc comments',
    () => {
      const parsedComment = parseComment({
        value: `* Some
* multiline description *`
      });

      const ast = commentParserToESTree(parsedComment, 'jsdoc');

      expect(ast).to.deep.equal({
        type: 'JsdocBlock',
        delimiter: '/**',
        description: 'Some\nmultiline description *',
        descriptionEndLine: 1,
        descriptionLines: [
          {
            delimiter: '/**',
            description: 'Some',
            initial: '',
            postDelimiter: ' ',
            type: 'JsdocDescriptionLine'
          },
          {
            delimiter: '*',
            description: 'multiline description *',
            initial: '',
            postDelimiter: ' ',
            type: 'JsdocDescriptionLine'
          }
        ],
        descriptionStartLine: 0,
        endLine: 1,
        hasPreterminalDescription: 1,
        initial: '',
        lastDescriptionLine: 1,
        lineEnd: '',
        postDelimiter: ' ',
        tags: [],
        inlineTags: [],
        terminal: '*/'
      });
    }
  );

  it(
    'handles multiline jsdoc comment with multiline description',
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
        descriptionStartLine: 1,
        descriptionEndLine: 3,
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
        hasPreterminalDescription: 0,
        lastDescriptionLine: 4,
        lineEnd: '',
        postDelimiter: '',
        tags: [],
        inlineTags: []
      });
    }
  );

  it('handles multiline jsdoc comment with tag and name but no type', () => {
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
      hasPreterminalDescription: 0,
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
          typeLines: [],
          inlineTags: []
        }
      ],
      inlineTags: [],
      type: 'JsdocBlock'
    });
  });

  it('handles single line jsdoc comment with inline tag in description', () => {
    const parsedComment = parseComment({
      value: `* This is {@link Something}`
    });

    const ast = commentParserToESTree(parsedComment, 'jsdoc');

    expect(ast).to.deep.equal(singleLineWithInlineTag({
      description: 'This is {@link Something}',
      text: '',
      tag: 'link',
      namepathOrURL: 'Something',
      format: 'plain'
    }));
  });

  it('handles single line jsdoc comment with inline tag in tag', () => {
    const parsedComment = parseComment({
      value: `* @see This is {@link Something}`
    });

    const ast = commentParserToESTree(parsedComment, 'jsdoc');

    expect(ast).to.deep.equal(singleTagWithInlineTag({
      description: 'This is {@link Something}',
      text: '',
      tag: 'link',
      namepathOrURL: 'Something',
      format: 'plain'
    }));
  });
});
