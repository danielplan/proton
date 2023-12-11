import Tokenizer from './tokenizer';
import Lexer from '../index';
import Token, { TokenType } from '../token';

export default class ColorTokenizer extends Tokenizer {
    parse(lexer: Lexer): Token  | null {
        if (!this.isColorStartingCharacter(lexer.peakCurrentCharacter()))
            return null;
        let match = lexer.consumeCurrentCharacter();
        while (this.isColorCharacter(lexer.peakCurrentCharacter())) {
            match += lexer.consumeCurrentCharacter();
        }
        return new Token(match, TokenType.COLOR);
    }
    private isColorStartingCharacter(char: string) {
        return /#/.test(char);
    }
    private isColorCharacter(char: string) {
        return /[a-fA-F0-9]/.test(char);
    }
}