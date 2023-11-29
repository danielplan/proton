import Lexer from './index';
import Token, { TokenType } from './token';
import TokenParser from './TokenParser';

export default class IdentifierParser extends TokenParser {
    parse(lexer: Lexer): Token | null {
        if (!this.isIdentifierStartingCharacter(lexer.peakCurrentCharacter()))
            return null;
        let match = '';
        while (this.isIdentifierCharacter(lexer.peakCurrentCharacter())) {
            match += lexer.consumeCurrentCharacter();
        }
        return new Token(match, TokenType.IDENTIFIER);
    }
    private isIdentifierStartingCharacter(char: string) {
        return /[a-zA-Z_]/.test(char);
    }
    private isIdentifierCharacter(char: string) {
        return /[a-zA-Z0-9_]/.test(char);
    }
}