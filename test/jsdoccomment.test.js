import {parse as espreeParse} from 'espree';
import {traverse} from 'estraverse';
import {SourceCode} from 'eslint';
import typescriptEslintParser from 'typescript-eslint';
import TSVisitorKeys from '@typescript-eslint/visitor-keys';

import {
  getReducedASTNode,
  getJSDocComment,
  // getDecorator,
  findJSDocComment,
  getNonJsdocComment,
  getFollowingComment
} from '../src/index.js';

const ESPREE_DEFAULT_CONFIG = {
  ecmaVersion: 6,
  comment: true,
  tokens: true,
  range: true,
  loc: true
};

/**
 * @param {string} code
 * @param {{
 *   ecmaVersion: number,
 *   comment: boolean,
 *   tokens: boolean,
 *   range: boolean,
 *   loc: boolean
 * }} config
 * @param {{parser?: string}} cfg
 * @returns {import('eslint').AST.Program}
 */
function parseAddingParents (
  code, config = ESPREE_DEFAULT_CONFIG, {parser} = {}
) {
  const ast = parser === 'typescript'
    ? /** @type {import('eslint').AST.Program} */ (
      // @ts-expect-error Bug?
      typescriptEslintParser.parser.parseForESLint(code, {
        tokens: true,
        comment: true,
        loc: true,
        range: true
      }).ast
    )
    : espreeParse(code, config);

  traverse(ast, {
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
  return ast;
}

describe('`getReducedASTNode`', function () {
  it('gets `FunctionDeclaration`', function () {
    const code = `function quux () {}`;
    const ast = parseAddingParents(code);

    // console.log('ast', Object.keys(ast));

    const sourceCode = new SourceCode(code, ast);

    const parsed = getReducedASTNode(
      /** @type {import('eslint').Rule.Node} */ (ast.body[0]), sourceCode
    );
    expect(parsed.type).to.equal('FunctionDeclaration');
  });

  it('gets `ClassDeclaration`', function () {
    const code = `class quux {}`;
    const ast = parseAddingParents(code);

    // console.log('ast', Object.keys(ast));

    const sourceCode = new SourceCode(code, ast);

    const parsed = getReducedASTNode(
      /** @type {import('eslint').Rule.Node} */ (ast.body[0]), sourceCode
    );
    expect(parsed.type).to.equal('ClassDeclaration');
  });

  it('gets `VariableDeclaration` of class expression', function () {
    const code = `(class {});`;
    const ast = parseAddingParents(code);

    // console.log('ast', Object.keys(ast));

    const sourceCode = new SourceCode(code, ast);

    const parsed = getReducedASTNode(
      /** @type {import('eslint').Rule.Node} */ (
        /** @type {import('estree').ExpressionStatement} */
        (ast.body[0]).expression
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('ExpressionStatement');
  });

  it('gets `ArrowFunctionExpression` with preceding line comment', function () {
    const code = `(
      // With comment
      () => {}
    )`;
    const ast = parseAddingParents(code);

    const sourceCode = new SourceCode(code, ast);

    const parsed = getReducedASTNode(
      /** @type {import('eslint').Rule.Node} */ (
        /** @type {import('estree').ExpressionStatement} */
        (ast.body[0]).expression
      ), sourceCode
    );
    expect(parsed.type).to.equal('ArrowFunctionExpression');
  });

  it('gets `TSDeclareFunction`', function () {
    const code = `
      function bar(arg: true): true;
    `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});

    const sourceCode = new SourceCode(code, ast);

    const parsed = getReducedASTNode(
      /** @type {import('eslint').Rule.Node} */ (
        ast.body[0]
      ), sourceCode
    );
    expect(parsed.type).to.equal('TSDeclareFunction');
  });

  it('gets `ExportNamedDeclaration` from arrow function', function () {
    const code = `
      export const a = () => {};
    `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});

    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('eslint').Rule.Node} */ (
        /** @type {import('estree').VariableDeclaration} */ (
          /** @type {import('estree').ExportNamedDeclaration} */ (
            ast.body[0]
          ).declaration
        ).declarations[0].init
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('ExportNamedDeclaration');
  });

  it('gets `ExportDefaultDeclaration` from function declaration', function () {
    const code = `
      export default function abc () {};
    `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('eslint').Rule.Node} */ (
        /** @type {import('estree').ExportDefaultDeclaration} */
        (ast.body[0]).declaration
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('ExportDefaultDeclaration');
  });

  it('gets `ExportNamedDeclaration` from `TSFunctionType`', function () {
    const code = `
      /**
       * Some test function type.
       */
      export type Test = (foo: number) => string;
    `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('eslint').Rule.Node} */ (
        /** @type {import('estree').ExportNamedDeclaration} */
        // @ts-expect-error Ok
        (ast.body[0]).declaration?.typeAnnotation
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('ExportNamedDeclaration');
  });

  it('gets `TSEnumDeclaration`', function () {
    const code = `enum testEnum {
      A, B
    }`;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('eslint').Rule.Node} */ (
        ast.body[0]
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('TSEnumDeclaration');
  });

  it('gets `TSTypeAliasDeclaration`', function () {
    const code = `type testType = string | number;`;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('eslint').Rule.Node} */ (
        ast.body[0]
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('TSTypeAliasDeclaration');
  });

  it('gets `TSInterfaceDeclaration`', function () {
    const code = `
      interface Test {
        aFunc: () => void;
        aVar: string;
      }
    `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('eslint').Rule.Node} */ (
        ast.body[0]
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('TSInterfaceDeclaration');
  });

  it('gets `VariableDeclaration` from `TSFunctionType`', function () {
    const code = `
      let TestFunction: (id) => void;
    `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('@typescript-eslint/types').TSESTree.Node} */ (
        /**
         * @type {import('@typescript-eslint/types').TSESTree.
         *   TSTypeAnnotation
         * }
         */ (
          /**
           * @type {import('@typescript-eslint/types').TSESTree.
           *   VariableDeclaration
           * }
           */ (
            ast.body[0]
          ).declarations[0].id.typeAnnotation
        ).typeAnnotation
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('VariableDeclaration');
  });

  it('gets `FunctionDeclaration` from `TSFunctionType`', function () {
    const code = `
      function test(
        processor: (id: number) => string
      ) {
        return processor(10);
      }
    `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('@typescript-eslint/types').TSESTree.Node} */ (
        /**
         * @type {import('@typescript-eslint/types').TSESTree.
         *   TSTypeAnnotation
         * }
         */ (
          /**
           * @type {import('@typescript-eslint/types').TSESTree.Identifier}
           */ (
            /**
             * @type {import('@typescript-eslint/types').TSESTree.
             *   FunctionDeclaration
             * }
             */
            (ast.body[0]).params[0]
          ).typeAnnotation
        ).typeAnnotation
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('FunctionDeclaration');
  });

  it(
    'gets `VariableDeclaration` from `TSFunctionType` (on arrow)',
    function () {
      const code = `
        const a = (
          processor: (id: number) => string
        ) => {
          return processor(10);
        }
      `;
      const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
      const sourceCode = new SourceCode(code, ast);
      const parsed = getReducedASTNode(
        /** @type {import('@typescript-eslint/types').TSESTree.Node} */ (
          /**
           * @type {import('@typescript-eslint/types').TSESTree.
           *   TSTypeAnnotation
           * }
           */
          (/** @type {import('@typescript-eslint/types').TSESTree.Identifier} */
            (
            /**
             * @type {import('@typescript-eslint/types').TSESTree.
             *   ArrowFunctionExpression
             * }
             */ (
              /**
               * @type {import('@typescript-eslint/types').TSESTree.
               *   VariableDeclarator
               * }
               */ (
                /**
                 * @type {import('@typescript-eslint/types').TSESTree.
                 *   VariableDeclaration
                 * }
                 */ (
                    ast.body[0]
                  ).declarations[0]
                ).init
              ).params[0]
            ).typeAnnotation
          ).typeAnnotation
        ),
        sourceCode
      );
      expect(parsed.type).to.equal('VariableDeclaration');
    }
  );

  it('gets `TSFunctionType` from `TSFunctionType` (arrow)', function () {
    const code = `
      ((
        processor: (id: number) => string
      ) => {
        return processor(10);
      })
    `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('@typescript-eslint/types').TSESTree.Node} */ (
        /**
         * @type {import('@typescript-eslint/types').TSESTree.
         *   TSTypeAnnotation
         * }
         */
        (/** @type {import('@typescript-eslint/types').TSESTree.Identifier} */
          (
            /**
             * @type {import('@typescript-eslint/types').TSESTree.
             *   ArrowFunctionExpression
             * }
             */ (
              /**
               * @type {import('@typescript-eslint/types').TSESTree.
               *   ExpressionStatement
               * }
               */ (
                ast.body[0]
              ).expression
            ).params[0]
          ).typeAnnotation
        ).typeAnnotation
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('TSFunctionType');
  });

  it('gets `MethodDefinition` from `TSFunctionType` (method)', function () {
    const code = `
      class TestClass {
        public TestMethod(): (id: number) => string {}
      }
      `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('@typescript-eslint/types').TSESTree.Node} */ (
        /**
         * @type {import('@typescript-eslint/types').TSESTree.
         *   TSTypeAnnotation
         * }
         */
        (/**
         * @type {import('@typescript-eslint/types').TSESTree.
         *   MethodDefinition
         * }
         */ (
          /**
           * @type {import('@typescript-eslint/types').TSESTree.
           *   ClassDeclaration
           * }
           */ (
              ast.body[0]
            ).body.body[0]
          ).value.returnType).typeAnnotation
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('MethodDefinition');
  });

  it('gets `Program` from `TSFunctionType` (method)', function () {
    const code = `
        let test = (): (id: number) => string => {
          return (id) => \`\${id}\`;
        }
      `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('@typescript-eslint/types').TSESTree.Node} */ (
        /**
         * @type {import('@typescript-eslint/types').TSESTree.
         *  TSTypeAnnotation
         * }
         */
        (
          /**
           * @type {import('@typescript-eslint/types').TSESTree.
           *   ArrowFunctionExpression
           * }
           */
          (
            /**
             * @type {import('@typescript-eslint/types').TSESTree.
             *   VariableDeclaration
             * }
             */ (
              ast.body[0]
            ).declarations[0].init).returnType).typeAnnotation
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('Program');
  });

  it('gets `TSPropertySignature` from `TSFunctionType`', function () {
    const code = `
      interface B {
        g: () => string;
      }
    `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('@typescript-eslint/types').TSESTree.Node} */ (
        /**
         * @type {import('@typescript-eslint/types').TSESTree.
         *   TSTypeAnnotation
         * }
         */
        (/**
         * @type {import('@typescript-eslint/types').TSESTree.
         *   TSPropertySignature
         * }
         */
          (
            /**
             * @type {import('@typescript-eslint/types').TSESTree.
             *   TSInterfaceDeclaration
             * }
             */ (
              /** @type {import('@typescript-eslint/types').TSESTree.Program} */
              (ast).body[0]
            ).body.body[0]
          ).typeAnnotation
        ).typeAnnotation
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('TSPropertySignature');
  });

  it('gets `TSMethodSignature` from `TSFunctionType`', function () {
    const code = `
      interface TestInterface {
        TestMethod(): (id: number) => string;
      }
    `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('@typescript-eslint/types').TSESTree.Node} */ (
        /**
         * @type {import('@typescript-eslint/types').TSESTree.
         *   TSTypeAnnotation
         * }
         */
        (
          /**
           * @type {import('@typescript-eslint/types').TSESTree.
           *   TSMethodSignature
           * }
           */
          (
            /**
             * @type {import('@typescript-eslint/types').TSESTree.
             *   TSInterfaceDeclaration}
             */
            (
              /** @type {import('@typescript-eslint/types').TSESTree.Program} */
              (ast).body[0]
            ).body.body[0]
          ).returnType).typeAnnotation
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('TSMethodSignature');
  });

  it('gets `TSDeclareFunction` from `TSFunctionType`', function () {
    const code = `
      function test(): (id: number) => string;
    `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('@typescript-eslint/types').TSESTree.Node} */ (
        /**
         * @type {import('@typescript-eslint/types').TSESTree.
         *   TSTypeAnnotation
         * }
         */
        (
          /**
           * @type {import('@typescript-eslint/types').TSESTree.
           *   TSDeclareFunction
           * }
           */
          (
            /** @type {import('@typescript-eslint/types').TSESTree.Program} */
            (ast).body[0]
          ).returnType
        ).typeAnnotation
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('TSDeclareFunction');
  });

  it('gets `PropertyDefinition` from `TSFunctionType`', function () {
    const code = `
        class TestClass {
          public Test: (id: number) => string;
        }
    `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);
    const parsed = getReducedASTNode(
      /** @type {import('@typescript-eslint/types').TSESTree.Node} */ (
        /**
         * @type {import('@typescript-eslint/types').TSESTree.
         *   TSTypeAnnotation
         * }
         */
        (/**
         * @type {import('@typescript-eslint/types').TSESTree.
         *   PropertyDefinition}
         */ (
          /**
           * @type {import('@typescript-eslint/types').TSESTree.
           *   ClassDeclaration}
           */ (
              ast.body[0]
            ).body.body[0]
          ).typeAnnotation
        ).typeAnnotation
      ),
      sourceCode
    );
    expect(parsed.type).to.equal('PropertyDefinition');
  });
});

