import { createAction, shallowCopy, getState } from 'bobflux';
import {ITurtleGraphicAppState, turtleGraphicAppCursor} from '../state';
import * as b from 'bobril';

let reuseCommandHandler = (state: ITurtleGraphicAppState, command: string): ITurtleGraphicAppState => {
  return state.command === command ? state : shallowCopy(state, copy => { copy.command = command; })
};

export let reuseCommand = createAction(turtleGraphicAppCursor, reuseCommandHandler);
