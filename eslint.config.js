import ashNazg from 'eslint-config-ash-nazg';
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  {
    ignores: [
      'coverage',
      'docs',
      'dist',
      'html'
    ]
  },
  ...ashNazg(['sauron']),
  ...jsdoc.configs.examples,
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
