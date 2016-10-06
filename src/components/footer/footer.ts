import * as b from 'bobril';
import {style} from './style';

interface IFooterData{
    children: any[]
}
interface ICtx extends b.IBobrilCtx{
    data: IFooterData;
}
export const footer = b.createComponent<IFooterData>(
    {
        render(ctx: ICtx, me: b.IBobrilNode, oldMe?: b.IBobrilCacheNode): void {
            b.style(me, style);
            me.children = ctx.data.children;
        }
    });