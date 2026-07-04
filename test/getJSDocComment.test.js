import {RuleTester, SourceCode} from 'eslint';
import {traverse} from 'estraverse';
import typescriptEslintParser from 'typescript-eslint';
import TSVisitorKeys from '@typescript-eslint/visitor-keys';
import {getJSDocComment} from '../src/index.js';

/**
 * @typedef {import('@typescript-eslint/types').TSESTree.ClassDeclaration}
 *   TSClassDeclaration
 */

/**
 * @typedef {import('@typescript-eslint/types').TSESTree.FunctionDeclaration}
 *   TSFunctionDeclaration
 */

/**
 * @typedef {import('@typescript-eslint/types').TSESTree.TSModuleDeclaration}
 *   TSModuleDeclaration
 */

/**
 * @typedef {import('@typescript-eslint/types').TSESTree.StaticBlock}
 *   TSStaticBlock
 */

/**
 * @typedef {(code: string, options: Record<string, boolean>) => {
 *   ast: import('eslint').AST.Program
 * }} ParseTypeScriptForESLint
 */
const parseTypeScriptForESLint = /** @type {ParseTypeScriptForESLint} */ (
  typescriptEslintParser.parser.parseForESLint
);

/**
 * @param {string} code
 * @returns {import('eslint').AST.Program}
 */
function parseTypeScriptAddingParents (code) {
  const {ast} = parseTypeScriptForESLint(code, {
    tokens: true,
    comment: true,
    loc: true,
    range: true
  });

  const program = /** @type {import('eslint').AST.Program} */ (
    ast
  );

  traverse(program, {
    enter (node, parent) {
      if (!node || !parent) {
        return;
      }

      /** @type {import('estree').Node & {parent: import('estree').Node}} */ (
        node
      ).parent = parent;
    },
    keys: /** @type {Record<string, string[]>} */ (
      TSVisitorKeys.visitorKeys
    )
  });
  return program;
}

/**
 * @param {string} code
 * @returns {{
 *   ast: import('eslint').AST.Program,
 *   sourceCode: import('eslint').SourceCode
 * }}
 */
function getTypeScriptSourceCode (code) {
  const ast = parseTypeScriptAddingParents(code);
  return {
    ast,
    sourceCode: new SourceCode(code, ast)
  };
}

const overloadSettings = {
  maxLines: 1,
  minLines: 0
};

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

