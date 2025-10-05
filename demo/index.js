/* globals Prism -- Not available as ESM */
import {
  parseComment, commentParserToESTree, estreeToString
} from '../src/index.js';
import {registerTemplate, Template} from '@webcoder49/code-input';

import Indent from '@webcoder49/code-input/plugins/indent.mjs';

import prismStyles from 'prismjs/themes/prism.min.css' with {type: 'css'};

import codeInputStyles from
  '@webcoder49/code-input/code-input.min.css' with {type: 'css'};

document.adoptedStyleSheets = [prismStyles, codeInputStyles];

registerTemplate(
  'syntax-highlighted',
  new Template(Prism.highlightElement, false, true, false, [new Indent()])
);

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
