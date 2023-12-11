import Token from './token';
import LexerError from './lexer-error';
import NumberTokenizer from './tokenizers/number-tokenizer';
import StringTokenizer from './tokenizers/string-tokenizer';
import FixedTokenizer from './tokenizers/fixed-tokenizer';
import IdentifierTokenizer from './tokenizers/identifier-tokenizer';
import ColorTokenizer from './tokenizers/color-tokenizer';
import Tokenizer from './tokenizers/tokenizer';

export default class Lexer {
    private text: string;
    private position: number;
    private tokenizers: Tokenizer[] = [
        new NumberTokenizer(),
        new StringTokenizer(),
        new FixedTokenizer(),
        new IdentifierTokenizer(),
        new ColorTokenizer(),
    ];


    constructor(content: string) {
        this.text = content;
        this.position = 0;
    }

    public tokenize(): Token[] {
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

    private getNextToken(): Token | null {
        if (this.skipWhitespace()) return null;
        let token: Token | null = null;
        for (const parser of this.tokenizers) {
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



}