describe('`findJSDocComment', function () {
  it('gets JSDoc above decorator', function () {
    const code = `/**
      * Some JSDoc
      */
      @Entity('users')
      export class User {}`;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(
      code, /** @type {import('eslint').AST.Program} */ (ast)
    );

    const comment = findJSDocComment(
      /** @type {import('eslint').Rule.Node} */ (ast.body[0]),
      sourceCode,
      {
        minLines: 0, maxLines: 1
      }
    );
    expect(comment?.type).to.equal('Block');
    expect(comment?.value).to.contain('Some JSDoc');
  });

  it('gets JSDoc above method decorator', function () {
    const code = `class AppController {
      /**
       * Some info
       */
      @Get('/info')
      public getInfo(): string {
        return 'OK';
      }
    }`;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(
      code, /** @type {import('eslint').AST.Program} */ (ast)
    );

    const comment = findJSDocComment(
      /** @type {import('eslint').Rule.Node} */
      (/** @type {import('estree').ClassDeclaration} */ (
        ast.body[0]).body.body[0]
      ),
      sourceCode,
      {
        minLines: 0, maxLines: 1
      }
    );
    expect(comment?.type).to.equal('Block');
    expect(comment?.value).to.contain('Some info');
  });

  it('Gets comment for decorator', function () {
    const code = `export class MyComponentComponent {
        /**
         * Some info
         */
        @Input()
        public value = new EventEmitter();
      }`;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(
      code, /** @type {import('eslint').AST.Program} */ (ast)
    );

    const propertyDef = /** @type {import('estree').ClassDeclaration} */ (
      /** @type {import('estree').ExportNamedDeclaration} */
      (ast.body[0]).declaration
    ).body.body[0];

    const comment = findJSDocComment(
      /** @type {import('@typescript-eslint/types').TSESTree.Node} */
      (
        /**
         * @type {import('@typescript-eslint/types').TSESTree.
         *   PropertyDefinition}
         */ (
          propertyDef
        ).decorators[0]
      ),
      sourceCode,
      {
        minLines: 0, maxLines: 1
      }
    );
    expect(comment?.type).to.equal('Block');
    expect(comment?.value).to.contain('Some info');
  });
});

