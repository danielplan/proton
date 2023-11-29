import TokenParser from './TokenParser';
import Lexer from './index';
import Token, { TokenType } from './token';
import LexerError from './lexer-error';

export default class StringParser extends TokenParser {
    private escapeMap = new Map<string, string>([
        ['n', '\n'],
        ['t', '\t'],
        ['r', '\r'],
    ]);
    parse(lexer: Lexer): Token | null {
        if (!this.isStringStartingCharacter(lexer.peakCurrentCharacter())) return null;

        const startChar = lexer.consumeCurrentCharacter();
        let match = startChar;
        while (lexer.peakCurrentCharacter() != startChar) {
            if (!lexer.peakCurrentCharacter()) {
                throw new LexerError('Unterminated string');
            }
            const currentChar = lexer.consumeCurrentCharacter();
            if (currentChar == '\\') {
                match += this.parseEscapeCharacter(lexer);
            } else {
                match += currentChar;
            }
        }
        match += lexer.consumeCurrentCharacter();
        return new Token(match, TokenType.STRING);
    }

    private isStringStartingCharacter(char: string): boolean {
        return ['"', "'"].includes(char);
    }

    private parseEscapeCharacter(lexer: Lexer): string {
        const afterBackSlash = lexer.consumeCurrentCharacter();
        return this.escapeMap.get(afterBackSlash) || afterBackSlash;
    }
}