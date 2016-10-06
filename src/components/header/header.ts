import * as b from 'bobril';
import {style} from './style';

export function header() {
    return b.createComponent(
    {
        render(ctx: b.IBobrilCtx, me: b.IBobrilNode, oldMe?: b.IBobrilCacheNode): void {
            b.style(me, style);
            me.children = [
                b.styledDiv(
                    [
                        b.styledDiv("Turtle Graphics",{fontSize: 72}),
                        b.styledDiv("LOGO language interpreter",{fontSize: 32})
                    ],
                    {color: "white", top: 50,position: "relative",margin: "0px auto",width: 500, fontFamily: "Helvetica Neue,Helvetica,Arial,sans-serif"})
            ];
        }
    })();
}