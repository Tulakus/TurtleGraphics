import {definitions, IDefinition, ParameterType} from './FunctionDef';
import {FunctionTNode, ArgumentTNode, OpenBracketTNode, BlockTNode, RootTNode, TNode} from './Node';
import {TokenType, IToken} from './Tokenizer';
import {Reporter, IError} from './Reporter';

export class Dispatcher {
  constructor(reporter: Reporter) {
    this.reporter = reporter;
  };
  private reporter: Reporter;
  dispatch(node: BlockTNode) {
    if (node.children.length == 0){
      this.reporter.reportError(0, 0, 0, 'Incorrectly parsed command or empty command');
      return;
    }

    for (var i = 0; i <= node.children.length - 1; i++) {
      let n = node.children[i];
      if (n.type !== TokenType.keyword)
        continue

      let def = this.getDefinition(n.value);
      if (def.areBothChildrenAllowed == false && n.leftChild != null && n.rightChild != null)
        this.reportError(n, "Incorrect parameters - this function has allowed " + this.convertEnumToString(def.expectedTypeParameter) + " parameter.");
      if (def.expectedTypeParameter == ParameterType.noParameter && n.leftChild != null)
        this.reportError(n, "Incorrect parameter type - expected no parameter but found " + this.convertEnumToString(n.leftChild.argumentType));
      if (def.expectedTypeParameter == ParameterType.noParameter && n.rightChild != null)
        this.reportError(n, this.buildError("no", "function block definition"));
      if (def.expectedTypeParameter != ParameterType.noParameter && n.leftChild == null && n.rightChild == null)
        this.reportError(n, this.buildError(this.convertEnumToString(def.expectedTypeParameter), "no parameter"));
      if (def.expectedTypeParameter != ParameterType.noParameter && n.leftChild != null && n.leftChild.argumentType != def.expectedTypeParameter)
        this.reportError(n, this.buildError(this.convertEnumToString(def.expectedTypeParameter), this.convertEnumToString(n.leftChild.argumentType)));
      
      if (n.rightChild != null)
        this.dispatch(<BlockTNode>n.rightChild);
    }
  }

  private getDefinition(command: string): IDefinition {
    let definition: IDefinition;
    for (let i = 0; i < definitions.length; i++) {
      if (definitions[i].name === command) {
        definition = definitions[i];
        break;
      }
    }
    return definition;
  }

  private convertEnumToString(type: ParameterType): string {
    switch(type){
      case ParameterType.color:
        return "Color";
      case ParameterType.number:
        return "Number";
      case ParameterType.string:
        return "String";
      case ParameterType.noParameter:
        return "No";
      default:
        return "Unknown type";
    }
  }
  
  private buildError(expected: string, found: string): string{
    return "Incorrect parameter type - expected "+ expected + " parameter but found " + found;
  }
  private reportError(n: any, errorMsg: string){
    this.reporter.reportError(n.line, n.from, n.to,errorMsg);
  }
}
