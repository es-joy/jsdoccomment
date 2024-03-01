import {toCamelCase} from '../src/toCamelCase.js';

describe('toCamelCase', function () {
  it('work with underscores', function () {
    expect(toCamelCase('test_one')).to.equal('TestOne');
  });
});
