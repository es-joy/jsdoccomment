import {
  commentParserToESTree,
  estreeToString,
  parseComment
} from '../src/index.js';

import {
  commentBlocks,
  compactResults,
  preserveResults
} from './fixture/roundTripData.js';

// The goal in the following data defined tests is round trip testing from
// parseComment -> commentParserToESTree -> estreeToString.
// `commentBlocks` provides the source comment block and `compactResults`
// `preserveResults` provides the respective results for `compact` and
// `preserve` `spacing` option for `commentParserToESTree`.

describe('Round Trip Parsing', () => {
  describe('`compact` option', () => {
    // eslint-disable-next-line unicorn/no-for-loop -- For loop used for index.
    for (let i = 0; i < commentBlocks.length; i++) {
      it(`commentBlock[${i}]`, () => {
        const parsedComment = parseComment(commentBlocks[i]);

        const ast = commentParserToESTree(parsedComment, 'jsdoc');

        const result = estreeToString(ast);

        expect(result).to.equal(compactResults[i]);
      });
    }
  });

  describe('`preserve` option', () => {
    // eslint-disable-next-line unicorn/no-for-loop -- For loop used for index.
    for (let i = 0; i < commentBlocks.length; i++) {
      it(`commentBlock[${i}]`, () => {
        const parsedComment = parseComment(commentBlocks[i]);

        const ast = commentParserToESTree(parsedComment, 'jsdoc',
          {spacing: 'preserve'});

        const result = estreeToString(ast);

        expect(result).to.equal(preserveResults[i]);
      });
    }
  });
});
