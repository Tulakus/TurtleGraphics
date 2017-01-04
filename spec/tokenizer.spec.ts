import {Tokenizer, TokenType, } from '../src/a/Tokenizer';
import {Reporter} from '../src/a/Reporter';

describe('Tokenizer', () => {
    let tokenizer;

    beforeEach(() => {
        let reporter = new Reporter();
        tokenizer = new Tokenizer(reporter);
    });

    let testCases = [
        {value: '120', type: TokenType.number},
        {value: '120.222', type: TokenType.number},
        {value: '0.222', type: TokenType.number},
        {value: '.55', type: TokenType.unknown},
        {value: '004', type: TokenType.unknown},
        {value: 'tl', type: TokenType.keyword},
        {value: 'TL', type: TokenType.unknown},
        {value: 'tL', type: TokenType.unknown},
        {value: 'Red', type: TokenType.colors},
        {value: 'red', type: TokenType.unknown},
        {value: '[', type: TokenType.squareBracketOpen},
        {value: ']', type: TokenType.squareBracketClose},
    ];
    
    for (let i = 0; i < testCases.length; i++) {
        it('parse input text ' + testCases[i].value + ' as token type ' + TokenType[testCases[i].type], () => {
            let result = tokenizer.tokenize(testCases[i].value);

            expect(result).not.toBeUndefined();
            expect(result).toContain(getTestCase(testCases[i].value, testCases[i].type));
        });
    }

    it('parse multiline content', () => {
        let result = tokenizer.tokenize('tr \n 2');
        expect(result.length).toBe(2);
        expect(result).toContain({
            value: 'tr',
            type: TokenType.keyword,
            startIndex: 0, 
            endIndex: 2,
            line: 0
        });
        expect(result).toContain({
            value: '2',
            type: TokenType.number,
            startIndex: 1, 
            endIndex: 2,
            line: 1
        });
    });

    it('should ignore whitespace characters', () => {
        let result = tokenizer.tokenize('tr 2');
        expect(result.length).toBe(2);
        expect(result).toContain({
            value: 'tr',
            type: TokenType.keyword,
            startIndex: 0, 
            endIndex: 2,
            line: 0
        });
        expect(result).toContain({
            value: '2',
            type: TokenType.number,
            startIndex: 3, 
            endIndex: 4,
            line: 0
        });
    });
});

function getTestCase(input: string, type: TokenType) {
    return {
            value: input,
            type: type,
            startIndex: 0, 
            endIndex: input.length,
            line: 0
        };
}
