import {parseComment} from '../src/index.js';

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
                lineEnd: '',
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
            lineEnd: '',
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

  it('Handle @template with commas and description', function () {
    const parsed = parseComment({
      value: `* @template SomeName, AnotherName - Some description`
    });
    expect(parsed).to.deep.equal({
      description: '',
      tags: [
        {
          tag: 'template',
          name: 'SomeName, AnotherName',
          type: '',
          optional: false,
          description: '- Some description',
          problems: [],
          source: [
            {
              number: 0,
              source: '/** @template SomeName, ' +
                        'AnotherName - Some description*/',
              tokens: {
                delimiter: '/**',
                description: '- Some description',
                end: '*/',
                lineEnd: '',
                name: 'SomeName, AnotherName',
                postDelimiter: ' ',
                postName: ' ',
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
          source: '/** @template SomeName, AnotherName - Some description*/',
          tokens: {
            delimiter: '/**',
            description: '- Some description',
            end: '*/',
            lineEnd: '',
            name: 'SomeName, AnotherName',
            postDelimiter: ' ',
            postName: ' ',
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

  it('Handle simple no-type tag (@see)', function () {
    const parsed = parseComment({value: `* @see SomeName`});
    expect(parsed).to.deep.equal({
      description: '',
      tags: [
        {
          tag: 'see',
          name: 'SomeName',
          type: '',
          optional: false,
          description: '',
          problems: [],
          source: [
            {
              number: 0,
              source: '/** @see SomeName*/',
              tokens: {
                delimiter: '/**',
                description: '',
                end: '*/',
                lineEnd: '',
                name: 'SomeName',
                postDelimiter: ' ',
                postName: '',
                postTag: ' ',
                postType: '',
                start: '',
                tag: '@see',
                type: ''
              }
            }
          ]
        }
      ],
      source: [
        {
          number: 0,
          source: '/** @see SomeName*/',
          tokens: {
            delimiter: '/**',
            description: '',
            end: '*/',
            lineEnd: '',
            name: 'SomeName',
            postDelimiter: ' ',
            postName: '',
            postTag: ' ',
            postType: '',
            start: '',
            tag: '@see',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Handle simple no-name tag (@author)', function () {
    const parsed = parseComment({value: `* @author SomeName`});
    expect(parsed).to.deep.equal({
      description: '',
      tags: [
        {
          tag: 'author',
          name: '',
          type: '',
          optional: false,
          description: 'SomeName',
          problems: [],
          source: [
            {
              number: 0,
              source: '/** @author SomeName*/',
              tokens: {
                delimiter: '/**',
                description: 'SomeName',
                end: '*/',
                lineEnd: '',
                name: '',
                postDelimiter: ' ',
                postName: '',
                postTag: ' ',
                postType: '',
                start: '',
                tag: '@author',
                type: ''
              }
            }
          ]
        }
      ],
      source: [
        {
          number: 0,
          source: '/** @author SomeName*/',
          tokens: {
            delimiter: '/**',
            description: 'SomeName',
            end: '*/',
            lineEnd: '',
            name: '',
            postDelimiter: ' ',
            postName: '',
            postTag: ' ',
            postType: '',
            start: '',
            tag: '@author',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Default to simple empty block (comment-parser issue #128)', function () {
    const parsed = parseComment({value: `* `});
    expect(parsed).to.deep.equal({
      description: '',
      tags: [],
      source: [
        {
          number: 0,
          tokens: {
            delimiter: '/**',
            description: '',
            end: '',
            lineEnd: '',
            name: '',
            postDelimiter: '',
            postName: '',
            postTag: '',
            postType: '',
            start: '',
            tag: '',
            type: ''
          }
        },
        {
          number: 1,
          tokens: {
            delimiter: '',
            description: '',
            end: '*/',
            lineEnd: '',
            name: '',
            postDelimiter: '',
            postName: '',
            postTag: '',
            postType: '',
            start: ' ',
            tag: '',
            type: ''
          }
        }
      ],
      problems: []
    });
  });
});
