// Data for round trip parsing tests w/ `preserve` option  ----

// Some results use `${' '}` to prevent IDEs from removing trailing spaces.

/**
 * Defines the source comment blocks to parse.
 *
 * @type {string[]}
 */
const commentBlocks = [];

/**
 * Defines the results for `compact` option.
 *
 * @type {(string|undefined)[]}
 */
const compactResults = [];

/**
 * Defines the results for `preserve` option.
 *
 * @type {(string|undefined)[]}
 */
const preserveResults = [];

// commentBlock[0] ----

commentBlocks.push(`/** Should parse */`);
compactResults.push(commentBlocks.at(-1));
preserveResults.push(commentBlocks.at(-1));

// commentBlock[1] ----

commentBlocks.push(`/** This is {@link Something} */`);
compactResults.push(commentBlocks.at(-1));
preserveResults.push(commentBlocks.at(-1));

// commentBlock[2] ----

commentBlocks.push(`/**
 * Should parse
 */`);
compactResults.push(commentBlocks.at(-1));
preserveResults.push(commentBlocks.at(-1));

// commentBlock[3] ----

commentBlocks.push(`/**
 * Should parse
 *
 * with empty line.
 */`);
compactResults.push(`/**
 * Should parse
 * with empty line.
 */`);
preserveResults.push(commentBlocks.at(-1));

// commentBlock[4] ----

commentBlocks.push(`/**
 * Should parse one line. */`);

// A multi-line comment closing delimiter on last line creates one more line.
compactResults.push(`/**
 * Should parse one line.${' '}
 */`);
preserveResults.push(`/**
 * Should parse one line.${' '}
 */`);

// commentBlock[5] ----

commentBlocks.push(`/**
 * Should parse
 *
 * with empty line.
 *
 * @param {boolean} and tag
 *
 */`);
compactResults.push(`/**
 * Should parse
 * with empty line.
 * @param {boolean} and tag
 */`);
preserveResults.push(commentBlocks.at(-1));

// commentBlock[6] ----

commentBlocks.push(`/** It should
 *
 * parse */`);
compactResults.push(`/**${' '}
 * It should
 * parse${' '}
 */`);
// A multi-line comment with description on 0th line moves it to the 1st line.
// A multi-line comment closing delimiter on last line creates one more line.
preserveResults.push(`/**${' '}
 * It should
 *
 * parse${' '}
 */`);

// commentBlock[7] ----

commentBlocks.push(`/**
 * @param {(boolean | string)} foo - multiple types w/ parens
 */`);
compactResults.push(commentBlocks.at(-1));
preserveResults.push(commentBlocks.at(-1));

// commentBlock[8] ----

commentBlocks.push(`/**
 * @param {(
 *    boolean |
 *    string
 * )} foo - multiple types across lines w/ parens
 */`);
compactResults.push(commentBlocks.at(-1));
preserveResults.push(commentBlocks.at(-1));

export {
  commentBlocks,
  compactResults,
  preserveResults
};
