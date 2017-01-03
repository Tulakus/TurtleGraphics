import * as b from 'bobril';
import {BlockTNode} from './Node';
import {TokenType} from './Tokenizer';
import {Reporter} from './Reporter';

interface ICommand { 
  command: string;
  nextValue: string;
  calledFunc: (p: string, q?: string[]) => any; 
}

export default class Commands {
  constructor(reporter: Reporter) {
    this.reporter = reporter;
  };

  reporter: Reporter;
  lastX: number = 600;
  lastY: number = 600;
  lastAngle: number = 0;
  isPaintng: boolean = true;
  pColor: string = 'Black';
  pWidth: number = 1;
  results: any[] = [];
  subresult: string = '' + this.lastX + ',' + this.lastY + ' ';
  shouldCreateNewLine: boolean = false;
  
  private createNewLine(){
    let newLine = '' + this.lastX + ',' + this.lastY + ' ';
    if (newLine === this.subresult)
      return;
    let result = { points: this.subresult, styleDef: b.styleDef({ fill: 'white', stroke: this.pColor, strokeWidth: this.pWidth + 'px' }) };
    this.results.push(result);
    
    this.subresult = newLine;
    this.shouldCreateNewLine = false;
  }
  
  commands: ICommand[] = [
    { command: "tl", nextValue: "number", calledFunc: (p: string) => { return this.changeAngle(p, true) } },
    { command: "tr", nextValue: "number", calledFunc: (p: string) => { return this.changeAngle(p, false) } },
    { command: "fw", nextValue: "number", calledFunc: (p: string) => { return this.createLine(p, true) } },
    { command: "bw", nextValue: "number", calledFunc: (p: string) => { return this.createLine(p, false) } },
    { command: "pu", nextValue: "", calledFunc: () => { return this.setPainting(false) } },
    { command: "pd", nextValue: "", calledFunc: () => { return this.setPainting(true) } },
    { command: "pcolor", nextValue: "string", calledFunc: (p: string) => { return this.setPenColor(p) } },
    { command: "pwidth", nextValue: "number", calledFunc: (p: string) => { return this.setPenWidth(p) } },
  ];

  runCommands(node: BlockTNode): any[]{
    this.traverse(node);
    return this.getResult();
    
  }
  
private traverse(node: BlockTNode){
    if (node.children.length === 0)
      this.reporter.reportError(0, 0, 0, 'Error - incorrectly parsed command');
      
    for (var i = 0; i <= node.children.length - 1; i++) {
      if (node.children[i].type !== TokenType.keyword) 
        continue;
      
      if (node.children[i].rightChild === undefined) {
        let a = this.commands.filter((e) => { return e.command === node.children[i].value; })[0];
        let args = node.children[i].leftChild === undefined || null ? [] : [node.children[i].leftChild.value];
        let res = a.calledFunc.apply(null, args);
        
        if(res === undefined || res === null || res === true)
          continue;
                    
        this.subresult = this.subresult + res.newX + ',' + res.newY + ' ';
      } else {
        if (node.children[i].leftChild.value.length === 0)
          continue;

        var repeatTimes: number = parseInt(node.children[i].leftChild.value, 10);
        if (Number.isNaN(repeatTimes))
          this.reporter.reportError(0, 0, 0, 'Repeat times musst be integer value');
        for (var j = 0; j < repeatTimes; j++) {
          this.traverse(<BlockTNode>node.children[i].rightChild);
        }
      }
    }
  }

  getResult(): any[] {
    this.createNewLine();
    return this.results;
  }

  private setPainting(v: boolean): boolean {
    this.createNewLine();
    this.isPaintng = v;
    return true;
  }

  private setPenColor(v: string): boolean {
    this.createNewLine();
    this.pColor = v;
    return true;
  }

  private setPenWidth(v: string): boolean {
    let m = parseInt(v, 10);
    if (m < 1)
      this.reporter.reportError(0, 0, 0, 'Pen width musst be number > 1');
    this.createNewLine();
    this.pWidth = m;
    
    return true;
  }

  private createLine(moveBy: string, forward: boolean): any {
    let m = Number.parseInt(moveBy);
    let newPosition = this.calculateNextPoint(m, forward);
    let result = null;

    if (this.isPaintng)
      result = { newX: newPosition.newX, newY: newPosition.newY };
    
    this.setCurrentPosition(newPosition);
    return result;
  }

  private changeAngle(changeBy: string, increase: boolean): any {
    let m = Number.parseInt(changeBy);
    increase === true ? this.lastAngle = this.lastAngle + m : this.lastAngle = this.lastAngle + (360 - m);
    this.lastAngle = this.lastAngle % 360;
    // return null;
  }

  private calculateNextPoint(moveBy: number, forward: boolean): any {
    let toDegrees = Math.PI / 180;
    // if true -> forward else backward
    forward ? moveBy : moveBy = - moveBy;

    let helpX = Math.cos(this.lastAngle * toDegrees) * moveBy;
    let helpY = Math.sin(this.lastAngle * toDegrees) * moveBy;

    let newX = this.lastX + (helpX);
    let newY = this.lastY + (helpY * (-1));

    return { newX: newX, newY: newY };
  }

  private setCurrentPosition(newPosition: any) {
    this.lastX = newPosition.newX;
    this.lastY = newPosition.newY;
  }
}