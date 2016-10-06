import * as b from 'bobril';

interface IData {
    title: string;
    href: string;
    target?: string;
}

interface ICtx extends b.IBobrilCtx {
    data: IData;
}

export const a = b.createComponent<IData>({
    render(ctx: ICtx, me: b.IBobrilNode, oldMe?: b.IBobrilCacheNode): void {
        me.tag = 'a';
        me.children = ctx.data.title;
        me.attrs = {href:ctx.data.href, target: ctx.data.target || "_blank"}
    },
    
});