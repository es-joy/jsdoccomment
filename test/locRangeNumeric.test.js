import {parseComment} from '../src/index.js';
import {commentParserToESTree} from '../src/commentParserToESTree.js';

describe('loc/range numeric assertions', () => {
  it('parsed type and block ranges are numeric and stable', () => {
    const parsed = parseComment({value: `* @type {string}`});
    const ast = commentParserToESTree(
      parsed,
      'jsdoc',
      {loc: true, range: true}
    );

    // block-level
    expect(ast.range).to.eql([0, 20]);
    if (!ast.loc) {
      throw new Error('ast.loc missing');
    }
    expect(ast.loc.end).to.eql({line: 2, column: 20});

    // parsed type
    if (!ast.tags || !ast.tags[0] || !ast.tags[0].parsedType) {
      throw new Error('parsedType missing');
    }
    const {parsedType} = ast.tags[0];
    expect(parsedType.range).to.eql([11, 17]);
    if (!parsedType.loc) {
      throw new Error('parsedType.loc missing');
    }
    expect(parsedType.loc.start).to.eql({line: 1, column: 11});
    expect(parsedType.loc.end).to.eql({line: 1, column: 17});
  });
});
