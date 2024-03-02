import {
  commentHandler,
  parseComment
} from '../src/index.js';

describe('commentHandler', function () {
  it('Returns `true` with match', function () {
    const handler = commentHandler({
      mode: 'typescript'
    });

    const parsed = parseComment({
      value: `* @property opt_a
 * @param {Bar|Foo} opt_b
`
    });

    const result = handler(
      'JSDocBlock:has(JSDocTag[tag="param"][name=/opt_/] > ' +
      'JSDocTypeUnion:has(JsdocTypeName[value="Bar"]:nth-child(1)))',
      parsed
    );

    expect(result).to.equal(true);
  });

  it('Returns `false` when no match present', function () {
    const handler = commentHandler({
      mode: 'typescript'
    });

    const parsed = parseComment({
      value: `* @property opt_a
 * @param {Foo|Bar} opt_b
`
    });

    const result = handler(
      'JSDocBlock:has(JSDocTag[tag="param"][name=/opt_/] > ' +
      'JSDocTypeUnion:has(JsdocTypeName[value="Bar"]:nth-child(1)))',
      parsed
    );

    expect(result).to.equal(false);
  });
});
