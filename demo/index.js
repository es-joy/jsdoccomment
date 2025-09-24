import {
  parseComment, commentParserToESTree, estreeToString
} from '../src/index.js';

/**
 * @param {string} sel
 */
const $te = (sel) => {
  return /** @type {HTMLTextAreaElement} */ (document.querySelector(sel));
};

/**
 * @returns {void}
 */
function setValues () {
  let output;
  let outputStr;

  try {
    const parsedComment = parseComment($te('#source').value);
    try {
      output = commentParserToESTree(parsedComment);
      outputStr = JSON.stringify(output, null, 2);
    } catch (err) {
      // eslint-disable-next-line no-console -- Debugging
      console.error(err);
      outputStr = '`commentParserToESTree` error: ' +
      /** @type {Error} */ (err).message;
    }
  } catch (err) {
    // eslint-disable-next-line no-console -- Debugging
    console.error(err);
    outputStr = '`parseComment` error: ' +
    /** @type {Error} */ (err).message;
  }

  $te('#output').value = outputStr;
  $te('#stringified').value = typeof output !== 'undefined'
    ? estreeToString(output)
    : '(No output to stringify)';
}

$te('#source').addEventListener('input', setValues);

setValues();
