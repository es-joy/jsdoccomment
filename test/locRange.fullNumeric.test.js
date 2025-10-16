import {parseComment} from '../src/index.js';
import {commentParserToESTree} from '../src/commentParserToESTree.js';

describe('loc/range full numeric assertions', () => {
  it('full numeric positions for @type {string}', () => {
    const parsed = parseComment({value: `* @type {string}`});
    const ast = commentParserToESTree(
      parsed,
      'jsdoc',
      {loc: true, range: true}
    );

    // work with a plain clone so we can assert numeric values without
    // type-system interference
    // clone here to produce a plain object for assertions
    // eslint-disable-next-line unicorn/prefer-structured-clone -- use JSON
    const snap = JSON.parse(JSON.stringify(ast));

    // block
    expect(snap.range).to.eql([0, 20]);
    if (!snap.loc) {
      throw new Error('ast.loc missing');
    }
    expect(snap.loc.start).to.eql({line: 1, column: 0});
    expect(snap.loc.end).to.eql({line: 2, column: 20});

    // tag
    if (!snap.tags || !snap.tags[0]) {
      throw new Error('tag missing');
    }
    const tag = snap.tags[0];
    expect(tag.range).to.eql([0, 20]);
    if (!tag.loc) {
      throw new Error('tag.loc missing');
    }
    expect(tag.loc.start).to.eql({line: 1, column: 0});
    expect(tag.loc.end).to.eql({line: 1, column: 20});

    // typeLine
    if (!tag.typeLines || !tag.typeLines[0]) {
      throw new Error('typeLine missing');
    }
    const tl = tag.typeLines[0];
    expect(tl.range).to.eql([0, 20]);
    if (!tl.loc) {
      throw new Error('typeLine.loc missing');
    }
    expect(tl.loc.start).to.eql({line: 1, column: 0});
    expect(tl.loc.end).to.eql({line: 1, column: 20});

    // parsedType
    if (!tag.parsedType) {
      throw new Error('parsedType missing');
    }
    expect(tag.parsedType.range).to.eql([11, 17]);
    if (!tag.parsedType.loc) {
      throw new Error('parsedType.loc missing');
    }
    expect(tag.parsedType.loc.start).to.eql({line: 1, column: 11});
    expect(tag.parsedType.loc.end).to.eql({line: 1, column: 17});
  });

  it('full numeric positions for inline tag block', () => {
    const parsed = parseComment({value: `* Inline {@link http://example.com}`});
    const ast = commentParserToESTree(
      parsed,
      'jsdoc',
      {loc: true, range: true}
    );
    // clone here to produce a plain object for assertions
    // eslint-disable-next-line unicorn/prefer-structured-clone -- use JSON
    const snap2 = JSON.parse(JSON.stringify(ast));

    expect(snap2.range).to.eql([0, 39]);
    if (!snap2.loc) {
      throw new Error('ast.loc missing');
    }
    expect(snap2.loc.start).to.eql({line: 1, column: 0});
    expect(snap2.loc.end).to.eql({line: 2, column: 39});

    if (!snap2.inlineTags || !snap2.inlineTags[0]) {
      throw new Error('inlineTag missing');
    }
    const inline = snap2.inlineTags[0];
    expect(inline.range).to.eql([0, 39]);
    if (!inline.loc) {
      throw new Error('inline.loc missing');
    }
    expect(inline.loc.start).to.eql({line: 1, column: 0});
    expect(inline.loc.end).to.eql({line: 1, column: 39});
  });
});
