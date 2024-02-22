// Data for round trip parsing tests w/ `spacing` option of
// `compact or `preserve`.

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
 * Defines the results for `compact` option w/ Pratt types.
 * The Pratt parser compacts multiline union types.
 *
 * @type {(string|undefined)[]}
 */
const compactResultsPratt = [];

/**
 * Defines the results for `preserve` option.
 *
 * @type {(string|undefined)[]}
 */
const preserveResults = [];

/**
 * Defines the results for `preserve` option w/ Pratt types.
 * The Pratt parser compacts multiline union types.
 *
 * @type {(string|undefined)[]}
 */
const preserveResultsPratt = [];

// Normal single / multi-line comments (no types) -----------------------------

// commentBlock[0] ----

commentBlocks.push(`/** Should parse */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[1] ----

commentBlocks.push(`/** @singleTag */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[2] ----

commentBlocks.push(`/** @param foo - with description */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[3] ----

commentBlocks.push(`/** This is {@link Something} */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[4] ----

commentBlocks.push(`/**
 * Should parse
 */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[5] ----

commentBlocks.push(`/**
 * Should parse
 *
 * with empty line.
 */`);

compactResults.push(`/**
 * Should parse
 * with empty line.
 */`);
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[6] ----

commentBlocks.push(`/**
 * @param foo - description no type.
 */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[7] ----

commentBlocks.push(`/**
 * @param foo
 *
 * description starting on new line.
 */`);

compactResults.push(`/**
 * @param foo
 * description starting on new line.
 */`);
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[8] ----

commentBlocks.push(`/**
 * @param foo - description no type
 *
 * with empty lines.
 */`);

compactResults.push(`/**
 * @param foo - description no type
 * with empty lines.
 */`);
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[9] ----

commentBlocks.push(`/**
 * @param foo - description no type.
 *
 * @param bar - description no type.
 */`);

compactResults.push(`/**
 * @param foo - description no type.
 * @param bar - description no type.
 */`);
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[10] ----

commentBlocks.push(`/**
 * @param foo
 *
 * no type description spread
 * over new lines.
 *
 * @param bar
 * description no type.
 */`);

compactResults.push(`/**
 * @param foo
 * no type description spread
 * over new lines.
 * @param bar
 * description no type.
 */`);
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// Normal single / multi-line comments (with types) ---------------------------

// commentBlock[11] ----

commentBlocks.push(`/** @param {boolean} foo - with description */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[12] ----

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
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[13] ----

commentBlocks.push(`/**
 * @param {boolean | string} foo - multiple types
 */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[14] ----

commentBlocks.push(`/**
 * @param {(
 *    boolean |
 *    string
 * )} foo - multiple types across lines w/ parens
 */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(`/**
 * @param {(boolean | string)} foo - multiple types across lines w/ parens
 */`);

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(`/**
 * @param {(boolean | string)} foo - multiple types across lines w/ parens
 */`);

// commentBlock[15] ----

commentBlocks.push(`/**
 * @param {(
 *    boolean |
 *    string
 * )} foo - multiple types across lines w/ parens
 *
 * and extended tag description.
 */`);

compactResults.push(`/**
 * @param {(
 *    boolean |
 *    string
 * )} foo - multiple types across lines w/ parens
 * and extended tag description.
 */`);
compactResultsPratt.push(`/**
 * @param {(boolean | string)} foo - multiple types across lines w/ parens
 * and extended tag description.
 */`);

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(`/**
 * @param {(boolean | string)} foo - multiple types across lines w/ parens
 *
 * and extended tag description.
 */`);

// commentBlock[16] ----

commentBlocks.push(`/**
 * @param {(
 *    boolean |
 *    string
 * )} foo
 *
 * tag description staring with gaps
 *
 * and extended tag description.
 */`);

compactResults.push(`/**
 * @param {(
 *    boolean |
 *    string
 * )} foo
 * tag description staring with gaps
 * and extended tag description.
 */`);
compactResultsPratt.push(`/**
 * @param {(boolean | string)} foo
 * tag description staring with gaps
 * and extended tag description.
 */`);

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(`/**
 * @param {(boolean | string)} foo
 *
 * tag description staring with gaps
 *
 * and extended tag description.
 */`);

// commentBlock[17] ----

commentBlocks.push(`/**

 * @param {string} foo
 *
 * tag description staring with gaps
 *
 * and extended tag description.
 */`);
compactResults.push(`/**
 * @param {string} foo
 * tag description staring with gaps
 * and extended tag description.
 */`);
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[18] ----

commentBlocks.push(`/**
 * @param {string} foo
 * tag description staring with gaps
 * and extended tag description.
 */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// Irregular spacing spacing --------------------------------------------------

// commentBlock[19] ----

commentBlocks.push(`/**
 *    @hidden
 */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[20] ----

commentBlocks.push(`/**
 *    @param indented
 */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[21] ----

commentBlocks.push(`/**
 *    @param {boolean} foo -
 *    description indented
 */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[22] ----

commentBlocks.push(`/**
 *    @param foo -
 *    description indented
 */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[23] ----

commentBlocks.push(`/**
 *    @param foo -
 *   description indented
 *
 *   @param bar -
 *  description indented
 */`);

compactResults.push(`/**
 *    @param foo -
 *   description indented
 *   @param bar -
 *  description indented
 */`);
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[24] ----

commentBlocks.push(`/**
 *  @param foo -
 *  description
 no delimiter
 */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// Irregular opening / closing lines & delimiter spacing ----------------------

// commentBlock[25] ----

commentBlocks.push(`/**
 * Should parse one line. */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[26] ----

commentBlocks.push(`/**
 *    Should parse one line with extra space.   */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[27] ----

commentBlocks.push(`/** It should
 *
 * parse */`);

compactResults.push(`/** It should
 * parse */`);
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// commentBlock[28] ----

commentBlocks.push(`/** It should
 * @tagOnLastLine */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

// Technically invalid comment blocks that parse correctly --------------------

// commentBlock[29] ----

commentBlocks.push(`/**
 * @param
 * foo - no param name / just description.
 */`);

compactResults.push(commentBlocks.at(-1));
compactResultsPratt.push(compactResults.at(-1));

preserveResults.push(commentBlocks.at(-1));
preserveResultsPratt.push(preserveResults.at(-1));

export {
  commentBlocks,
  compactResults,
  compactResultsPratt,
  preserveResults,
  preserveResultsPratt
};
