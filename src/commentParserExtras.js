/* eslint-disable prefer-object-spread, no-eq-null, no-shadow,
    jsdoc/require-jsdoc, jsdoc/require-param-type -- Just temporarily
    housing here */

export function isSpace (source) {
  return (/^\s+$/u).test(source);
}
export function splitSpace (source) {
  const matches = source.match(/^\s+/u);
  return matches == null
    ? ['', source]
    : [source.slice(0, matches[0].length), source.slice(matches[0].length)];
}
export function splitLines (source) {
  return source.split(/\n/u);
}
export function seedBlock (block = {}) {
  return Object.assign({
    description: '', tags: [], source: [], problems: []
  }, block);
}
export function seedSpec (spec = {}) {
  return Object.assign({
    tag: '', name: '', type: '', optional: false, description: '',
    problems: [], source: []
  }, spec);
}
export function seedTokens (tokens = {}) {
  return Object.assign({
    start: '', delimiter: '', postDelimiter: '', tag: '', postTag: '',
    name: '', postName: '', type: '', postType: '', description: '', end: ''
  }, tokens);
}
/**
 * Assures Block.tags[].source contains references to the Block.source items,
 * using Block.source as a source of truth. This is a counterpart of
 * rewireSpecs.
 * @param block parsed coments block
 */
export function rewireSource (block) {
  const source = block.source.reduce(
    (acc, line) => acc.set(line.number, line), new Map()
  );
  for (const spec of block.tags) {
    spec.source = spec.source.map((line) => source.get(line.number));
  }
  return block;
}
/**
 * Assures Block.source contains references to the Block.tags[].source items,
 * using Block.tags[].source as a source of truth. This is a counterpart
 * of rewireSource.
 * @param block parsed coments block
 */
export function rewireSpecs (block) {
  const source = block.tags.reduce((acc, spec) => spec.source.reduce(
    (acc, line) => acc.set(line.number, line), acc
  ), new Map());
  block.source = block.source.map((line) => source.get(line.number) || line);
  return block;
}
