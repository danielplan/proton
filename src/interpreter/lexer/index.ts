import Token, {TokenType} from "./token";
import LexerException from "./lexer-exception";

export default class Lexer {
    content: string;
    pos: number;
    match: string;
    static regexDigit = /[0-9]/;

    constructor(content: string) {
        this.content = content;
        this.pos = 0;
        this.match = '';
    }

    tokenize(): Token[] {
        this.pos = 0;
        const tokens: Token[] = [];
        while (!this.isFinished()) {
            const token = this.getNextToken();
            if (token) {
                tokens.push(token);
            }
        }
        return tokens;
    }

    getNextToken(): Token | null {
        let token: Token | null;
        this.match = '';
        this.skipWhitespace();

        token = this.parseNumber();
        if (!token) {
            token = this.parseString();
        }
        if (!token) {
            throw new LexerException('Unexpected character: ' + this.currChar());
        }
        return token;
    }

    private parseNumber(): Token | null {
        while (this.isDigit()) {
            this.match += this.currChar();
            this.pos++;
            if (this.currChar() == '.' && this.isDigit(this.nextChar())) {
                this.match += this.currChar();
                this.pos++;
            }
        }
        if (this.match.length > 0) {
            return new Token(this.match, TokenType.TOKEN_NUMBER);
        }
        return null;
    }

    private parseString(): Token | null {
        if (!this.startsString())
            return null;

        const startChar = this.currChar();
        this.match = startChar;
        this.pos++;
        while (this.currChar() != startChar) {
            this.match += this.currChar();
            this.pos++;
            if(!this.currChar()) {
                throw new LexerException('Unterminated string');
            }
        }
        this.match += this.currChar();
        this.pos++;
        if (this.match.length > 1) {
            return new Token(this.match, TokenType.TOKEN_STRING);
        }
        return null;
    }

    private skipWhitespace(): void {
        while (this.isWhitespace()) {
            this.pos++;
        }
    }

    private isFinished(): boolean {
        return this.content.length <= this.pos;
    }

    private isWhitespace(): boolean {
        return this.currChar() == ' ' || this.currChar() == '\n' || this.currChar() == '\t';
    }

    private isDigit(char: string = this.currChar()): boolean {
        return Lexer.regexDigit.test(char);
    }

    private startsString(): boolean {
        return this.currChar() == '"' || this.currChar() == '\'';
    }

    private currChar() {
        return this.content.charAt(this.pos);
    }

    private nextChar() {
        return this.content.charAt(this.pos + 1);
    }
}