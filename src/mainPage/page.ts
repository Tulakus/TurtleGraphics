import * as b from 'bobril';
import { getState } from 'bobflux';
import {turtleGraphicAppCursor} from '../state';

import * as commandHistory from '../components/commandHistory/commandHistory';
import {editor } from '../components/editor/editor';
import * as graphicPane from '../components/svgPane/svgpane';
import {header} from '../components/header/header';
import {footer} from '../components/footer/footer';
import createSvgContent from '../components/svgPane/createContent';
import { helpModalContainer} from '../components/modal/helpModal';
import { elementHeader} from '../components/elementHeader/elementHeader';
import {parseAndCheckCommand} from '../actions/AParseAndCheckCommand';

import {execute} from '../actions/ARunCommands';
import {button} from '../components/button/button';
import {link} from '../components/link/link';
import {clear} from '../actions/AClear';

interface ICtx extends b.IBobrilCtx{
  isModalVisible?: boolean;
}
const textSeparator = " / ";

export let page = b.createComponent({
  init(ctx: ICtx){
    document.body.style.padding = "0";
    document.body.style.margin = "0";
    ctx.isModalVisible = false;
  },
  render(ctx: ICtx, me: b.IBobrilNode, oldMe?: b.IBobrilCacheNode): void {
    let state = getState(turtleGraphicAppCursor);
    me.style = { height: "100%", backgroundColor: "#BDBDBD"};
    me.children = [
      header(),
      b.styledDiv([
        b.styledDiv([
          elementHeader(
            {label: "Preview",
            button: b.style(button({title: 'Clear', onClick: clear}), {cursor:"pointer"})}) ,
            {
              tag: "div",
              children: [graphicPane.create({ children: createSvgContent(state.results) })],
              style: {marginBottom: 10, overflow: "hidden", height : 600, width: "auto"}
            },
        ], {marginBottom: 10, overflowY: "hidden", height : 643}),
        b.styledDiv([
          b.styledDiv([
            b.style(elementHeader({label: "Commands Editor", button: b.style(button({title: 'Draw it', onClick: execute}), {cursor:"pointer"})}), {padding: 10, fontSize: 20, color: "white"}),
            b.style(editor({ onChange: parseAndCheckCommand, command: state.command, }), {height: "calc(265px - 43px)", overflowY: "auto"}),
            ]
            ,{cssFloat: "left", width: "calc(60% - 10px)", height: 'inherit',position:"relative"}),
          b.styledDiv([
            elementHeader({label: "Commands History"}) ,
            b.styledDiv([ commandHistory.create()], {width: "100%",overflowY: "auto", backgroundColor: "gray", height: "calc(100% - 39px)",top: 0})
          ], {cssFloat: "right", width:"40%", height: "inherit"})
        ], { backgroundColor: 'rgb(189, 189, 189)', width: "100%", height: 265, overflowY: "hidden"}),
        ctx.isModalVisible &&  helpModalContainer({onClose: ()=>{
          ctx.isModalVisible = false;
          b.invalidate();
          return true;
        }}),
      ],{height: '100%', minWidth: 400, maxWidth: 1200, margin: "20px auto 15px"}),
      footer({children: [ 
        b.styledDiv(["©2016",
        textSeparator, 
        link({
          title:'About Turtle Graphics', onClick: () => { 
          ctx.isModalVisible = true;
          b.invalidate(); 
        }}),
      ],{textAlign: "center",paddingTop:5})   
    ]
  })]}
});