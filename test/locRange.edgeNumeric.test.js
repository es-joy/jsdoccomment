import {parseComment} from '../src/index.js';
import {commentParserToESTree} from '../src/commentParserToESTree.js';

/** Edge-case fixtures for union and inline-tag position checks. */
describe('loc/range edge cases', () => {
  it('union and optional types produce numeric parsedType ranges', () => {
    const parsed = parseComment({
      value: `* @type {(string|number)=}`
    });
    const ast = commentParserToESTree(
      parsed,
      'jsdoc',
      {loc: true, range: true}
    );

    // eslint-disable-next-line unicorn/prefer-structured-clone -- JSON clone
    const snap = JSON.parse(JSON.stringify(ast));

    if (!snap.tags || !snap.tags[0]) {
      throw new Error('tag missing');
    }
    const tag = snap.tags[0];
    if (!tag.parsedType) {
      throw new Error('parsedType missing');
    }
    expect(Array.isArray(tag.parsedType.range)).to.equal(true);

    // parsed type start < end
    expect(tag.parsedType.range[0]).to.be.lessThan(
      tag.parsedType.range[1]
    );
    expect(typeof tag.parsedType.loc.start.line).to.equal('number');
    expect(typeof tag.parsedType.loc.end.line).to.equal('number');
  });

  it('multiple inline tags across lines have numeric ranges', () => {
    const parsed = parseComment({
      value:
        '* First {@link http://a.com} line\n* Second {@link http://b.com} line'
    });
    const ast = commentParserToESTree(parsed, 'jsdoc', {
      loc: true,
      range: true
    });

    // eslint-disable-next-line unicorn/prefer-structured-clone -- JSON clone
    const snap = JSON.parse(JSON.stringify(ast));

    if (!snap.inlineTags || snap.inlineTags.length < 2) {
      throw new Error('expected two inline tags');
    }
    const a = snap.inlineTags[0];
    const b = snap.inlineTags[1];
    if (!snap.range) {
      throw new Error('block.range missing');
    }

    [a, b].forEach((node) => {
      if (!node.range) {
        throw new Error('inline.range missing');
      }
      expect(node.range[0]).to.be.at.least(snap.range[0]);
      expect(node.range[1]).to.be.at.most(snap.range[1]);
      expect(node.range[0]).to.be.lessThan(node.range[1]);
      expect(typeof node.loc.start.line).to.equal('number');
    });
  });
});
