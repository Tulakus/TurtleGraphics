import * as CodeMirror from 'codemirror';

export interface IError {
    line: number;
    startCol: number;
    endCol: number;
    message: string;
    type: string;
}

export class Reporter {
    errors: IError[] = []
    instance: any = {}; // == CodeMirror

    reportError(line: number, startCol: number, endCol: number, message: string) {
        this.errors.push({
            line: line,
            startCol: startCol,
            endCol: endCol,
            message: message,
            type: 'error'
        });
    }

    clearEditorMarks(instance: any, gutterId: string) {
        var state = instance.state.lint;
        if (state.hasGutter) instance.clearGutter(gutterId);
        for (var i = 0; i < state.marked.length; ++i)
            state.marked[i].clear();
        state.marked.length = 0;
    };

    setEditor(editor: any) {
        this.instance = editor;
    }
    
    getErrors(): IError[] {
        return this.errors;
    }
    
    getUniqueErrors(): IError[] {
        let a = {};
        let r = [];
        for (var i = 0 ; i < this.errors.length; i++) {
            let h = '';
            
            for (var prop in this.errors) {
                if (prop)
                    h += this.errors[prop];
            }
            
            if (!a.hasOwnProperty(h)) {
                a[h] = true;
                r.push(this.errors[i]);
            }
        }
        return r;
    }
    
    clearErrors(){
        this.errors = [];
    }
    


    groupByLine(annotations) {
        var lines = [];
        for (var i = 0; i < annotations.length; ++i) {
            var ann = annotations[i], line = ann.from.line;
            (lines[line] || (lines[line] = [])).push(ann);
        }
        return lines;
    }

    createAnnotations(err: IError[]) {
        var instance = this.instance; 
        var state = instance.state.lint;
        var GUTTER_ID = 'CodeMirror-lint-markers';
        var cm = instance;
        this.clearEditorMarks(instance, GUTTER_ID);

        var errors = this.createLintErrors(err);
        var annotations = this.groupByLine(errors);

        for (var line = 0; line < annotations.length; ++line) {
            var anns = annotations[line];
            var options = state.options;
            if (!anns) continue;

            var maxSeverity = null;
            var tipLabel = state.hasGutter && document.createDocumentFragment();

            for (var i = 0; i < anns.length; ++i) {
                var ann = anns[i];
                var severity = ann.severity;

                if (!severity)
                    severity = 'error';
                maxSeverity = 'error'// getMaxSeverity(maxSeverity, severity);
                
                if (!severity)
                    severity = 'error';
                var tip = document.createElement('div');
                tip.className = 'CodeMirror-lint-message-' + severity;
                tip.appendChild(document.createTextNode(ann.message));
                
                if (state.hasGutter)
                    tipLabel.appendChild(tip);

                if (ann.to) state.marked.push(cm.markText(ann.from, ann.to, {
                    className: 'CodeMirror-lint-mark-' + severity,
                    __annotation: ann
                }));
            }

            if (state.hasGutter)
                cm.setGutterMarker(
                    line, GUTTER_ID,
                    this.makeMarker(
                        tipLabel, maxSeverity, anns.length > 1,
                        state.options.tooltips
                    )
                );
            if (options.onUpdateLinting)
                options.onUpdateLinting(annotations, annotations, cm)
        }

    };

    private createLintErrors(errors: IError[]): any[] {
        var found = [];
        for (var i = 0; i < errors.length; i++) {
            let message = errors[i];
            var startLine = message.line, endLine = message.line, startCol = message.startCol, endCol = message.endCol;
            found.push({
                from: { ch: startCol, line: startLine},
                to: {line: endLine, ch: endCol},
                message: message.message,
                severity: message.type
            });
        }
        return found;
    }

    private makeMarker(labels, severity, multiple, tooltips) {
        function showTooltipFor(e, content, node) {
            var tooltip = showTooltip(e, content);
            function hide() {
                (<any>CodeMirror).off(node, 'mouseout', hide);
                if (tooltip) { hideTooltip(tooltip); tooltip = null; }
            }
            var poll = setInterval(function () {
                if (tooltip) for (var n = node; ; n = n.parentNode) {
                    if (n && n.nodeType === 11) n = n.host;
                    if (n === document.body) return;
                    if (!n) { hide(); break; }
                }
                if (!tooltip) return clearInterval(poll);
            }, 400);
            (<any>CodeMirror).on(node, 'mouseout', hide);
        }

        function showTooltip(e, content) {
            var tt = document.createElement('div');
            tt.className = 'CodeMirror-lint-tooltip';
            tt.appendChild(content.cloneNode(true));
            document.body.appendChild(tt);

            function position(e) {
                if (!tt.parentNode) {
                    (<any>CodeMirror).off(document, 'mousemove', position);
                    return;
                } 
                tt.style.top = Math.max(0, e.clientY - tt.offsetHeight - 5) + 'px';
                tt.style.left = (e.clientX + 5) + 'px';
            };
            (<any>CodeMirror).on(document, 'mousemove', position); 
            position(e);
            if (tt.style.opacity !== null) tt.style.opacity = '1';
            return tt;
        }; 

        function hideTooltip(tt) {
            if (!tt.parentNode) return;
            if (tt.style.opacity === null) rm(tt);
            tt.style.opacity = 0;
            setTimeout(function () { rm(tt); }, 600);
        };

        function rm(elt) {
            if (elt.parentNode) elt.parentNode.removeChild(elt);
        }

        var marker = document.createElement('div'), inner = marker;  
        marker.className = 'CodeMirror-lint-marker-' + severity;
        
        if (multiple) {
            inner = <HTMLDivElement>marker.appendChild(document.createElement('div'));
            inner.className = 'CodeMirror-lint-marker-multiple'; 
        }

        if (tooltips !== false) (<any>CodeMirror).on(inner, 'mouseover', function (e) {
            showTooltipFor(e, labels, inner);
        });
        return marker;
    };
}