import {TokenType, IToken} from './Tokenizer';
import {FunctionTNode, ArgumentTNode, BlockTNode, ITNode} from './Node';
import {ParameterType} from './FunctionDef';
import {Reporter} from './Reporter';

export class ParserNew {
  constructor(reporter: Reporter) {
    this.reporter = reporter;
  };

  private tokenArray: IToken[];
  private token: IToken;
  private currentNode: ITNode;
  private currentBlockNode: BlockTNode;
  private blockStack: BlockTNode[];
  private reporter: Reporter;

  parse(tokenArray: IToken[]): BlockTNode {
    this.blockStack = [];
    this.tokenArray = tokenArray;
    this.currentBlockNode = new BlockTNode();
    this.addNodeToStack(this.blockStack, this.currentBlockNode)
    this.getNext();
    this.expression();
    
    if (this.token.type !== TokenType.epsilon) {
      this.reporter.reportError(
        this.token.line,
        this.token.startIndex,
        this.token.endIndex,
        'Expected an expression or parameter but found ' + this.token.value
      );
    }

    return this.currentBlockNode;
  }

  private addChild(node: ITNode): void {
    if (node === null)
      this.reporter.reportError(0, 0, 0, 'Parse error');

    if (node.type === TokenType.block) {
      this.addNodeToStack(this.blockStack, node);
      this.currentBlockNode = <BlockTNode>node;
      this.currentNode.rightChild = this.currentBlockNode;
      this.currentNode = this.currentBlockNode;
    }

    if (node.type === TokenType.keyword) {
      this.currentNode = node;
      this.currentBlockNode.add(node);
    }

    if (this.currentNode.type === TokenType.keyword && node.type === TokenType.argument) 
      this.currentNode.leftChild = node;
  }

  private addNodeToStack(stack: ITNode[], node: ITNode) {
    stack.push(node);
  }

  /*private removeNodeFromStack(stack: ITNode[]): ITNode {
    return stack.pop();
  }*/

  private getFirstFromStack(stack: ITNode[]): ITNode {
    return stack[stack.length - 1];
  }

  private removeBracket() {
    this.blockStack.pop();
  }


  private expression() {
    if(this.token.type === TokenType.epsilon)
      return;
    this.funct();
  }

  private funct() {
    if (this.token.type === TokenType.keyword) {
      this.addChild(new FunctionTNode(this.token));
      this.getNext();
      this.arg();
      this.expression();
    }
  }

  private arg() {
    if (this.token.type === TokenType.number || this.token.type === TokenType.colors) {
      this.addChild(new ArgumentTNode(this.token, this.mapEnumTokenTypeToParametrType(this.token.type)));
      this.getNext();
      this.bracket();
      this.expression();
    }
  }
  
  private bracket() {
    if (this.token.type === TokenType.squareBracketOpen) {
      let node = new BlockTNode(this.token);
      this.addChild(node);
      this.getNext();
      this.expression();
      let tokenType = <TokenType>this.token.type;
      if (this.tokenArray.length === 0 && tokenType !== TokenType.squareBracketClose) {
        this.reporter.reportError(node.line, node.from, node.to, 'Close bracket expected, but found ' + this.token.value);
        return;
      }
        
      if (tokenType !== TokenType.squareBracketClose) {
        this.reporter.reportError(
          this.token.line,
          this.token.startIndex,
          this.token.endIndex,
          'Expected an expression but found ' + this.token.value
        );
        return;
      }

      if (tokenType === TokenType.squareBracketClose) {
        this.removeBracket();
        this.currentBlockNode = <BlockTNode>this.getFirstFromStack(this.blockStack)
      }
      this.getNext();
    }
  }

  private getNext() {
    if (this.tokenArray.length >= 1) {
      this.token = this.tokenArray.shift();
    } else {
      this.token = { value: '', type: TokenType.epsilon };
    }
  }

  private mapEnumTokenTypeToParametrType(type: TokenType): ParameterType {
    switch (type) {
      case TokenType.number:
        return ParameterType.number;
      case TokenType.colors:
        return ParameterType.color;
      default:
        return  ParameterType.noParameter;
    }
  }
}