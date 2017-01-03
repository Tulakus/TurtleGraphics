import { createAction, shallowCopy } from 'bobflux';
import { turtleGraphicAppCursor, ITurtleGraphicAppState, createDefaultSvgContent } from '../state';
import Commands from '../a/commands';
import {Reporter} from '../a/Reporter';

let executeHandler = (state: ITurtleGraphicAppState): ITurtleGraphicAppState => {
	if (state.parsedTree === null || state.errors.length !== 0)
		return state;
	
	let reporter = new Reporter();
	let commandRunner = new Commands(reporter);
	
	let execCommands = commandRunner.runCommands(state.parsedTree);
	let defaultResults = createDefaultSvgContent();
	let a = shallowCopy(state, copy => {
		copy.results = defaultResults.concat(execCommands);
		copy.commands = [state.command, ...copy.commands];
		return copy;
	});
	return a;
};

export let execute = createAction(turtleGraphicAppCursor, executeHandler);
