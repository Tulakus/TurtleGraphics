import * as b from 'bobril';
import {modal, IData} from './tabModal';
import {tab} from './tab';
import {button} from '../button/button';
import {a} from '../link/a';

interface containerCtx extends b.IBobrilCtx {
    data: IHelpData;
    id: string
}
interface IHelpData{
    onClose: ()=> boolean;
}

export const helpModalContainer =  b.createComponent<IHelpData>({
    init(ctx: containerCtx) {
        ctx.id =  b.addRoot(()=>{
            return b.styledDiv(modal({
                    modalName: "Turtle Graphics",
                    onClose: ctx.data.onClose,
                    tabList: [
                        { tabName: "About", tabContent: aboutContent },
                        { tabName: "Commands", tabContent: commands.map(e => { return command(e); }) },
                        { tabName: "Examples", tabContent: examples.map(e => { return example(e); }) },
                        { tabName: "Contact", tabContent: ["Contact: m.tulacka@seznam.cz"] },
                    ]
            }),{ width: "100%", height: "100%", zIndex: 200, backgroundColor: "rgba(67, 67, 67, .7)", top: window.scrollY, right:0, position: "absolute", })})},
    postUpdateDom(ctx: containerCtx, me: b.IBobrilCacheNode, element: HTMLElement){
        b.focus(me);
    },
    destroy(ctx: containerCtx) {
        b.removeRoot(ctx.id);
    }
});
let br = {tag:"br"}
let aboutContent = [
    {tag:"h4", children: 'Programming language LOGO'},
    "Logo is an educational programming language, designed in 1967. Today the language is remembered mainly for its use of \"turtle graphics\", in which commands for movement and drawing produced line graphics - see more information about Logo language on" ,a({href: "https://en.wikipedia.org/wiki/Logo_(programming_language)", title: "WIKI"}),br,br,
    {tag:"h4", children: "How to begin"},
    "Type commands which can help your turtle draw objects on the canvas ands press button Draw it too see it. If lines are typed correctly, the turtle will draw desired picture. The turtle will remember typed commands which can later be found in History of commands section, from where they can reloaded into Commands editor field. See section Examples for inspiration.", br, br,
    {tag:"h4", children: "Drawing canvas"},
    "Drawing canvas is limited to size of 1200 by 1200px, where starting position of the turtle is in the center, turned eastward", br, br,
    ];

let examples = [{
    name: "Square sunflower",
    image: b.asset("assets/sunflower.png"),
    command: "r 18 [ r 4 [ fw 50 tl 90] tl 20]"
},
{
    name: "Star",
    image: b.asset("assets/star.png"),
    command: "r 5 [ fw 50 tr 144 ]"    
},
{
    name: "Red circle",
    image: b.asset("assets/red_circle.png"),
    command: "pcolor Red pwidth 3 r 72 [ fw 5 tl 5 ]"
}]

let commands = [
    {
        command: "fw",
        description: "Turtle draws a line of size z o x pixels forward",
        example: "fw 90"
    },
    {
        command: "bw", 
        description: "Turtle draws a line of size z o x pixels backward",
        example: "bw 90"
    },
    {
        command: "tl",
        description: "It turns the turtle anti-clockwise",
        example: "tl 90"
    },
    {
        command: "tr",
        description: "It turns the turtle clockwise",
        example: "tr 90"
    },
    {
        command: "pu",
        description: ["Turtle’s movement will not leave a line behind", br, "Note: Do not forget to use command pd for putting down a pencil again"],
        example: "pu"
    },
    {
        command: "pd",
        description: "Turtles’s movement will again leave a line behind",
        example: "pd"
    },
    {
        command: "pcolor",
        description: ["It changes a color of a drawn line. A colour is defined by a name. List of supported colours: ",a({href:"http://www.w3schools.com/colors/colors_names.asp", title: "barev"})],
        example: "pcolor red"
    },
    {
        command: "pwidth",
        description: "It changes the width of a line, in pixels",
        example: "pwidth 5"
    },
    {
        command: "r",
        description: "It repeats x times typed commands",
        example: "r 4 [ fw 90 tl 90 ]"
    }]

function command(command: any): b.IBobrilNode {
    return b.styledDiv(
        [
            b.styledDiv(command.command, { cssFloat: "left", width: "15%" , fontWeight: "bold"}),
            b.styledDiv([
                command.description,
                b.styledDiv(["example: ", command.example], { background: "white", marginTop: 3, paddingTop: 5, paddingBottom: 10 })
            ], { cssFloat: "left", width: "85%" }),
        ], { height: 70, margin: "10px 30px" });
}

function example(example: any): b.IBobrilNode {
    return b.styledDiv([       
                b.styledDiv([example.name], { fontWeight:  "bold"}),     
                b.styledDiv(["commands: ", example.command], { background: "white", marginTop: 3, paddingTop: 5, paddingBottom: 10 }),
                {tag: "img", attrs: {src: example.image}, style: {width:200, height: 200}},
            ], { width: "90%", padding: "10px 0px" })
}