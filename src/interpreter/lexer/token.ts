export default class Token {
    public type: TokenType;
    public lexeme: string;

    constructor(lexeme: string, type: TokenType) {
        this.lexeme = lexeme;
        this.type = type;
    }

    public getTypeString(): string {
        const type = this.type;
        if(!type) throw new Error('Unknown token type');
        return type;
    }
}


export enum TokenType {
    STRING= 'STRING',
    NUMBER= 'NUMBER',
    PLUS='+',
    MINUS='-',
    MULTIPLY='*',
    DIVIDE='/',
    LEFT_PAREN='(',
    RIGHT_PAREN=')',
    LEFT_BRACE='{',
    RIGHT_BRACE = '}',
    LEFT_BRACKET    = '[',
    RIGHT_BRACKET   = ']',
    COMMA   = ',',
    SEMICOLON   = ';',
    DOT = '.',
    COLON   = ':',
    EQUAL   = '=',
    PERCENT = '%',
    COMPONENT  = 'component',
    FRAME   = 'frame',
    IDENTIFIER  = 'identifier',
    COLOR   = 'color',
    UNIT    = 'unit',
    ARROW   = '=>',
    FROM    = 'from',
}
