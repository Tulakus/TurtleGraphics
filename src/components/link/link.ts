import * as b from 'bobril';

interface IData {
    title: string;
    onClick: () => void;
}

interface ICtx extends b.IBobrilCtx {
    data: IData;
    textWeight: string;
}

export const link = b.createComponent<IData>({
    init(ctx: ICtx){
      ctx.textWeight = "normal";  
    },
    render(ctx: ICtx, me: b.IBobrilNode, oldMe?: b.IBobrilCacheNode): void {
        me.tag = 'span';
        me.children = ctx.data.title;
        me.style = { fontWeight: ctx.textWeight, cursor: "pointer"}
    },
    onClick(ctx: ICtx, ev: b.IBobrilMouseEvent): boolean {
        ctx.data.onClick();
        return true;
    }, 
    onMouseIn(ctx: ICtx, ev: b.IBobrilMouseEvent){
        ctx.textWeight = "bold";
        b.invalidate(ctx);
    },
    onMouseLeave(ctx: ICtx, ev: b.IBobrilMouseEvent){
        ctx.textWeight = "normal";
        b.invalidate(ctx);
    }
});