import * as b from 'bobril';
import {BlockTNode} from './Node';
import {TokenType} from './Tokenizer';
import {Reporter} from './Reporter';

interface ICommand { 
  command: string;
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
  styles: any = {}; 
  commandList: ICommand[] = [
    { command: 'tl',  calledFunc: (p: string) => { return this.changeAngle(p, true); } },
    { command: 'tr',  calledFunc: (p: string) => { return this.changeAngle(p, false); } },
    { command: 'fw',  calledFunc: (p: string) => { return this.createLine(p, true); } },
    { command: 'bw',  calledFunc: (p: string) => { return this.createLine(p, false); } },
    { command: 'pu',  calledFunc: () => { return this.setPainting(false); } },
    { command: 'pd',  calledFunc: () => { return this.setPainting(true); } },
    { command: 'pcolor', calledFunc: (p: string) => { return this.setPenColor(p); } },
    { command: 'pwidth', calledFunc: (p: string) => { return this.setPenWidth(p); } },
  ];

  runCommands(node: BlockTNode): any[] {
    this.traverse(node);
    return this.getResult();
  }
  
  getResult(): any[] {
    this.createNewLine();
    return this.results;
  }

  getStyle() {
    let style = this.pColor + ' ' + this.pWidth;
    if (this.styles.hasOwnProperty(style)) {
      return this.styles[style];
    } else {
      this.styles[style] = b.styleDef({
                fill: 'transparent', 
                stroke: this.pColor, 
                strokeWidth: this.pWidth + 'px' 
                });
      return this.styles[style];
    }
  }

  private traverse(node: BlockTNode){
    if (node.children.length === 0)
      this.reporter.reportError(0, 0, 0, 'Error - incorrectly parsed command');
      
    for (var i = 0; i <= node.children.length - 1; i++) {
      if (node.children[i].type !== TokenType.keyword) 
        continue;
      
      if (node.children[i].rightChild === undefined) {
        let a = this.commandList.filter((e) => { return e.command === node.children[i].value; })[0];
        let args = node.children[i].leftChild === undefined || null ? [] : [node.children[i].leftChild.value];
        let res = a.calledFunc.apply(null, args);
        
        if (res === undefined || res === null || res === true)
          continue;
                    
        this.subresult = this.subresult + res.newX + ',' + res.newY + ' ';
      } else {
        if (node.children[i].leftChild.value.length === 0)
          continue;

        let repeatTimes: number = parseInt(node.children[i].leftChild.value, 10);
        if (Number.isNaN(repeatTimes))
          this.reporter.reportError(0, 0, 0, 'Repeat times musst be integer value');
        for (let j = 0; j < repeatTimes; j++) {
          this.traverse(<BlockTNode>node.children[i].rightChild);
        }
      }
    }
  }

  private setPainting(value: boolean): boolean {
    this.createNewLine();
    this.isPaintng = value;
    return true;
  }

  private setPenColor(value: string): boolean {
    if (value === this.pColor)
      return true;
    this.createNewLine();
    this.pColor = value;
    return true;
  }

  private setPenWidth(value: string): boolean {
    let width = parseInt(value, 10);
    if (width === this.pWidth)
      return true;

    if (width < 1)
      this.reporter.reportError(0, 0, 0, 'Pen width musst be number > 1');
    this.createNewLine();
    this.pWidth = width;
    
    return true;
  }

  private createNewLine() {
    let newLine = '' + this.lastX + ',' + this.lastY + ' ';
    if (newLine === this.subresult)
      return;

    let result = { 
      points: this.subresult, 
      styleDef: this.getStyle()
    };
    this.results.push(result);
    
    this.subresult = newLine;
    this.shouldCreateNewLine = false;
  }


  private createLine(distance: string, forward: boolean): any {
    let newPosition = this.calculateNewPosition(distance, forward);
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

  private calculateNewPosition(distance: string, forward: boolean): any {
    let moveBy = Number.parseInt(distance);
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