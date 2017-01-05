import * as b from 'bobril';
import * as marker from '../marker/marker';

export interface ICtx extends b.IBobrilCtx {
    data: IData;
    top?: number;
    left?: number;
    startY?: number;
    startX?: number;
    isDraggingEnabled?: boolean;
    cursor?: string;
    origHeight?: number;
    origWidth?: number;
    parrentHeight?: number;
    parrentWidth?: number;
    borderWidth?: number;
}

interface IData {
    children: any[];
}
let svgBorderWidth = 2;

export let create = b.createComponent<IData>({
    init(ctx: ICtx) {
        ctx.origHeight = 1200;
        ctx.origWidth = 1200;
        ctx.isDraggingEnabled = false;
    },
    onDragStart(ctx: ICtx, dndCtx: b.IDndCtx): boolean {
        ctx.startY = parseInt(document.getElementById('svgpane').style.top, 10);
        ctx.startX = parseInt(document.getElementById('svgpane').style.left, 10);
        ctx.isDraggingEnabled = true;
        return true; 
    },
    onDrag(ctx: ICtx, dndCtx: b.IDndCtx): boolean{
        if (!ctx.isDraggingEnabled)
            return;
        let diffY = (dndCtx.startY - dndCtx.lastY);
        let diffX = (dndCtx.startX - dndCtx.lastX);
        let maxLeftOffset = ctx.parrentWidth - ctx.origWidth - 2 * ctx.borderWidth;
        let maxTopOffset = ctx.parrentHeight - ctx.origHeight - 2 * ctx.borderWidth;
        
        if (ctx.startY - diffY < maxTopOffset) {
            diffY = maxTopOffset;
        }  else if (ctx.startY - diffY > 0) {
            diffY = 0;
        } else {
            diffY = ctx.startY - diffY;
        }
        
        if(ctx.startX - diffX < maxLeftOffset ){
            diffX = maxLeftOffset;
        } else if (ctx.startX - diffX > 0) {
            diffX = 0;
        } else {
            diffX = ctx.startX - diffX;
        }
        
        ctx.top = diffY;
        ctx.left = diffX;
        b.invalidate(ctx);
        return true; 
    },
    onDragEnd(ctx: ICtx, dndCtx: b.IDndCtx): boolean{
        ctx.isDraggingEnabled = false;
        b.invalidate(ctx);
        return true; 
    },
    onMouseEnter(ctx: ICtx,  event: b.IBobrilMouseEvent){
        ctx.cursor = 'move';
        b.invalidate(ctx);
        return false;
    },
    onMouseLeave(ctx: ICtx,  event: b.IBobrilMouseEvent){
        ctx.cursor = 'auto';
        b.invalidate(ctx);
        return false;
    },
    render(ctx: ICtx, me: b.IBobrilNode, oldMe?: b.IBobrilCacheNode): void {
        me.tag = 'svg',
        me.attrs = {draggable: 'true', id: 'svgpane'},
        me.style = { 
            width: ctx.origWidth, 
            height: ctx.origHeight, 
            backgroundColor: 'white', 
            top: ctx.top, 
            left: ctx.left, 
            position: 'relative', 
            cursor: ctx.cursor || 'auto',
            borderStyle: 'solid', 
            borderWidth: ctx.borderWidth
        },
        me.children = [
            {
                tag: 'defs',
                children: [
                    marker.create({
                        children: [{
                            tag: 'path', attrs: { d: 'M 0 0 L 10 5 L 0 10 z' }
                        }]
                    }),
                ]
            },

            ctx.data.children,
        ]
    },
    postInitDom(ctx: ICtx, me: b.IBobrilNode, element: HTMLElement) {
        let parrent = <HTMLElement>element.parentNode;
        let elmWidth = parseInt(element.style.width, 10);
        let elmHeight = parseInt(element.style.height, 10);
        ctx.parrentWidth = parrent.clientWidth;
        ctx.parrentHeight = parrent.clientHeight;

        ctx.parrentWidth - elmWidth === 0 ? ctx.borderWidth = 0 : ctx.borderWidth = svgBorderWidth;
        ctx.left = (ctx.parrentWidth - elmWidth - 2 * ctx.borderWidth) / 2;
        ctx.top = (ctx.parrentHeight - elmHeight - 2 * ctx.borderWidth) / 2;
        b.invalidate(ctx);
    }, 
    postUpdateDom(ctx: ICtx, me: b.IBobrilNode, element: HTMLElement) {
        let parrent = <HTMLElement>element.parentNode;
        if (ctx.parrentWidth === parrent.clientWidth)
            return;
            
        let elmWidth = parseInt(element.style.width, 10);
        let elmHeight = parseInt(element.style.height, 10);
        
        ctx.parrentWidth = parrent.clientWidth;
        ctx.parrentHeight = parrent.clientHeight;
        ctx.parrentWidth - elmWidth === 0 ? ctx.borderWidth = 0 : ctx.borderWidth = svgBorderWidth;
        ctx.left = (ctx.parrentWidth - elmWidth - 2 * ctx.borderWidth) / 2;
        ctx.top = (ctx.parrentHeight - elmHeight - 2 * ctx.borderWidth) / 2;
        b.invalidate(ctx);
    }           
});