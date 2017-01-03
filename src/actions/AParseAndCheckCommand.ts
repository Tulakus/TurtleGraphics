import { createAction, shallowCopy } from 'bobflux';
import {ParserNew} from '../a/Parser';
import {Reporter} from '../a/Reporter';
import { ITurtleGraphicAppState, turtleGraphicAppCursor} from '../state';
import {Tokenizer} from '../a/Tokenizer';
import {Dispatcher} from '../a/Dispatcher';


let parseAndCheckCommandeHandler = (state: ITurtleGraphicAppState, editor: any): ITurtleGraphicAppState => {

    let reporter = new Reporter();
    reporter.clearErrors();
    let doc = editor.getDoc();
    let command = doc.getValue();
    let parser = new ParserNew(reporter);
    let tokenizer = new Tokenizer(reporter);
    let dispatcher = new Dispatcher(reporter);
    let tokens = tokenizer.tokenize(command);
    let err = reporter.getErrors();
    let ast = null;
    
    if (err.length === 0)
        ast = parser.parse(tokens);
    err = reporter.getErrors();
    if (err.length === 0)
        dispatcher.dispatch(ast);
    let errors = reporter.getUniqueErrors();

    reporter.setEditor(editor);
    reporter.createAnnotations(errors);

    return shallowCopy(state, copy => {

        copy.command = command;
        copy.errors = errors;
        copy.parsedTree = ast;
        return copy;
    });
};

export let parseAndCheckCommand = createAction(turtleGraphicAppCursor, parseAndCheckCommandeHandler);