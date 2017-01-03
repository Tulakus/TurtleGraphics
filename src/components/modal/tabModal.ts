import * as b from 'bobril';
import {button} from '../button/button';
import {tab, ITab} from './tab';

export interface IData{
  modalName?: string;
  tabList?: ITab[];
  onClose: () => void;
}

interface ICtx extends b.IBobrilCtx {
  data: IData; 
  content: any[] | string;
  selectedTab: string;
 }
 
export const modal = b.createComponent<IData>({
    init(ctx: ICtx) {
      let defaultTab = ctx.data.tabList[0];
      ctx.content = defaultTab.tabContent;
      ctx.data.tabList = changeSelectedTab(defaultTab.tabName, ctx.data.tabList);
      document.body.style.overflow = 'hidden';
    },
    render(ctx: ICtx, me: b.IBobrilNode, oldMe: b.IBobrilCacheNode){
      if (ctx.selectedTab) {
        let list = ctx.data.tabList;
        ctx.content = getContentByName(ctx.selectedTab, list);
        ctx.data.tabList = changeSelectedTab(ctx.selectedTab, list);
      }
         
      me.attrs = {id: 'modal' + ctx.data.modalName},
      me.style = { 
        width: 700, 
        height: 500, 
        backgroundColor: 'green', 
        margin: '0px auto', 
        top: 200, 
        position: 'relative', 
        overflow: 'hidden' 
      },
      me.children = [ 
        header([
            ctx.data.modalName, 
            b.style(
              button(
                  {
                    title: 'X', 
                    onClick: () => { 
                      document.body.style.overflow = 'auto'; 
                      if (ctx.data.onClose) 
                        ctx.data.onClose();
                    }
                  }
                ),
              {
                position: 'absolute',
                top: 5, 
                right: 5,
                cursor: 'pointer'
              })
        ]),
        tablist(
          ctx.data, 
          ctx, 
          (tabName) => { 
            ctx.selectedTab = tabName; 
            b.invalidate(ctx); 
            return true; 
          }),
        content(ctx.content)
        ];
    }
  });



function getContentByName(name: string, tabList: any[]): any[] | string{
  let content = tabList.find((e) => {return e.tabName === name});
  return content.tabContent || '';
}

function changeSelectedTab(name: string, tabList: any[]): any[]{
  tabList.forEach((e) => { 
    e.tabName == name ? e.isSelected = true : e.isSelected = false;
  });

  return tabList;
}

function tablist(modalCfg: IData, ctx: ICtx, onClick: (name: string) => boolean): b.IBobrilNode {
  return b.styledDiv(
    [ 
          ctx.data.tabList.map(e => {
            e.onClick = onClick;
            return tab(e);
        })
    ], 
    {
      width: '100%', 
      backgroundColor: 'white',
      margin: 0, 
      paddingLeft: 42, 
      overflowY: 'auto', 
      height: 40
    }); 
}

function header(children: any): b.IBobrilNode{
  return b.createComponent(
    {
      render(ctx: b.IBobrilCtx, me: b.IBobrilNode, oldMe: b.IBobrilCacheNode) {
        me.style = {
          width: '100%', 
          height: 50, 
          backgroundColor: 'white', 
          margin: 0, 
          fontSize: '2rem', 
          paddingLeft: 50, 
          paddingTop: 10
        };
        me.children = children;
      }
    })();
}

function content(modalContent: any, style?: any): b.IBobrilNode{
  return b.styledDiv( 
    b.styledDiv(
      modalContent, 
      {
        padding: 50
      }),
    {
      height: 'calc(100% - 100px)', 
      backgroundColor: 'white', 
      margin: 0, 
      overflowY: 'auto',
      borderTopStyle: 'solid', 
      borderTopWidth: 1, 
      borderTopColor: 'black'
    });
  }