describe('`getJSDocComment` overload comments', function () {
  it('gets a class method overload comment from a previous overload',
    function () {
      const code = `
        class Example {
          /** Class overload docs */
          value(input: string): string;
          value(input: number): number;
          value(input: string | number): string | number {
            return input;
          }
        }
      `;
      const {ast, sourceCode} = getTypeScriptSourceCode(code);
      const implementation =
        /** @type {TSClassDeclaration} */ (ast.body[0]).body.body[2];

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (implementation),
        overloadSettings,
        {checkOverloads: true}
      );

      expect(comment?.value).to.contain('Class overload docs');
    });

  it('gets an abstract method overload comment from a previous overload',
    function () {
      const code = `
        abstract class Example {
          /** Abstract overload docs */
          abstract value(input: string): string;
          abstract value(input: number): number;
        }
      `;
      const {ast, sourceCode} = getTypeScriptSourceCode(code);
      const overload =
        /** @type {TSClassDeclaration} */ (ast.body[0]).body.body[1];

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (overload),
        overloadSettings,
        {checkOverloads: true}
      );

      expect(comment?.value).to.contain('Abstract overload docs');
    });

  it('does not use a previous class method comment for a different name',
    function () {
      const code = `
        class Example {
          /** Other method docs */
          value(input: string): string;
          other(input: number): number;
        }
      `;
      const {ast, sourceCode} = getTypeScriptSourceCode(code);
      const method =
        /** @type {TSClassDeclaration} */ (ast.body[0]).body.body[1];

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (method),
        overloadSettings,
        {checkOverloads: true}
      );

      expect(comment).to.equal(null);
    });

  it('does not use a previous class method implementation comment',
    function () {
      const code = `
        class Example {
          /** Implementation docs */
          value() {
            return 1;
          }
          value() {
            return 2;
          }
        }
      `;
      const {ast, sourceCode} = getTypeScriptSourceCode(code);
      const method =
        /** @type {TSClassDeclaration} */ (ast.body[0]).body.body[1];

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (method),
        overloadSettings,
        {checkOverloads: true}
      );

      expect(comment).to.equal(null);
    });

  it('does not use getter comments for setter pairs',
    function () {
      const code = `
        class Example {
          /** Getter docs */
          get value() {
            return 1;
          }
          set value(input: number) {
            this.internalValue = input;
          }
        }
      `;
      const {ast, sourceCode} = getTypeScriptSourceCode(code);
      const setter =
        /** @type {TSClassDeclaration} */ (ast.body[0]).body.body[1];

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (setter),
        overloadSettings,
        {checkOverloads: true}
      );

      expect(comment).to.equal(null);
    });

  it('still gets a function overload comment from a previous declaration',
    function () {
      const code = `
        /** Function overload docs */
        function value(input: string): string;
        function value(input: number): number;
        function value(input: string | number): string | number {
          return input;
        }
      `;
      const {ast, sourceCode} = getTypeScriptSourceCode(code);

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (ast.body[2]),
        overloadSettings,
        {checkOverloads: true}
      );

      expect(comment?.value).to.contain('Function overload docs');
    });

  it('gets a nested function overload comment from a previous overload',
    function () {
      const code = `
        function outer() {
          /** Nested function overload docs */
          function value(input: string): string;
          function value(input: number): number;
          function value(input: string | number): string | number {
            return input;
          }
        }
      `;
      const {ast, sourceCode} = getTypeScriptSourceCode(code);
      const outer = /** @type {TSFunctionDeclaration} */ (ast.body[0]);
      const implementation = outer.body.body[2];

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (implementation),
        overloadSettings,
        {checkOverloads: true}
      );

      expect(comment?.value).to.contain('Nested function overload docs');
    });

  it('does not check overload siblings without a statement-list parent',
    function () {
      const code = `
        function value(input: string): string {
          return input;
        }
      `;
      const {ast, sourceCode} = getTypeScriptSourceCode(code);
      const declaration = /** @type {TSFunctionDeclaration} */ (ast.body[0]);
      const {parent} = declaration;
      declaration.parent =
        /** @type {TSFunctionDeclaration['parent']} */ (
          /** @type {unknown} */ (declaration.id)
        );

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (declaration),
        overloadSettings,
        {checkOverloads: true}
      );

      declaration.parent = parent;
      expect(comment).to.equal(null);
    });

  it('gets a static block function overload comment from a previous overload',
    function () {
      const code = `
        class Example {
          static {
            /** Static block overload docs */
            function value(input: string): string;
            function value(input: number): number;
            function value(input: string | number): string | number {
              return input;
            }
          }
        }
      `;
      const {ast, sourceCode} = getTypeScriptSourceCode(code);
      const block =
        /** @type {TSStaticBlock} */ (
          /** @type {TSClassDeclaration} */ (ast.body[0]).body.body[0]
        );
      const implementation = block.body[2];

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (implementation),
        overloadSettings,
        {checkOverloads: true}
      );

      expect(comment?.value).to.contain('Static block overload docs');
    });

  it('gets a namespace export overload comment from a previous overload',
    function () {
      const code = `
        namespace Example {
          /** Namespace overload docs */
          export function value(input: string): string;
          export function value(input: number): number;
          export function value(input: string | number): string | number {
            return input;
          }
        }
      `;
      const {ast, sourceCode} = getTypeScriptSourceCode(code);
      const namespace = /** @type {TSModuleDeclaration} */ (
        /** @type {unknown} */ (ast.body[0])
      );
      const namespaceBody =
        /** @type {{body: import('eslint').Rule.Node[]}} */ (
          /** @type {unknown} */ (namespace.body)
        );
      const implementation =
        /** @type {{declaration: import('eslint').Rule.Node}} */ (
          /** @type {unknown} */ (namespaceBody.body[2])
        ).declaration;

      const comment = getJSDocComment(
        sourceCode,
        implementation,
        overloadSettings,
        {checkOverloads: true}
      );

      expect(comment?.value).to.contain('Namespace overload docs');
    });

  it('gets a nested class method overload comment from a previous overload',
    function () {
      const code = `
        function outer() {
          class Example {
            /** Nested class overload docs */
            value(input: string): string;
            value(input: number): number;
            value(input: string | number): string | number {
              return input;
            }
          }
        }
      `;
      const {ast, sourceCode} = getTypeScriptSourceCode(code);
      const outer = /** @type {TSFunctionDeclaration} */ (ast.body[0]);
      const classDeclaration =
        /** @type {TSClassDeclaration} */ (outer.body.body[0]);
      const implementation = classDeclaration.body.body[2];

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (implementation),
        overloadSettings,
        {checkOverloads: true}
      );

      expect(comment?.value).to.contain('Nested class overload docs');
    });

  it('does not use a nested function overload comment for a different name',
    function () {
      const code = `
        function outer() {
          /** Nested function overload docs */
          function value(input: string): string;
          function other(input: number): number;
        }
      `;
      const {ast, sourceCode} = getTypeScriptSourceCode(code);
      const outer = /** @type {TSFunctionDeclaration} */ (ast.body[0]);
      const overload = outer.body.body[1];

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (overload),
        overloadSettings,
        {checkOverloads: true}
      );

      expect(comment).to.equal(null);
    });

  it('does not use a previous function implementation comment',
    function () {
      const code = `
        function outer() {
          /** Implementation docs */
          function value(input: string): string {
            return input;
          }
          function value(input: number): number;
        }
      `;
      const {ast, sourceCode} = getTypeScriptSourceCode(code);
      const outer = /** @type {TSFunctionDeclaration} */ (ast.body[0]);
      const overload = outer.body.body[1];

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (overload),
        overloadSettings,
        {checkOverloads: true}
      );

      expect(comment).to.equal(null);
    });

  it('does not use computed method overload comments',
    function () {
      const code = `
        const key = 'value';
        class Example {
          /** Computed overload docs */
          [key](input: string): string;
          [key](input: number): number;
        }
      `;
      const {ast, sourceCode} = getTypeScriptSourceCode(code);
      const method =
        /** @type {TSClassDeclaration} */ (ast.body[1]).body.body[1];

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (method),
        overloadSettings,
        {checkOverloads: true}
      );

      expect(comment).to.equal(null);
    });
});

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
