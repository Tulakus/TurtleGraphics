import * as b from 'bobril';
import {button} from '../button/button';
import {reuseCommand} from '../../actions/AReuseCommand';
import {commandStyle} from './style';

interface IData {
    command: string;
}

interface ICtx extends b.IBobrilCtx {
    data: IData;
}

export let create = b.createComponent<IData>({
    render(context: ICtx, me: b.IBobrilNode, oldMe?: b.IBobrilCacheNode): void {
        b.style(me, commandStyle);
        me.children = [
            b.style(button({ title: '>', onClick: () => { reuseCommand(context.data.command) }}), {cssFloat: 'left', cursor: 'pointer'}),
            b.styledDiv(context.data.command, style),
            {tag: 'hr'}
        ];
    }
});

const style = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '80%',
  padding: '0px 5px',  
}