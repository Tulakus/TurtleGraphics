import {TokenType} from '../src/a/Tokenizer';
import {Dispatcher } from '../src/a/Dispatcher';
import {Reporter} from '../src/a/Reporter';
import {FunctionTNode, ArgumentTNode, BlockTNode} from '../src/a/Node';
import {ParameterType} from '../src/a/FunctionDef';

describe('Dispatcher', () => {
    let dispatcher;
    let input: BlockTNode;

    beforeEach(() => {
        let reporter = new Reporter();
        dispatcher = new Dispatcher(reporter);

        input = new BlockTNode();
    });

    it('Nodes correctly dispatched', () => {
        input.add(new FunctionTNode(createNode('tr', TokenType.keyword)));
        input.children[0].leftChild = new ArgumentTNode(createNode('90', TokenType.argument), ParameterType.number);

        dispatcher.dispatch(input);
        expect(dispatcher.reporter.errors.length).toBe(0);
  
    });

    it('Block node correctly dispatched', () => {
        input.add(new FunctionTNode(createNode('r', TokenType.keyword)));
        input.children[0].leftChild = new ArgumentTNode(createNode('90', TokenType.argument), ParameterType.number);
        
        let block = new BlockTNode(createNode('', TokenType.block));
        block.add(new FunctionTNode(createNode('fw', TokenType.keyword)));
        block.children[0].leftChild = new ArgumentTNode(createNode('90', TokenType.argument), ParameterType.number);
        input.children[0].rightChild = block;

        dispatcher.dispatch(input);
        expect(dispatcher.reporter.errors.length).toBe(0);  
    });

    it('Incorrect parameter type error', () => {
        input.add(new FunctionTNode(createNode('tr', TokenType.keyword)));
        input.children[0].leftChild = new ArgumentTNode(createNode('incorrect', TokenType.colors), ParameterType.color);

        let result = dispatcher.dispatch(input);
        expect(result).toBeUndefined;
        expect(dispatcher.reporter.errors).not.toBeNull; 
        expect(dispatcher.reporter.errors.length).toBe(1);
        expect(dispatcher.reporter.errors[0].message).toContain(
            'Incorrect parameter type - expected Number parameter but found Color'
        );        
    });

    it('Expected no parameter error', () => {
        input.add(new FunctionTNode(createNode('pu', TokenType.keyword)));
        input.children[0].leftChild = new ArgumentTNode(createNode('incorrect', TokenType.colors), ParameterType.color);

        let result = dispatcher.dispatch(input);
        expect(result).toBeUndefined;
        expect(dispatcher.reporter.errors).not.toBeNull; 
        expect(dispatcher.reporter.errors.length).toBe(1);
        expect(dispatcher.reporter.errors[0].message).toContain(
            'Incorrect parameter type - expected no parameter but found Color'
        );        
    });

    it('Command expected no block parameter error', () => {
        input.add(new FunctionTNode(createNode('pu', TokenType.keyword)));
        input.children[0].rightChild = new BlockTNode(createNode('', TokenType.block));

        let result = dispatcher.dispatch(input);
        expect(result).toBeUndefined;
        expect(dispatcher.reporter.errors).not.toBeNull; 
        expect(dispatcher.reporter.errors.length).toBe(1);
        expect(dispatcher.reporter.errors[0].message).toContain(
            'Incorrect parameter type - expected no parameter but found function block definition'
        );        
    });

    it('No parameter error', () => {
        input.add(new FunctionTNode(createNode('tl', TokenType.keyword)));

        let result = dispatcher.dispatch(input);
        expect(result).toBeUndefined;
        expect(dispatcher.reporter.errors).not.toBeNull; 
        expect(dispatcher.reporter.errors.length).toBe(1);
        expect(dispatcher.reporter.errors[0].message).toContain(
            'Incorrect parameter type - expected Number parameter but found no parameter'
        );        
    });

    function createNode(value: string, type: TokenType) {
        return {
                value: value,
                type: type,
                startIndex: 0, 
                endIndex: value.length,
                line: 0
        };
    }
});