describe('`getNonJsdocComment`', function () {
  it('gets line comment', function () {
    const code = `// Test
function quux () {}`;
    const ast = parseAddingParents(code);
    const sourceCode = new SourceCode(code, ast);

    const comment = getNonJsdocComment(
      sourceCode,
      /** @type {import('eslint').Rule.Node} */ (ast.body[0]),
      {
        minLines: 0, maxLines: 1
      }
    );
    expect(comment?.type).to.equal('Line');
    expect(comment?.value).to.equal(' Test');
  });

  it('gets non-JSDoc multiline comments', function () {
    const code = `/* Test */
function quux () {}`;
    const ast = parseAddingParents(code);
    const sourceCode = new SourceCode(code, ast);

    const comment = getNonJsdocComment(
      sourceCode,
      /** @type {import('eslint').Rule.Node} */ (ast.body[0]),
      {
        minLines: 0, maxLines: 1
      }
    );
    expect(comment?.type).to.equal('Block');
    expect(comment?.value).to.equal(' Test ');
  });

  it('ignores JSDoc multiline comments', function () {
    const code = `/** Test */
function quux () {}`;
    const ast = parseAddingParents(code);
    const sourceCode = new SourceCode(code, ast);

    const comment = getNonJsdocComment(
      sourceCode,
      /** @type {import('eslint').Rule.Node} */ (ast.body[0]),
      {
        minLines: 0, maxLines: 1
      }
    );
    expect(comment).to.equal(null);
  });
});

