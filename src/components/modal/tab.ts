import * as b from 'bobril';

interface ICtx extends b.IBobrilCtx{
    data: ITab;
}
export interface ITab {
    tabName: string,
    tabContent: any[] | string,
    isSelected?: boolean
    onClick?: (target: string) => boolean
}
export const tab = b.createComponent<ITab>({
  render(ctx: ICtx, me: b.IBobrilNode, oldMe: b.IBobrilCacheNode){
    me.style = {
      fontSize: 20, 
      padding: '8px 8px 0 8px', 
      margin: '8px 8px 0px', 
      backgroundColor: ctx.data.isSelected ? 'white' : '#9E9E9E', 
      cssFloat: 'left',
      borderWidth: '1px 1px 0px 1px', 
      borderColor: 'black', 
      borderStyle: 'solid', 
      cursor: 'pointer', 
      userSelect: 'none', 
      mozUserSelect: 'none'
    }
    me.children = ctx.data.tabName
  },
  onClick: (ctx: ICtx) => {   
    if (ctx.data.onClick)
      ctx.data.onClick(ctx.data.tabName);
    return false;
  },
})