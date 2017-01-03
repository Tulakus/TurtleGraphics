import { createAction, shallowCopy } from 'bobflux';
import {ITurtleGraphicAppState, turtleGraphicAppCursor} from '../state';

let reuseCommandHandler = (state: ITurtleGraphicAppState, command: string): ITurtleGraphicAppState => {
  return state.command === command ? state : shallowCopy(state, copy => { copy.command = command; })
};

export let reuseCommand = createAction(turtleGraphicAppCursor, reuseCommandHandler);
