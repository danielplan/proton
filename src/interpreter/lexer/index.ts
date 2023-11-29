import Token from './token';
import LexerError from './lexer-error';
import NumberParser from './NumberParser';
import StringParser from './StringParser';
import FixedTokenParser from './FixedTokenParser';
import IdentifierParser from './IdentifierParser';
import ColorParser from './ColorParser';
import TokenParser from './TokenParser';

export default class Lexer {
    private text: string;
    private position: number;
    private PARSERS: TokenParser[] = [
        new NumberParser(),
        new StringParser(),
        new FixedTokenParser(),
        new IdentifierParser(),
        new ColorParser(),
    ];


    constructor(content: string) {
        this.text = content;
        this.position = 0;
    }

    tokenize(): Token[] {
        this.position = 0;
        const tokens: Token[] = [];
        while (!this.isFinished()) {
            const token = this.getNextToken();
            if (token) {
                tokens.push(token);
            }
        }
        return tokens;
    }

    private getNextToken(): Token | null {
        if (this.skipWhitespace()) return null;
        let token: Token | null = null;
        for (const parser of this.PARSERS) {
            token = parser.parse(this);
            if (token) break;
        }
        if (!token) throw new LexerError('Unexpected character: ' + this.peakCurrentCharacter());
        return token;
    }



    private skipWhitespace(): boolean {
        const whitespace = this.isWhitespace();
        while (this.isWhitespace()) {
            this.position++;
        }
        return whitespace;
    }

    private isFinished(): boolean {
        return this.text.length <= this.position;
    }

    private isWhitespace(): boolean {
        return /\s/.test(this.peakCurrentCharacter());
    }

    public peakCurrentCharacter() {
        return this.text.charAt(this.position);
    }

    public consumeCurrentCharacter(): string {
        return this.text.charAt(this.position++);
    }

    public peakCharacters(length: number): string {
        return this.text.substring(this.position, this.position + length);
    }

    public consumeNextCharacters(length: number): string {
        const characters = this.peakCharacters(length);
        this.position += length;
        return characters;
    }

    public peakNextCharacter() {
        return this.text.charAt(this.position + 1);
    }

}
