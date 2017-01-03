import * as b from 'bobril';

interface IData {
    children: any[];
}
export interface ICtx extends b.IBobrilCtx {
    data: IData;
}

export let create = b.createComponent<IData>(
    {
        render(ctx: ICtx, me: b.IBobrilNode, oldMe?: b.IBobrilCacheNode): void {
            me.tag = 'marker';
            me.attrs = {
                id: 'Triangle', viewBox: '0 0 10 10', refX: '1', refY: '5', markerWidth: '12',
                markerHeight: '12', orient: 'auto', markerUnits: 'userSpaceOnUse'
            };
            me.children = [
                ctx.data.children,
            ]
        }
    }
)
