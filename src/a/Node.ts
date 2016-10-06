import {ParameterType} from './FunctionDef';
import {TokenType, IToken} from './Tokenizer';

export interface TNode {
  type: TokenType;
  value: string;
  leftChild?: TNode;
  rightChild?: TNode;
  argumentType?: ParameterType;
  line?: number;
  from?: number;
  to?: number;
}

export class RootTNode implements TNode {
  constructor() {
    this.children = [];
  };
  type: TokenType = TokenType.block;
  value: string;
  children: TNode[];

  add(node: TNode) {
    this.children.push(node)
  }
}

export class FunctionTNode implements TNode {
  value: string;
  type: TokenType;
  line: number;
  from: number;
  to: number;
  constructor(token: IToken) {
    this.type = TokenType.keyword;
    this.value = token.value;
    this.line = token.line;
    this.from = token.startIndex;
    this.to = token.endIndex;
  }
}

export class BlockTNode implements TNode {
  type: TokenType;
  line: number;
  from: number;
  to: number;
  value: string;
  children: TNode[];
  constructor(token?: IToken) {
    this.type = TokenType.block;
    this.line = token && token.line || 0;
    this.from = token && token.startIndex || 0;
    this.to = token && token.endIndex || 0;
    this.children = [];
  };

  add(node: TNode) {
    this.children.push(node)
  }
}

export class ArgumentTNode implements TNode {
  argumentType: ParameterType;
  value: string;
  type: TokenType;
  line: number;
  from: number;
  to: number;
  constructor(token: IToken, argType: ParameterType) {
    this.type = TokenType.argument;
    this.argumentType = argType;
    this.value = token.value;
    this.line = token.line;
    this.from = token.startIndex;
    this.to = token.endIndex;
  }
}

export class OpenBracketTNode implements TNode {
  value: string;
  type: TokenType;
  line: number;
  from: number;
  to: number;
  constructor(token: IToken) {
    this.type = TokenType.squareBracketOpen;
    this.value = token.value;
    this.line = token.line;
    this.from = token.startIndex;
    this.to = token.endIndex;
  }
}

export class PlusMinusNode implements TNode {
  value: string;
  type: TokenType;
  line: number;
  from: number;
  to: number;
  constructor(token: IToken) {
    this.type = TokenType.plusminus;
    this.value = token.value;
    this.line = token.line;
    this.from = token.startIndex;
    this.to = token.endIndex;
  }
}

export class MultDivNode implements TNode {
  value: string;
  type: TokenType;
  line: number;
  from: number;
  to: number;
  constructor(token: IToken) {
    this.type = TokenType.multdiv;
    this.value = token.value;
    this.line = token.line;
    this.from = token.startIndex;
    this.to = token.endIndex;
  }
}