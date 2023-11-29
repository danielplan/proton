import TokenParser from './TokenParser';
import Token, { TokenType } from './token';
import Lexer from './index';

export default class NumberParser extends TokenParser {
    public parse(lexer: Lexer): Token | null {
        let match = '';

        while (this.isDigit(lexer.peakCurrentCharacter())) {
            match += lexer.consumeCurrentCharacter();
            if(lexer.peakCurrentCharacter() == '.' && this.isDigit(lexer.peakNextCharacter())) {
                match += lexer.consumeCurrentCharacter();
            }
        }

        if (match.length > 0) {
            return new Token(match, TokenType.NUMBER);
        }
        return null;
    }

    private isDigit(char: string): boolean {
        return /[0-9]/.test(char);
    }
}