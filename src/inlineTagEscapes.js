/**
 * @typedef {'pipe' | 'plain' | 'prefix' | 'space'} InlineTagFormat
 */

/**
 * Gets the label delimiter for an inline-tag format.
 * @param {InlineTagFormat} format
 * @returns {string}
 */
function getLabelDelimiter (format) {
  return format === 'prefix' ? ']' : '}';
}

/**
 * Decodes context-specific escape pairs in an inline-tag label.
 * @param {string} text
 * @param {InlineTagFormat} format
 * @returns {string}
 */
export function decodeInlineTagText (text, format) {
  const delimiter = getLabelDelimiter(format);
  let decoded = '';
  let idx = 0;

  while (idx < text.length) {
    const character = text[idx];
    if (character === '\\') {
      const nextCharacter = text[idx + 1];
      if (nextCharacter === '\\' || nextCharacter === delimiter) {
        decoded += nextCharacter;
        idx += 2;
        continue;
      }
    }
    decoded += character;
    idx++;
  }

  return decoded;
}

/**
 * Minimally encodes an inline-tag label for its output context.
 * @param {string} text
 * @param {InlineTagFormat} format
 * @returns {string}
 */
export function encodeInlineTagText (text, format) {
  const delimiter = getLabelDelimiter(format);
  let encoded = '';

  for (let idx = 0; idx < text.length; idx++) {
    const character = text[idx];
    if (character === delimiter) {
      encoded += `\\${delimiter}`;
      continue;
    }

    if (character === '\\') {
      const nextCharacter = text[idx + 1];
      if (
        nextCharacter === undefined ||
        nextCharacter === '\\' ||
        nextCharacter === delimiter
      ) {
        encoded += '\\\\';
        continue;
      }
    }

    encoded += character;
  }

  return encoded;
}
