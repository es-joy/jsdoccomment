import {parseComment} from '../src/index.js';
import {commentParserToESTree} from '../src/commentParserToESTree.js';

describe('loc/range attachments', () => {
  it(
    'attaches loc and range to tag, typeLine and parsedType when requested',
    () => {
      const parsed = parseComment({value: `* @type {string}`});
      const ast = commentParserToESTree(parsed, 'jsdoc', {
        loc: true,
        range: true
      });

      const tag = ast.tags[0];
      // tag-level
      expect(tag).to.have.property('range').that.is.an('array');
      expect(tag).to.have.property('loc').that.is.an('object');

      // typeLine
      const tl = tag.typeLines[0];
      expect(tl).to.have.property('range').that.is.an('array');
      expect(tl).to.have.property('loc').that.is.an('object');

      // parsedType
      expect(tag.parsedType).to.be.an('object');
      expect(tag.parsedType).to.have.property('range').that.is.an('array');
      expect(tag.parsedType).to.have.property('loc').that.is.an('object');

      // numeric assertions via a JSON clone to avoid type-checker errors
      // clone for a plain object
      // eslint-disable-next-line unicorn/prefer-structured-clone -- use JSON
      const snap = JSON.parse(JSON.stringify(ast));
      // block
      expect(snap.range).to.eql([0, 20]);
      expect(snap.loc.end).to.eql({line: 2, column: 20});

      // tag and typeLine (first tag)
      expect(snap.tags[0].range).to.eql([0, 20]);
      expect(snap.tags[0].loc.start).to.eql({line: 1, column: 0});
      expect(snap.tags[0].typeLines[0].range).to.eql([0, 20]);

      // parsedType numeric checks
      expect(snap.tags[0].parsedType.range).to.eql([11, 17]);
      expect(snap.tags[0].parsedType.loc.start).to.eql({line: 1, column: 11});
    }
  );

  it('attaches loc and range to inline tags in block and in tags', () => {
    const parsed = parseComment({
      value: `* Inline {@link http://example.com}`
    });
    const ast = commentParserToESTree(
      parsed,
      'jsdoc',
      {loc: true, range: true}
    );

    expect(ast.inlineTags).to.have.length.greaterThan(0);
    const inlineTagNode = ast.inlineTags[0];
    expect(inlineTagNode).to.have.property('range').that.is.an('array');
    expect(inlineTagNode).to.have.property('loc').that.is.an('object');
    // numeric assertion for inline tag range (guarded)
    if (!inlineTagNode) {
      throw new Error('inlineTagNode missing');
    }
    // eslint-disable-next-line unicorn/prefer-structured-clone -- use JSON
    const inlineSnap = JSON.parse(JSON.stringify(inlineTagNode));
    if (!inlineSnap.range) {
      throw new Error('inlineTagNode.range missing');
    }
    expect(inlineSnap.range).to.eql([0, 39]);
  });
});
