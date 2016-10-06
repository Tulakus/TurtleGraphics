import * as b from 'bobril';
import * as CodeMirror from 'codemirror';
import {style} from './style';

b.asset('node_modules/codemirror/lib/codemirror.css');
b.asset('node_modules/codemirror/mode/tg/tg.js');
b.asset('node_modules/codemirror/addon/lint/lint.css');
b.asset('node_modules/codemirror/addon/fold/foldgutter.css');

export interface ICtx extends b.IBobrilCtx {
    data: IData;
    editor: any;
    lastApplyedCommand: string
}
interface IData {
    onChange(command: string): void;
    command: string;
}
export const editor = b.createComponent<IData>(
    {
        render(ctx: ICtx, me: b.IBobrilNode, oldMe?: b.IBobrilCacheNode): void {
            b.style(me, style);
            //me.style = style;
            if(ctx.data.command && ctx.lastApplyedCommand != ctx.data.command){
                let cursor = ctx.editor.getDoc().getCursor();
                ctx.editor.getDoc().setValue(ctx.data.command);
                ctx.lastApplyedCommand = ctx.data.command;
                ctx.editor.getDoc().setCursor(cursor)
            }
        },
        postInitDom(ctx: ICtx, me: b.IBobrilNode, element: HTMLElement) {
            var editor = CodeMirror(element, {
                value: ctx.data.command || '',
                mode: 'tg',
                lineNumbers: true,
                extraKeys: { 'Ctrl-Space': 'autocomplete' },
                matchBrackets: true,
                autoCloseBrackets: true,
                foldGutter: true,
                lint: true,
                gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter']
            });
            editor.on()
            editor.on('change', (instance) => {
                let content = instance.getDoc().getValue();
                ctx.data.command = content;
                ctx.data.onChange(instance);
            })
            
            editor.setSize("100%","100%");
            ctx.editor = editor;
        },
    })