import {
  commentParserToESTree,
  estreeToString,
  parseComment
} from '../src/index.js';

import {
  commentBlocks,
  compactResults,
  compactResultsPratt,
  preserveResults,
  preserveResultsPratt
} from './fixture/roundTripData.js';

// The goal in the following data defined tests is round trip testing from
// parseComment -> commentParserToESTree -> estreeToString.
// `commentBlocks` provides the source comment block and `compactResults`
// `preserveResults` provides the respective results for `compact` and
// `preserve` `spacing` option for `commentParserToESTree`.

/**
 * Converts `JsdocDescriptionLine[]` to a string description removing
 * any leading white space or delimiter.
 *
 * @param {(
 *   import('../src/commentParserToESTree').JsdocDescriptionLine[])
 * } descriptionLines -
 * @returns {string} Complete description line string.
 */
const descriptionLinesToString = (descriptionLines) => {
  let result = '';

  for (const descriptionLine of descriptionLines) {
    const desc = estreeToString(descriptionLine).replace(/^\s*\**\s*/v, '');
    result += !result ? desc : `\n${desc}`;
  }

  return result;
};

describe('Round Trip Parsing', () => {
  describe('`compact` option', () => {
    for (const i of commentBlocks.keys()) {
      it(`commentBlock[${i}]`, () => {
        const parsedComment = parseComment(commentBlocks[i]);

        const ast = commentParserToESTree(parsedComment, 'jsdoc');

        // Check description lines against `ast.description`.
        expect(ast.description).to.equal(
          descriptionLinesToString(ast.descriptionLines)
        );

        // Check tag description lines against `tag.description`.
        for (const tag of ast.tags) {
          expect(tag.description).to.equal(
            descriptionLinesToString(tag.descriptionLines)
          );
        }

        const result = estreeToString(ast, {preferRawType: true});

        expect(result).to.equal(compactResults[i]);

        const resultPratt = estreeToString(ast);

        expect(resultPratt).to.equal(compactResultsPratt[i]);
      });
    }
  });

  describe('`preserve` option', () => {
    for (const i of commentBlocks.keys()) {
      it(`commentBlock[${i}]`, () => {
        const parsedComment = parseComment(commentBlocks[i]);

        const ast = commentParserToESTree(parsedComment, 'jsdoc',
          {spacing: 'preserve'});

        expect(ast.description).to.equal(
          descriptionLinesToString(ast.descriptionLines)
        );

        for (const tag of ast.tags) {
          expect(tag.description).to.equal(
            descriptionLinesToString(tag.descriptionLines)
          );
        }

        const result = estreeToString(ast, {preferRawType: true});

        expect(result).to.equal(preserveResults[i]);

        const resultPratt = estreeToString(ast);

        expect(resultPratt).to.equal(preserveResultsPratt[i]);
      });
    }
  });
});
