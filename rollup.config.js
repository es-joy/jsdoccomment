import babel from '@rollup/plugin-babel';

/**
 * @external RollupConfig
 * @type {PlainObject}
 * @see {@link https://rollupjs.org/guide/en#big-list-of-options}
 */

/**
 * @param {PlainObject} config
 * @param {string} config.input
 * @param {string} [config.format="umd"]
 * @param {boolean} [config.minifying=false]
 * @returns {external:RollupConfig}
 */
function getRollupObject ({input, minifying, format = 'umd'} = {}) {
  const nonMinified = {
    input: `src/${input}`,
    external: [
      'esquery', 'jsdoc-type-pratt-parser', 'comment-parser',
      'comment-parser/util'
    ],
    output: {
      name: 'JsdocComment',
      format,
      sourcemap: minifying,
      file: `dist/${input.replace(/\.js$/u, `.${format}`)}${
        minifying ? '.min' : ''
      }.${format === 'cjs' || format === 'umd' ? 'c' : ''}js`
    },
    plugins: [
      babel({
        babelHelpers: 'bundled'
      })
    ]
  };
  /*
  if (minifying) {
    nonMinified.plugins.push(terser());
  }
  */
  return nonMinified;
}

export default [
  getRollupObject({
    input: 'index.js', format: 'cjs'
  })
];
