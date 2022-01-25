import {commentParserToESTree} from '../src/commentParserToESTree.js';
import {parseComment} from '../src/parseComment.js';

describe('commentParserToESTree', function () {
  it('handles single line jsdoc comment with tag', () => {
    const parsedComment = parseComment({
      value: `* @type {string} `
    });

    const ast = commentParserToESTree(parsedComment, 'javascript');

    expect(ast).to.deep.equal({
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
          delimiter: '/**',
          description: '',
          descriptionLines: [],
          lineEnd: '',
          name: '',
          parsedType: null,
          postDelimiter: ' ',
          postName: '',
          postTag: ' ',
          postType: ' ',
          tag: 'type',
          type: 'JsdocTag',
          rawType: 'string',
          start: '',
          typeLines: [
            {
              delimiter: '/**',
              postDelimiter: ' ',
              rawType: 'string',
              start: '',
              type: 'JsdocTypeLine'
            }
          ]
        }
      ]
    });
  });

  it('handles multi line jsdoc comment beginning on line 0', () => {
    const parsedComment = parseComment({
      value: `* @type {string}
`
    });

    const ast = commentParserToESTree(parsedComment, 'javascript');

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
          delimiter: '/**',
          description: '',
          descriptionLines: [],
          lineEnd: '',
          name: '',
          parsedType: null,
          postDelimiter: ' ',
          postName: '',
          postTag: ' ',
          postType: '',
          tag: 'type',
          type: 'JsdocTag',
          rawType: 'string',
          start: '',
          typeLines: [
            {
              delimiter: '/**',
              postDelimiter: ' ',
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

    const ast = commentParserToESTree(parsedComment, 'javascript');

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
          parsedType: null,
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
              delimiter: '*',
              postDelimiter: ' ',
              rawType: 'string',
              start: ' ',
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

    const ast = commentParserToESTree(parsedComment, 'javascript');

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
          parsedType: null,
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
              delimiter: '*',
              postDelimiter: ' ',
              rawType: 'string',
              start: ' ',
              type: 'JsdocTypeLine'
            }
          ]
        }
      ]
    });
  });

  it(
    'handles multi line jsdoc comment with tag and multiline description',
    () => {
      const parsedComment = parseComment({
        value: `*
 * @param {string} Some
 * multi-line
 description
 *`
      });

      const ast = commentParserToESTree(parsedComment, 'javascript');

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
            description: 'multi-line\ndescription',
            descriptionLines: [
              {
                delimiter: '*',
                description: 'multi-line',
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
            lineEnd: '',
            name: 'Some',
            parsedType: null,
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
                delimiter: '*',
                postDelimiter: ' ',
                rawType: 'string',
                start: ' ',
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
 * multi-line
 description
 *`
      });

      const ast = commentParserToESTree(parsedComment, 'javascript');

      expect(ast).to.deep.equal({
        type: 'JsdocBlock',
        delimiter: '/**',
        description: 'Some\nmulti-line\ndescription',
        descriptionLines: [
          {
            delimiter: '*',
            description: 'Some',
            postDelimiter: ' ',
            start: ' ',
            type: 'JsdocDescriptionLine'
          },
          {
            delimiter: '*',
            description: 'multi-line',
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
});
