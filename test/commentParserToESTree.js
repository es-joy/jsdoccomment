import {expect} from 'chai';

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

  it('handles multi line jsdoc comment with tag', () => {
    const parsedComment = parseComment({
      value: '*\n' +
      ' * @type {string}\n' +
      ' *'
    });

    const ast = commentParserToESTree(parsedComment, 'javascript');

    expect(ast).to.deep.equal({
      type: 'JsdocBlock',
      delimiter: '/**',
      description: '',
      descriptionLines: [],
      end: '*/',
      lastDescriptionLine: 0,
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
});
