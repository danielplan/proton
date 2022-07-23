import Token, { TokenType } from './token';
import LexerException from './lexer-error';

export default class Lexer {
    content: string;
    pos: number;
    static regexDigit = /[0-9]/;
    static regexLetter = /[a-zA-Z]/;
    static regexWhitespace = /\s/;
    static fixedTokens = new Map<string, TokenType>([
        ['component', TokenType.TOKEN_COMPONENT],
        ['frame', TokenType.TOKEN_FRAME],
        ['px', TokenType.TOKEN_UNIT],
        ['+', TokenType.TOKEN_PLUS],
        ['-', TokenType.TOKEN_MINUS],
        ['*', TokenType.TOKEN_MULTIPLY],
        ['/', TokenType.TOKEN_DIVIDE],
        ['(', TokenType.TOKEN_LEFT_PAREN],
        [')', TokenType.TOKEN_RIGHT_PAREN],
        ['{', TokenType.TOKEN_LEFT_BRACE],
        ['}', TokenType.TOKEN_RIGHT_BRACE],
        ['[', TokenType.TOKEN_LEFT_BRACKET],
        [']', TokenType.TOKEN_RIGHT_BRACKET],
        [',', TokenType.TOKEN_COMMA],
        [';', TokenType.TOKEN_SEMICOLON],
        ['.', TokenType.TOKEN_DOT],
        [':', TokenType.TOKEN_COLON],
        ['=', TokenType.TOKEN_EQUAL],
        ['%', TokenType.TOKEN_PERCENT],
    ]);

    constructor(content: string) {
        this.content = content;
        this.pos = 0;
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
        if (this.skipWhitespace()) return null;

        let token = this.parseNumber();
        if (!token) token = this.parseString();
        if (!token) token = this.parseFixedTokens();
        if (!token) token = this.parseIdentifier();
        if (!token) token = this.parseColor();
        if (!token) throw new LexerException('Unexpected character: ' + this.getCurrentChar());

        return token;
    }

    private parseNumber(): Token | null {
        let match = '';
        while (this.isDigit()) {
            match += this.getCurrentChar();
            this.pos++;
            if (this.getCurrentChar() == '.' && this.isDigit(this.getNextChar())) {
                match += this.getCurrentChar();
                this.pos++;
            }
        }
        if (match.length > 0) {
            return new Token(match, TokenType.TOKEN_NUMBER);
        }
        return null;
    }

    private parseString(): Token | null {
        if (!this.isStringStartingCharacter()) return null;

        const startChar = this.getCurrentChar();
        let match = startChar;
        this.pos++;
        while (this.getCurrentChar() != startChar) {
            if (!this.getCurrentChar()) {
                throw new LexerException('Unterminated string');
            }
            if (this.getCurrentChar() == '\\') {
                switch (this.getNextChar()) {
                    case 'n':
                        match += '\n';
                        break;
                    case 't':
                        match += '\t';
                        break;
                    case 'r':
                        match += '\r';
                        break;
                    default:
                        match += this.getNextChar();
                        break;
                }
                this.pos += 2;
            } else {
                match += this.getCurrentChar();
                this.pos++;
            }
        }
        match += this.getCurrentChar();
        this.pos++;
        if (match.length > 1) {
            return new Token(match, TokenType.TOKEN_STRING);
        }
        return null;
    }

    private skipWhitespace(): boolean {
        const whitespace = this.isWhitespace();
        while (this.isWhitespace()) {
            this.pos++;
        }
        return whitespace;
    }

    private isFinished(): boolean {
        return this.content.length <= this.pos;
    }

    private isWhitespace(): boolean {
        return Lexer.regexWhitespace.test(this.getCurrentChar());
    }

    private isDigit(char: string = this.getCurrentChar()): boolean {
        return Lexer.regexDigit.test(char);
    }

    private isStringStartingCharacter(): boolean {
        return this.getCurrentChar() == '"' || this.getCurrentChar() == "'";
    }

    private getCurrentChar() {
        return this.content.charAt(this.pos);
    }

    private getNextChar() {
        return this.content.charAt(this.pos + 1);
    }

    private parseFixedTokens(): Token | null {
        for (let [value, tokenType] of Lexer.fixedTokens) {
            if (this.content.substring(this.pos, this.pos + value.length) == value) {
                this.pos += value.length;
                return new Token(value, tokenType);
            }
        }
        return null;
    }

    private parseIdentifier(): Token | null {
        if (!this.isLetter() && this.getCurrentChar() != '_') {
            return null;
        }
        let match = '';
        while (this.isIdentifierCharacter()) {
            match += this.getCurrentChar();
            this.pos++;
        }
        return new Token(match, TokenType.TOKEN_IDENTIFIER);
    }

    private isIdentifierCharacter(): boolean {
        return this.isLetter() || this.isDigit() || this.getCurrentChar() == '_' || this.getCurrentChar() == '-';
    }

    private isLetter(): boolean {
        return Lexer.regexLetter.test(this.getCurrentChar());
    }

    private parseColor() {
        if (this.getCurrentChar() != '#') {
            return null;
        }
        this.pos++;
        let match = '#';
        while (
            this.isDigit() ||
            this.getCurrentChar() == 'a' ||
            this.getCurrentChar() == 'b' ||
            this.getCurrentChar() == 'c' ||
            this.getCurrentChar() == 'd' ||
            this.getCurrentChar() == 'e' ||
            this.getCurrentChar() == 'f'
        ) {
            match += this.getCurrentChar();
            this.pos++;
        }
        return new Token(match, TokenType.TOKEN_COLOR);
    }
}
