import {RuleTester} from 'eslint';
import {getJSDocComment} from '../src/index.js';

const getSettings = (ctxt) => {
  return {
    maxLines: Number(ctxt.settings.jsdoc?.maxLines ?? 1),
    minLines: Number(ctxt.settings.jsdoc?.minLines ?? 0)
  };
};

const rule = {
  create (ctxt) {
    const sourceCode = ctxt.getSourceCode();
    const settings = getSettings(ctxt);
    if (!settings) {
      return {};
    }

    return {
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
  }]
});
