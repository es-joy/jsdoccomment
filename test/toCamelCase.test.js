import {toCamelCase} from '../src/index.js';

describe('toCamelCase', function () {
  it('work with underscores', function () {
    expect(toCamelCase('test_one')).to.equal('TestOne');
  });
});
