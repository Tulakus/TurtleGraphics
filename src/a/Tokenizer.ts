import {Reporter, IError} from './Reporter';
export enum TokenType {
  whitespace = 0,
  keyword = 1,
  number = 2,
  squareBracketOpen = 3,
  squareBracketClose = 4,
  colors = 5,
  variable = 6,
  plusminus = 7,
  multdiv = 8,
  block = 9,
  roundBracketOpen = 10,
  roundBracketClose = 11,
  argument = 12,
  unknown = 13,
  epsilon = 14
}

export interface IsymbolRecipe {
  keyWord: string,
  definition: ISymbolDefinition[],
  expectedEnd?: string
}
export interface ISymbolDefinition {
  value: TokenType[]
}
export interface IRegExp {
  patternType: TokenType,
  pattern: RegExp | RegExp[]
}
export interface IToken {
  value: string,
  type: TokenType,
  line?: number,
  startIndex?: number,
  endIndex?: number

}

export class Tokenizer {
  constructor(reporter: Reporter) {
    this.keywordsRegex = this.createRegexPatterns(this.keywords);
    this.colorsRegex = this.createRegexPatterns(this.colors);
    this.regexpPattern = this.initializeRegExp();
    this.reporter = reporter
  };
  keywords: string[] = ['tl', 'tr', 'fw', 'bw', 'pu', 'pd', 'pwidth', 'pcolor', 'r'];
  colors: string[] = ('AliceBlue AntiqueWhite Aqua Aquamarine Azure Beige Bisque Black BlanchedAlmond Blue BlueViolet Brown BurlyWood CadetBlue Chartreuse Chocolate Coral ' +
    'CornflowerBlue Cornsilk Crimson Cyan DarkBlue DarkCyan DarkGoldenRod DarkGray DarkGrey DarkGreen DarkKhaki DarkMagenta DarkOliveGreen DarkOrange ' +
    'DarkOrchid DarkRed DarkSalmon DarkSeaGreen DarkSlateBlue DarkSlateGray DarkSlateGrey DarkTurquoise DarkViolet DeepPink DeepSkyBlue DimGray DimGrey ' +
    'DodgerBlue FireBrick FloralWhite ForestGreen Fuchsia Gainsboro GhostWhite Gold GoldenRod Gray Grey Green GreenYellow HoneyDew HotPink IndianRed Indigo ' +
    'Ivory Khaki Lavender LavenderBlush LawnGreen LemonChiffon LightBlue LightCoral LightCyan LightGoldenRodYellow LightGray LightGrey LightGreen LightPink ' +
    'LightSalmon LightSeaGreen LightSkyBlue LightSlateGray LightSlateGrey LightSteelBlue LightYellow Lime LimeGreen Linen Magenta Maroon MediumAquaMarine ' +
    'MediumBlue MediumOrchid MediumPurple MediumSeaGreen MediumSlateBlue MediumSpringGreen MediumTurquoise MediumVioletRed MidnightBlue MintCream MistyRose ' +
    'Moccasin NavajoWhite Navy OldLace Olive OliveDrab Orange OrangeRed Orchid PaleGoldenRod PaleGreen PaleTurquoise PaleVioletRed PapayaWhip PeachPuff Peru ' +
    'Pink Plum PowderBlue Purple RebeccaPurple Red RosyBrown RoyalBlue SaddleBrown Salmon SandyBrown SeaGreen SeaShell Sienna Silver SkyBlue SlateBlue ' +
    'SlateGray SlateGrey Snow SpringGreen SteelBlue Tan Teal Thistle Tomato Turquoise Violet Wheat White WhiteSmoke Yellow YellowGreen').split(' ');
  keywordsRegex: RegExp[] = [];
  colorsRegex: RegExp[] = [];
  regexpPattern: IRegExp[];
  tokens: IToken[];
  reporter: Reporter;
  
  tokenize(a: string): IToken[] {
    //if (a.length == 0 || a.trim().length == 0)
      //this.reporter.reportError(0, 0, 0, "Empty command");
    let results: IToken[] = [];
    let lines = this.splitInputToLines(a);

    for (var i = 0; i <= lines.length - 1; i++) {
      var line = lines[i];
      var position: number = 0;

      while (line.length != 0) {
        let token = this.getToken(line);

        token.startIndex = position;
        token.endIndex = position + token.value.length;
        token.line = i;

        position += token.value.length;
        line = line.slice(token.value.length);

        if (token.type !== TokenType.whitespace)
          results.push(token);
      }
    }
    return results;
  };

  private initializeRegExp(): IRegExp[] {
    return [
      { patternType: TokenType.whitespace, pattern: /^\s+/ },
      { patternType: TokenType.keyword, pattern: this.keywordsRegex },
      { patternType: TokenType.number, pattern: /^0\.[0-9]+|^[1-9][0-9]*\.?[0-9]+|^[1-9][0-9]*/ },
      { patternType: TokenType.squareBracketClose, pattern: /^\]/ },
      { patternType: TokenType.squareBracketOpen, pattern: /^\[/ },
      { patternType: TokenType.roundBracketOpen, pattern: /^\(/ },
      { patternType: TokenType.roundBracketClose, pattern: /^\)/ },
      { patternType: TokenType.plusminus, pattern: /^\+|^\-/ },
      { patternType: TokenType.multdiv, pattern: /^\*|^\// },
      { patternType: TokenType.colors, pattern: this.colorsRegex },
      { patternType: TokenType.unknown, pattern: /^\S+/ },
    ];
  }
  private splitInputToLines(input: string): string[] {
    let lines = input.split(/\r\n|\r|\n/g)
    return lines;
  }

  private getToken(a: string): IToken {
    var result: IToken;
    let parsedValue;
    for (let i = 0; i <= this.regexpPattern.length - 1; i++) {
      if (Array.isArray(this.regexpPattern[i].pattern) == true) {
        var patternArr = <RegExp[]>this.regexpPattern[i].pattern;
        for (let j = 0; j <= patternArr.length - 1; j++) {
          parsedValue = patternArr[j].exec(a);
          if (parsedValue != null)
            break;
        }
      } else {
        var pattern = <RegExp>this.regexpPattern[i].pattern;
        parsedValue = pattern.exec(a);
      }
      if (parsedValue != null) {
        result = { value: parsedValue[0], type: this.regexpPattern[i].patternType };
        break;
      }
    }
    return result;
  }

  private createRegexPatterns(words: string[]): RegExp[] {
    let beginRegex = /^/;
    let endRegex = /(?![\w\d\S])/;
    let result: RegExp[] = []
    for (let i = 0; i < words.length; i++) {
      result.push(new RegExp(beginRegex.source + words[i] + endRegex.source));
    }
    return result;
  }
}
