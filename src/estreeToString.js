import {stringify as prattStringify} from 'jsdoc-type-pratt-parser';

/**
 * @typedef {import('./index.js').ESTreeToStringOptions} ESTreeToStringOptions
 */

/** @type {Record<string, Function>} */
const stringifiers = {
  JsdocBlock,

  /**
   * @param {import('./commentParserToESTree.js').JsdocDescriptionLine} node
   * @returns {string}
   */
  JsdocDescriptionLine ({
    initial, delimiter, postDelimiter, description
  }) {
    return `${initial}${delimiter}${postDelimiter}${description}`;
  },

  /**
   * @param {import('./commentParserToESTree.js').JsdocTypeLine} node
   * @returns {string}
   */
  JsdocTypeLine ({
    initial, delimiter, postDelimiter, rawType
  }) {
    return `${initial}${delimiter}${postDelimiter}${rawType}`;
  },

  /**
   * @param {import('./commentParserToESTree.js').JsdocInlineTag} node
   */
  JsdocInlineTag ({format, namepathOrURL, tag, text}) {
    return format === 'pipe'
      ? `{@${tag} ${namepathOrURL}|${text}}`
      : format === 'plain'
        ? `{@${tag} ${namepathOrURL}}`
        : format === 'prefix'
          ? `[${text}]{@${tag} ${namepathOrURL}}`
          // "space"
          : `{@${tag} ${namepathOrURL} ${text}}`;
  },

  JsdocTag
};

/**
 * @todo convert for use by escodegen (until may be patched to support
 *   custom entries?).
 * @param {import('./commentParserToESTree.js').JsdocBlock|
 *   import('./commentParserToESTree.js').JsdocDescriptionLine|
 *   import('./commentParserToESTree.js').JsdocTypeLine|
 *   import('./commentParserToESTree.js').JsdocTag|
 *   import('./commentParserToESTree.js').JsdocInlineTag|
 *   import('jsdoc-type-pratt-parser').RootResult
 * } node
 * @param {ESTreeToStringOptions} opts
 * @throws {Error}
 * @returns {string}
 */
function estreeToString (node, opts = {}) {
  if (Object.prototype.hasOwnProperty.call(stringifiers, node.type)) {
    return stringifiers[
      /**
       * @type {import('./commentParserToESTree.js').JsdocBlock|
       *   import('./commentParserToESTree.js').JsdocDescriptionLine|
       *   import('./commentParserToESTree.js').JsdocTypeLine|
       *   import('./commentParserToESTree.js').JsdocTag}
       */
      (node).type
    ](
      node,
      opts
    );
  }

  // We use raw type instead but it is a key as other apps may wish to traverse
  if (node.type.startsWith('JsdocType')) {
    return opts.preferRawType
      ? ''
      : `{${prattStringify(
        /** @type {import('jsdoc-type-pratt-parser').RootResult} */ (
          node
        )
      )}}`;
  }

  throw new Error(`Unhandled node type: ${node.type}`);
}

/**
 * @param {import('./commentParserToESTree.js').JsdocBlock} node
 * @param {ESTreeToStringOptions} opts
 * @returns {string}
 */
function JsdocBlock (node, opts) {
  const {delimiter, delimiterLineBreak, descriptionLines,
    initial, postDelimiter, preterminalLineBreak, tags, terminal} = node;

  const terminalPrepend = preterminalLineBreak !== ''
    ? `${preterminalLineBreak}${initial} `
    : '';

  let result = `${initial}${delimiter}${postDelimiter}${delimiterLineBreak}`;

  for (let i = 0; i < descriptionLines.length; i++) {
    result += estreeToString(descriptionLines[i]);

    if (i !== descriptionLines.length - 1 || tags.length) {
      result += '\n';
    }
  }

  for (let i = 0; i < tags.length; i++) {
    result += estreeToString(tags[i], opts);

    if (i !== tags.length - 1) {
      result += '\n';
    }
  }

  result += `${terminalPrepend}${terminal}`;

  return result;
}

/**
 * @param {import('./commentParserToESTree.js').JsdocTag} node
 * @param {ESTreeToStringOptions} opts
 * @returns {string}
 */
function JsdocTag (node, opts) {
  const {
    delimiter, descriptionLines, initial, name, parsedType, postDelimiter,
    postName, postTag, postType, tag, typeLines
  } = node;

  let result = `${initial}${delimiter}${postDelimiter}@${tag}${postTag}`;

  // Could do `rawType` but may have been changed; could also do
  //   `typeLines` but not as likely to be changed
  // parsedType
  // Comment this out later in favor of `parsedType`
  // We can't use raw `typeLines` as first argument has delimiter on it
  if (opts.preferRawType || !parsedType) {
    if (typeLines.length) {
      result += '{';

      for (let i = 0; i < typeLines.length; i++) {
        result += estreeToString(typeLines[i]);

        if (i !== typeLines.length - 1) {
          result += '\n';
        }
      }

      result += '}';
    }
  } else if (parsedType?.type.startsWith('JsdocType')) {
    result += `{${prattStringify(
      /** @type {import('jsdoc-type-pratt-parser').RootResult} */ (
        parsedType
      )
    )}}`;
  }

  result += name ? `${postType}${name}${postName}` : postType;

  for (let i = 0; i < descriptionLines.length; i++) {
    const descriptionLine = descriptionLines[i];

    result += estreeToString(descriptionLine);

    if (i !== descriptionLines.length - 1) {
      result += '\n';
    }
  }

  return result;
}

export {estreeToString};
