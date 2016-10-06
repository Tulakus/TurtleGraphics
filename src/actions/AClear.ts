import {createAction, shallowCopy}from 'bobflux';
import {ITurtleGraphicAppState, turtleGraphicAppCursor, createDefaultSvgContent} from '../state';

let clearHandler = (state: ITurtleGraphicAppState): ITurtleGraphicAppState => {
    return shallowCopy(state, copy => {
      copy.command = "";
      copy.results = createDefaultSvgContent();
      return copy;
    })
}

export let clear = createAction(turtleGraphicAppCursor, clearHandler);