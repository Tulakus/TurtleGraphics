import * as b from 'bobril';
import {headerStyle} from './style'


interface IData {
    label: string;
    button?: any;
}

export interface ICtx extends b.IBobrilCtx {
    data: IData;
}

export const elementHeader = b.createComponent<IData>(
    {
        render(ctx: b.IBobrilCtx, me: b.IBobrilNode, oldMe?: b.IBobrilCacheNode): void {
            b.style(me, headerStyle);
            me.children = [
                ctx.data.label,
                ctx.data.button && b.styledDiv( ctx.data.button, {position: "relative", cssFloat: "right"})
          ]
        }
    }) 
