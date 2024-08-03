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
    }
  },
  {
    rules: {
      // https://github.com/benmosher/eslint-plugin-import/issues/1868
      'import/no-unresolved': 'off'
    }
  }
];