describe('`getFollowingComment`', function () {
  it('gets line comment after function block', function () {
    const code = `function quux () {
} // Test`;
    const ast = parseAddingParents(code);
    const sourceCode = new SourceCode(code, ast);

    const comment = getFollowingComment(
      sourceCode,
      /** @type {import('eslint').Rule.Node} */ (ast.body[0])
    );
    expect(comment?.type).to.equal('Line');
    expect(comment?.value).to.equal(' Test');
  });

  it('gets line comment following parenthesized expression', function () {
    const code = `(function quux () {
}) // Test`;
    const ast = parseAddingParents(code);
    const sourceCode = new SourceCode(code, ast);

    const comment = getFollowingComment(
      sourceCode,
      /** @type {import('eslint').Rule.Node} */ (ast.body[0])
    );
    expect(comment?.type).to.equal('Line');
    expect(comment?.value).to.equal(' Test');
  });

  it(
    'gets line comment following parenthesized expression ' +
      'on line with parenthesis',
    function () {
      const code = `(
      function quux () {
      }
  ) // Test`;
      const ast = parseAddingParents(code);
      const sourceCode = new SourceCode(code, ast);

      const comment = getFollowingComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (ast.body[0])
      );
      expect(comment?.type).to.equal('Line');
      expect(comment?.value).to.equal(' Test');
    }
  );

  it('ignores line comment within function body', function () {
    const code = `
    function quux () {
      // Test
    }
`;
    const ast = parseAddingParents(code);
    const sourceCode = new SourceCode(code, ast);

    const comment = getFollowingComment(
      sourceCode,
      /** @type {import('eslint').Rule.Node} */ (ast.body[0])
    );
    expect(comment).to.equal(null);
  });

  it(
    'finds line comment preceding parenthesis of parenthesized expression',
    function () {
      const code = `(
      function quux () {
      } // Test
  )`;
      const ast = parseAddingParents(code);
      const sourceCode = new SourceCode(code, ast);

      const comment = getFollowingComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (ast.body[0])
      );
      expect(comment?.type).to.equal('Line');
      expect(comment?.value).to.equal(' Test');
    }
  );

  it('gets block comment after function body', function () {
    const code = `function quux () {
} /* Test */`;
    const ast = parseAddingParents(code);
    const sourceCode = new SourceCode(code, ast);

    const comment = getFollowingComment(
      sourceCode,
      /** @type {import('eslint').Rule.Node} */ (ast.body[0])
    );
    expect(comment?.type).to.equal('Block');
    expect(comment?.value).to.equal(' Test ');
  });

  it('avoids line comment on line after function body', function () {
    const code = `function quux () {
}
// Test`;
    const ast = parseAddingParents(code);
    const sourceCode = new SourceCode(code, ast);

    const comment = getFollowingComment(
      sourceCode,
      /** @type {import('eslint').Rule.Node} */ (ast.body[0])
    );
    expect(comment).to.equal(null);
  });

  it('avoids block comment on line following function', function () {
    const code = `function quux () {}
/* Test */`;
    const ast = parseAddingParents(code);
    const sourceCode = new SourceCode(code, ast);

    const comment = getFollowingComment(
      sourceCode,
      /** @type {import('eslint').Rule.Node} */ (ast.body[0])
    );
    expect(comment).to.equal(null);
  });

  it('gets line comment after number in expression statement', function () {
    const code = `(5) // Test`;
    const ast = parseAddingParents(code);
    const sourceCode = new SourceCode(code, ast);

    const comment = getFollowingComment(
      sourceCode,
      /** @type {import('eslint').Rule.Node} */ (ast.body[0])
    );
    expect(comment?.type).to.equal('Line');
    expect(comment?.value).to.equal(' Test');
  });

  it('gets line comment after function variable declarator', function () {
    const code = `var a = function quux () {
} // Test`;
    const ast = parseAddingParents(code);
    const sourceCode = new SourceCode(code, ast);

    const comment = getFollowingComment(
      sourceCode,
      /** @type {import('eslint').Rule.Node} */ (
        /** @type {import('estree').VariableDeclaration} */
        (ast.body[0]).declarations[0]
      )
    );
    expect(comment?.type).to.equal('Line');
    expect(comment?.value).to.equal(' Test');
  });

  it('gets line comment after number variable declarator', function () {
    const code = `var a = 5; // Test`;
    const ast = parseAddingParents(code);
    const sourceCode = new SourceCode(code, ast);

    const comment = getFollowingComment(
      sourceCode,
      /** @type {import('eslint').Rule.Node} */ (
        /** @type {import('estree').VariableDeclaration} */
        (ast.body[0]).declarations[0]
      )
    );
    expect(comment?.type).to.equal('Line');
    expect(comment?.value).to.equal(' Test');
  });

  it('gets line comment after number variable declaration', function () {
    const code = `var a = 5; // Test`;
    const ast = parseAddingParents(code);
    const sourceCode = new SourceCode(code, ast);

    const comment = getFollowingComment(
      sourceCode,
      /** @type {import('eslint').Rule.Node} */ (
        ast.body[0]
      )
    );
    expect(comment?.type).to.equal('Line');
    expect(comment?.value).to.equal(' Test');
  });
  it('gets line comment after `TSPropertySignature`', function () {
    const code = `
      interface B {
        g: () => string; // Test
      }
    `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);

    const comment = getFollowingComment(
      sourceCode,
      /** @type {import('@typescript-eslint/types').TSESTree.Node} */ (
        /**
         * @type {import('@typescript-eslint/types').TSESTree.
        *   TSTypeAnnotation
        * }
        */
        (
        /**
        * @type {import('@typescript-eslint/types').TSESTree.
        *   TSPropertySignature
        * }
        */
          (
            /**
             * @type {import('@typescript-eslint/types').TSESTree.
             *   TSInterfaceDeclaration
             * }
             */ (
            /** @type {import('@typescript-eslint/types').TSESTree.Program} */
              (ast).body[0]
            ).body.body[0]
          ).typeAnnotation
        ).typeAnnotation
      )
    );
    expect(comment?.type).to.equal('Line');
    expect(comment?.value).to.equal(' Test');
  });
  it('gets line comment after `PropertyDefinition`', function () {
    const code = `
        class TestClass {
          public Test: (id: number) => string; // Test
        }
    `;
    const ast = parseAddingParents(code, undefined, {parser: 'typescript'});
    const sourceCode = new SourceCode(code, ast);

    const comment = getFollowingComment(
      sourceCode,
      /** @type {import('@typescript-eslint/types').TSESTree.Node} */ (
        /**
         * @type {import('@typescript-eslint/types').TSESTree.
         *   TSTypeAnnotation
         * }
         */
        (
        /**
         * @type {import('@typescript-eslint/types').TSESTree.
         *   PropertyDefinition}
         */ (
          /**
           * @type {import('@typescript-eslint/types').TSESTree.
           *   ClassDeclaration}
           */ (
              ast.body[0]
            ).body.body[0]
          ).typeAnnotation
        ).typeAnnotation
      )
    );
    expect(comment?.type).to.equal('Line');
    expect(comment?.value).to.equal(' Test');
  });
});

