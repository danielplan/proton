export default class Token {
    public type: TokenType;
    public lexeme: string;

    constructor(lexeme: string, type: TokenType) {
        this.lexeme = lexeme;
        this.type = type;
    }
}

export enum TokenType {
    TOKEN_STRING,
    TOKEN_NUMBER,
    TOKEN_PLUS,
    TOKEN_MINUS,
    TOKEN_MULTIPLY,
    TOKEN_DIVIDE,
    TOKEN_LEFT_PAREN,
    TOKEN_RIGHT_PAREN,
    TOKEN_LEFT_BRACE,
    TOKEN_RIGHT_BRACE,
    TOKEN_LEFT_BRACKET,
    TOKEN_RIGHT_BRACKET,
    TOKEN_COMMA,
    TOKEN_SEMICOLON,
    TOKEN_DOT,
    TOKEN_COLON,
    TOKEN_EQUAL,
    TOKEN_PERCENT,
    TOKEN_COMPONENT,
    TOKEN_FRAME,
    TOKEN_IDENTIFIER,
    TOKEN_COLOR,
    TOKEN_UNIT,
}
