export default class Token {
    public type: TokenType;
    public lexeme: string;

    constructor(lexeme: string, type: TokenType) {
        this.lexeme = lexeme;
        this.type = type;
    }

    public getTypeString(): string {
        switch (this.type) {
            case TokenType.NUMBER:
                return 'NUMBER';
            case TokenType.STRING:
                return 'STRING';
            case TokenType.IDENTIFIER:
                return 'IDENTIFIER';
            case TokenType.PLUS:
                return '+';
            case TokenType.MINUS:
                return '-';
            case TokenType.MULTIPLY:
                return '*';
            case TokenType.DIVIDE:
                return '/';
            case TokenType.LEFT_PAREN:
                return '(';
            case TokenType.RIGHT_PAREN:
                return ')';
            case TokenType.LEFT_BRACE:
                return '{';
            case TokenType.RIGHT_BRACE:
                return '}';
            case TokenType.LEFT_BRACKET:
                return '[';
            case TokenType.RIGHT_BRACKET:
                return ']';
            case TokenType.COMMA:
                return ',';
            case TokenType.SEMICOLON:
                return ';';
            case TokenType.DOT:
                return '.';
            case TokenType.COLON:
                return ':';
            case TokenType.EQUAL:
                return '=';
            case TokenType.PERCENT:
                return '%';
            case TokenType.COLOR:
                return 'COLOR';
            default:
                throw new Error('Unknown token type');
        }
    }
}

export enum TokenType {
    STRING,
    NUMBER,
    PLUS,
    MINUS,
    MULTIPLY,
    DIVIDE,
    LEFT_PAREN,
    RIGHT_PAREN,
    LEFT_BRACE,
    RIGHT_BRACE,
    LEFT_BRACKET,
    RIGHT_BRACKET,
    COMMA,
    SEMICOLON,
    DOT,
    COLON,
    EQUAL,
    PERCENT,
    COMPONENT,
    FRAME,
    IDENTIFIER,
    COLOR,
    UNIT,
}
