// Todo: Set for src file when can import from `comment-parser`
import {parseComment} from '../dist/index.cjs.cjs';

describe('parseComment', function () {
  it('Handle simple @template', function () {
    const parsed = parseComment({value: `* @template SomeName`});
    expect(parsed).to.deep.equal({
      description: '',
      tags: [
        {
          tag: 'template',
          name: 'SomeName',
          type: '',
          optional: false,
          description: '',
          problems: [],
          source: [
            {
              number: 0,
              source: '/** @template SomeName*/',
              tokens: {
                delimiter: '/**',
                description: '',
                end: '*/',
                name: 'SomeName',
                postDelimiter: ' ',
                postName: '',
                postTag: ' ',
                postType: '',
                start: '',
                tag: '@template',
                type: ''
              }
            }
          ]
        }
      ],
      source: [
        {
          number: 0,
          source: '/** @template SomeName*/',
          tokens: {
            delimiter: '/**',
            description: '',
            end: '*/',
            name: 'SomeName',
            postDelimiter: ' ',
            postName: '',
            postTag: ' ',
            postType: '',
            start: '',
            tag: '@template',
            type: ''
          }
        }
      ],
      problems: []
    });
  });
});
