import ashNazg from 'eslint-config-ash-nazg';
import jsdocDecl from 'eslint-plugin-jsdoc';

export default [
  {
    ignores: [
      'coverage',
      'docs',
      'dist',
      'html',
      'demo/vendor'
    ]
  },
  ...ashNazg(['sauron']),
  ...jsdocDecl.configs.examples,
  {
    rules: {
      'unicorn/no-incorrect-template-string-interpolation': 'off',

      // Until ash-nazg fixes
      'import-x/namespace': 0,
      'import-x/no-deprecated': 0,
      'import-x/default': 0,
      'import-x/named': 0,
      'import-x/no-named-as-default': 0,
      'import-x/no-named-as-default-member': 0
    }
  },
  // {
  //   files: ['**/*.md/*.js'],
  //   rules: {
  //     // Enable or disable rules for `@example` JavaScript here
  //   }
  // },
  {
    files: ['test/**'],
    languageOptions: {
      globals: {
        // Not chai
        expect: 'readonly'
      }
    },
    rules: {
      'sonarjs/no-empty-test-file': 'off'
    }
  },
  {
    rules: {
      // https://github.com/benmosher/eslint-plugin-import/issues/1868
      'import/no-unresolved': 'off',

      // https://github.com/gajus/eslint-plugin-jsdoc/issues/1114
      'jsdoc/imports-as-dependencies': 'off'
    }
  }
];