describe('getJSDocComment', function () {
  it(
    'Gets preceding siblings of exported FunctionDeclaration ' +
    'or TSDeclareFunction',
    function () {
      /* eslint-disable @stylistic/max-len -- Long */
      const code = `
        /**
         * Array map function with overload for NonEmptyArray
         * @example
         * const data = [{value: 'value'}] as const;
         * const result1: NonEmptyReadonlyArray<'value'> = arrayMap(data, (value) => value.value); // pick type from data
         * const result2: NonEmptyReadonlyArray<'value'> = arrayMap<'value', typeof data>(data, (value) => value.value); // enforce output type
         * @template Target - The type of the array to map to
         * @template Source - The type of the array to map from
         * @param {Source} data - The array to map
         * @param {MapCallback<Target, Source>} callback - Callback function to map data from the array
         * @returns {AnyArrayType<Target>} Mapped array
         * @since v0.2.0
         */
        export function arrayMap<Target, Source extends NonEmptyArray<unknown> | NonEmptyReadonlyArray<unknown>>(
          data: Source,
          callback: MapCallback<Target, Source>,
        ): NonEmptyArray<Target>;
        export function arrayMap<Target, Source extends Array<unknown>>(data: Source, callback: MapCallback<Target, Source>): Array<Target>;
        export function arrayMap<Target, Source extends AnyArrayType>(data: Source, callback: MapCallback<Target, Source>): AnyArrayType<Target> {
          return data.map(callback);
        }
      `;
      /* eslint-enable @stylistic/max-len -- Long */
      const ast = parseAddingParents(code, undefined, {parser: 'typescript'});

      const sourceCode = new SourceCode(code, ast);

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (ast.body.at(-1)),
        {
          minLines: 0, maxLines: 1
        },
        {
          checkOverloads: true
        }
      );
      expect(comment?.type).to.equal('Block');

      const comment2 = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (
          /**
           * @type {import('@typescript-eslint/types').
           *   TSESTree.ExportNamedDeclaration}
           */
          (ast.body.at(-2)).declaration
        ),
        {
          minLines: 0, maxLines: 1
        },
        {
          checkOverloads: true
        }
      );
      expect(comment2?.type).to.equal('Block');
    }
  );

  it(
    'Gets preceding siblings of FunctionDeclaration or TSDeclareFunction',
    function () {
      /* eslint-disable @stylistic/max-len -- Long */
      const code = `
        /**
         * Array map function with overload for NonEmptyArray
         * @example
         * const data = [{value: 'value'}] as const;
         * const result1: NonEmptyReadonlyArray<'value'> = arrayMap(data, (value) => value.value); // pick type from data
         * const result2: NonEmptyReadonlyArray<'value'> = arrayMap<'value', typeof data>(data, (value) => value.value); // enforce output type
         * @template Target - The type of the array to map to
         * @template Source - The type of the array to map from
         * @param {Source} data - The array to map
         * @param {MapCallback<Target, Source>} callback - Callback function to map data from the array
         * @returns {AnyArrayType<Target>} Mapped array
         * @since v0.2.0
         */
        function arrayMap<Target, Source extends NonEmptyArray<unknown> | NonEmptyReadonlyArray<unknown>>(
          data: Source,
          callback: MapCallback<Target, Source>,
        ): NonEmptyArray<Target>;
        function arrayMap<Target, Source extends Array<unknown>>(data: Source, callback: MapCallback<Target, Source>): Array<Target>;
        function arrayMap<Target, Source extends AnyArrayType>(data: Source, callback: MapCallback<Target, Source>): AnyArrayType<Target> {
          return data.map(callback);
        }
      `;
      /* eslint-enable @stylistic/max-len -- Long */
      const ast = parseAddingParents(code, undefined, {parser: 'typescript'});

      const sourceCode = new SourceCode(code, ast);

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (ast.body.at(-1)),
        {
          minLines: 0, maxLines: 1
        },
        {
          checkOverloads: true
        }
      );
      expect(comment?.type).to.equal('Block');
    }
  );

  it(
    'Returns `null` with `checkOverloads` and missing comment ',
    function () {
      const code = `
        const a = 5;
      `;
      const ast = parseAddingParents(code, undefined, {parser: 'typescript'});

      const sourceCode = new SourceCode(code, ast);

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (ast.body.at(-1)),
        {
          minLines: 0, maxLines: 1
        },
        {
          checkOverloads: true
        }
      );
      expect(comment).to.equal(null);
    }
  );

  it(
    'Gets function expression call\'s variable comment',
    function () {
      const code = `
        /**
         *
         */
        const foo = autolog(function foo() {
          log.debug('inside foo', 'this is a test helper function')
        })
      `;
      const ast = parseAddingParents(code);

      const sourceCode = new SourceCode(code, ast);

      const comment = getJSDocComment(
        sourceCode,
        /** @type {import('eslint').Rule.Node} */ (
          /** @type {import('estree').CallExpression} */
          (/** @type {import('estree').VariableDeclaration} */
            (ast.body.at(-1)).declarations[0].init).arguments[0]
        ),
        {
          minLines: 0, maxLines: 1,
          skipInvokedExpressionsForCommentFinding: true
        }
      );
      expect(comment?.type).to.equal('Block');
    }
  );
});
