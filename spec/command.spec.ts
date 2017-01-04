import {TokenType} from '../src/a/Tokenizer';
import {ParserNew } from '../src/a/Parser';
import {Reporter} from '../src/a/Reporter';

describe('Parser', () => {
    let parser;

    beforeEach(() => {
        let reporter = new Reporter();
        parser = new ParserNew(reporter);
    });

    it('first node type musst be block type', () => {
        let input = [];

        let result = parser.parse(input);
        expect(result).not.toBeNull;
        expect(result.children).not.toBeNull;     
        expect(result.type).toBe(TokenType.block);   
        expect(result.children.length).toBe(0);        
    });

    it('argument node should be added as left child', () => {
        let input = [
            getTestCase('tl', TokenType.keyword),
            getTestCase('90', TokenType.number),
        ];

        let result = parser.parse(input);
        expect(result).not.toBeNull;
        expect(parser.reporter.errors).not.toBeNull; 
        expect(parser.reporter.errors.length).toBe(0); 
        
        expect(result.children).not.toBeNull;      
        expect(result.children.length).toBe(1);
        expect(result.children[0].leftChild).not.toBeNull;  
        expect(result.children[0].leftChild.type).toBe(TokenType.argument);          
    });

    it('block node should be added as right child', () => {
        let input = [
            getTestCase('r', TokenType.keyword),
            getTestCase('90', TokenType.number),
            getTestCase('[', TokenType.squareBracketOpen),
            getTestCase('tl', TokenType.keyword),
            getTestCase(']', TokenType.squareBracketClose),
        ];
        
        let result = parser.parse(input);
        expect(result).not.toBeNull;
        expect(parser.reporter.errors).not.toBeNull; 
        expect(parser.reporter.errors.length).toBe(0); 
        
        expect(result.children).not.toBeNull;      
        expect(result.children.length).toBe(1);
        expect(result.children[0].rightChild).not.toBeNull;  
        expect(result.children[0].rightChild.type).toBe(TokenType.block);          
    });

    it('first parsed token musst be an expression error', () => {
        let input = [
                getTestCase('90', TokenType.number),
            ];

        let result = parser.parse(input);
        expect(result.children.length).toBe(0);
        expect(parser.reporter.errors).not.toBeNull; 
        expect(parser.reporter.errors.length).toBe(1);        
    });

    it('missing close bracket error', () => {
        let input = [
            getTestCase('r', TokenType.keyword),
            getTestCase('90', TokenType.number),
            getTestCase('[', TokenType.squareBracketOpen),
            getTestCase('tl', TokenType.keyword),
        ];

        let result = parser.parse(input);
        expect(result.children.length).toBe(1);
        expect(parser.reporter.errors).not.toBeNull; 
        expect(parser.reporter.errors.length).toBe(1);        
    });

    it('more arguments error', () => {
        let input = [
            getTestCase('r', TokenType.keyword),
            getTestCase('90', TokenType.number),
            getTestCase('90', TokenType.number),
        ];

        let result = parser.parse(input);
        expect(result.children.length).toBe(1);
        expect(parser.reporter.errors).not.toBeNull; 
        expect(parser.reporter.errors.length).toBe(1);        
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
