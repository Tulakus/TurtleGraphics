import { IState, ICursor } from 'bobflux';
import {BlockTNode} from './a/Node';
import * as b from 'bobril';

export interface ITurtleGraphicAppState extends IState {
	commands: string[];
	command: string;
	results: any[];
	parsedTree: BlockTNode;
	errors: any[];
}

export let turtleGraphicAppCursor: ICursor<ITurtleGraphicAppState> = {
	key: ''
};

export let createDefaultTurtleGraphicAppState = (): ITurtleGraphicAppState => {
	return {
		commands: [
			'r 360 [ fw 50 bw 50 tl 1 ]',
			'r 72 [ fw 10 tl 5 ]',
			'r 6 [ r 4 [ r 2 [ fw 10 tl 60 fw 10 tr 120 fw 10 tl 60 fw 10 tl 60 ] tr 180 ] tr 180 ]',
			'r 8 [ tr 45 r 6 [ r 90 [ fw 4 tr 2 ] tr 90 ] ]' ,
			'r 40 [ tr 45 r 6 [ r 45 [ fw 2 tr 2 ] r 90 [ fw 2 tr 2 ] tr 294 ] ]',
			'pu bw 200 pd r 40 [ tr 45 r 6 [ r 90 [ fw 2 tr 2 ] tr 294 ] ]'],
		results: createDefaultSvgContent(),
		errors: [],
		parsedTree: null,
		command: '',
		//command: 'fw 50 tl 45 fw 50 tl 45 fw 50 tl 45 fw 50 tl 45 fw 50 tl 45 fw 50 tl 45 fw 50 tl 45 fw 50' //8 uhelnik
		//command: 'r 72 [ fw 10 tl 5 ]'
		//command: 'tl 45 fw 100 tr 90 bw 100' // 3 uhelnik
		//command: 'tl 45 fw 100 tl 270 bw 100 tl 270 bw 100 tl 270 bw 100' //kosoctverec
		//command: 'tl 45 fw 100 tr  90 bw 100 tr 90 bw 100 tr 90 bw 100' //kosoctverec
		//command: c
		//command: "r 4 [ fw 20 tl 90 ] fw  90"
		//command: "r 50 [ fw 90 tl 90 fw 3 tl 90 fw 90 tr 90 fw 3 tr 90]" // spirala
		//command: "fw 50 pu fw 50 pd pwidth 5 pcolor red fw 50 pu fw 50 pd pcolor green pwidth 20 fw 100",
		//command: "r 4 [ fw 90 tl 90 fw 3 fw 90 tl 90 fw 3 tl 90 fw 90 tr 90 fw 3 tr 90]",
		//command: "r 4 [ r 2 [ fw 90 tl 90 fw 3 ] tl 90 fw 90 tr 90 fw 3 tr 90]",
		//command: 'r 8 [ r 2 [ fw 10 tl 45 fw 10 tr 90 fw 10 tl 45 fw 10 tl 45] tr 135 ] '
		//command: "r 6 [ r 4 [	r 2 [ fw 10 tl 60 fw 10 tr 120 fw 10 tl 60 fw 10 tl 60 ] tr 180 ] tr 180 ] " kochova vlocka
	};
};

export function createDefaultSvgContent(): any[] {
	return 	[		
				{points: '600,590 600,610', styleDef: b.styleDef({ fill: 'white', stroke: 'black', strokeWidth: '1px' })},
				{points: '590,600 610,600', styleDef: b.styleDef({ fill: 'white', stroke: 'black', strokeWidth: '1px' })}
			]
}