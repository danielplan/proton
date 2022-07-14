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
}