import * as b from 'bobril';

export default function createContent(content: any[]): any[] {
    let lastElement = content.length - 1;
    var result = content.map((e, index) => {
      if (e && e != true) {
        if (index === lastElement) {
          return b.style({ tag: 'polyline', attrs: { points: e.points , 'marker-end': 'url(#Triangle)'} }, e.styleDef);
        } else {
          return b.style({ tag: 'polyline', attrs: { points: e.points } }, e.styleDef);
        }
      }
    });
    return result;
}
