import * as b from 'bobril';
import * as command from './command';
import { getState } from 'bobflux';
import {turtleGraphicAppCursor} from '../../state';
import {commandHistoryStyle} from './style';

export let create = b.createComponent(
    {
        render(ctx: b.IBobrilCtx, me: b.IBobrilNode, oldMe?: b.IBobrilCacheNode): void {
            let state = getState(turtleGraphicAppCursor);
            b.style(me, commandHistoryStyle)
            me.children = [
                state.commands.map((e, i) => {
                    if (e)
                        return command.create({ command: state.commands[i]});
                })]
        }
    });