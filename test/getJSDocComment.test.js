import {RuleTester} from 'eslint';
import {getJSDocComment} from '../src/index.js';

/**
 * @param {import('eslint').Rule.RuleContext} ctxt
 */
const getSettings = (ctxt) => {
  const jsdocSettings = /** @type {{maxLines: number, minLines: number}} */ (
    ctxt.settings.jsdoc
  );
  return {
    maxLines: Number(jsdocSettings?.maxLines ?? 1),
    minLines: Number(jsdocSettings?.minLines ?? 0)
  };
};

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  create (ctxt) {
    const {sourceCode} = ctxt;
    const settings = getSettings(ctxt);
    if (!settings) {
      return {};
    }

    return {
      ArrowFunctionExpression (node) {
        const comment = getJSDocComment(sourceCode, node, settings);
        if (comment !== null) {
          return;
        }
        ctxt.report({
          messageId: 'missingJsDoc',
          node
        });
      },
      Property (node) {
        const comment = getJSDocComment(sourceCode, node, settings);
        if (comment !== null) {
          return;
        }
        ctxt.report({
          messageId: 'missingJsDoc',
          node
        });
      },
      ObjectExpression (node) {
        const comment = getJSDocComment(sourceCode, node, settings);
        if (comment !== null) {
          return;
        }
        ctxt.report({
          messageId: 'missingJsDoc',
          node
        });
      }
    };
  },
  meta: {
    messages: {
      missingJsDoc: 'Missing JSDoc comment.'
    },
    type: 'layout'
  }
};

const ruleTester = new RuleTester();

ruleTester.run('getJSDocComment', rule, {
  invalid: [{
    code: 'var a = {};',
    errors: [{messageId: 'missingJsDoc'}]
  }, {
    code: `
      var comment = /** @type {EsprimaComment} */ ({
          value: text
      });
    `,
    errors: [{messageId: 'missingJsDoc', type: 'Property'}]
  }],
  valid: [{
    code: `
    /** Doc */
    var a = {};
    `
  }, {
    code: `
    /** Doc */
    // eslint-disable-next-line no-var
    var a = {};
    `
  }, {
    code: `
      app.use(
        /** @type {express.ErrorRequestHandler} */
        (
          (err, req, res, next) => {
            // foo
          }
        )
      );
    `
  }, {
    code: `
      app.use(
        (
          /** @param err */
          (err, req, res, next) => {
            // foo
          }
        )
      );
    `
  }]
});
