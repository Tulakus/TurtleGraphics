import {ParameterType} from './FunctionDef';
import {TokenType, IToken} from './Tokenizer';

export interface ITNode {
  type: TokenType;
  value: string;
  leftChild?: ITNode;
  rightChild?: ITNode;
  argumentType?: ParameterType;
  line?: number;
  from?: number;
  to?: number;
}

export class RootTNode implements ITNode {
  constructor() {
    this.children = [];
  };
  type: TokenType = TokenType.block;
  value: string;
  children: ITNode[];

  add(node: ITNode) {
    this.children.push(node)
  }
}

export class FunctionTNode implements ITNode {
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

export class BlockTNode implements ITNode {
  type: TokenType;
  line: number;
  from: number;
  to: number;
  value: string;
  children: ITNode[];
  constructor(token?: IToken) {
    this.type = TokenType.block;
    this.line = token && token.line || 0;
    this.from = token && token.startIndex || 0;
    this.to = token && token.endIndex || 0;
    this.children = [];
  };

  add(node: ITNode) {
    this.children.push(node);
  }
}

export class ArgumentTNode implements ITNode {
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

export class OpenBracketTNode implements ITNode {
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

export class PlusMinusNode implements ITNode {
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

export class MultDivNode implements ITNode {
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