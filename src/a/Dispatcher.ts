import {definitions, IDefinition, ParameterType} from './FunctionDef';
import { BlockTNode} from './Node';
import {TokenType} from './Tokenizer';
import {Reporter} from './Reporter';

export class Dispatcher {
  constructor(reporter: Reporter) {
    this.reporter = reporter;
  };

  private reporter: Reporter;

dispatch(node: BlockTNode) {
    if (node.children.length === 0) {
      this.reporter.reportError(0, 0, 0, 'Incorrectly parsed command or empty command');
      return;
    }

    for (var i = 0; i <= node.children.length - 1; i++) {
      let n = node.children[i];
      if (n.type !== TokenType.keyword)
        continue;

      let def = this.getDefinition(n.value); 
      if (def.areBothChildrenAllowed === false && n.leftChild && n.leftChild !== null && n.rightChild && n.rightChild !== null){
        this.reportError(n, 'Incorrect parameters - this function has allowed ' + 
        this.convertEnumToString(def.expectedTypeParameter) + ' parameter.');
        return;
      }
        
      if (def.expectedTypeParameter === ParameterType.noParameter && n.leftChild && n.leftChild !== null) {
        this.reportError(n, 'Incorrect parameter type - expected no parameter but found ' + 
        this.convertEnumToString(n.leftChild.argumentType));
        return;
      }
      if (def.expectedTypeParameter === ParameterType.noParameter && n.rightChild && n.rightChild !== null) {
        this.reportError(n, this.buildError('no', 'function block definition'));
        return;
      }
      if (def.expectedTypeParameter !== ParameterType.noParameter && n.leftChild === undefined || null 
      && n.rightChild === undefined || null) {
        this.reportError(n, this.buildError(this.convertEnumToString(def.expectedTypeParameter), 'no parameter'));
        return;
      }
      if (
        def.expectedTypeParameter !== ParameterType.noParameter 
        && n.leftChild !== undefined && n.leftChild.argumentType !== def.expectedTypeParameter) {
        this.reportError(
          n,
          this.buildError( this.convertEnumToString(def.expectedTypeParameter), this.convertEnumToString(n.leftChild.argumentType) )
        );
        return;
      }      
      if (n.rightChild && n.rightChild !== undefined)
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
    switch (type) {
      case ParameterType.color:
        return 'Color';
      case ParameterType.number:
        return 'Number';
      case ParameterType.string:
        return 'String';
      case ParameterType.noParameter:
        return 'No';
      default:
        return 'Unknown type';
    }
  }
  
  private buildError(expected: string, found: string): string {
    return 'Incorrect parameter type - expected ' + expected + ' parameter but found ' + found;
  }

  private reportError(n: any, errorMsg: string){
    this.reporter.reportError(n.line, n.from, n.to, errorMsg);
  }
}
