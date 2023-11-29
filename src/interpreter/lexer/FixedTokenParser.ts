import TokenParser from './TokenParser';
import Token, { TokenType } from './token';
import Lexer from './index';

export default class FixedTokenParser extends TokenParser {
    private fixedTokens = new Map<string, TokenType>([
        ['component', TokenType.COMPONENT],
        ['frame', TokenType.FRAME],
        ['from', TokenType.FROM],
        ['px', TokenType.UNIT],
        ['=>', TokenType.ARROW],
        ['+', TokenType.PLUS],
        ['-', TokenType.MINUS],
        ['*', TokenType.MULTIPLY],
        ['/', TokenType.DIVIDE],
        ['(', TokenType.LEFT_PAREN],
        [')', TokenType.RIGHT_PAREN],
        ['{', TokenType.LEFT_BRACE],
        ['}', TokenType.RIGHT_BRACE],
        ['[', TokenType.LEFT_BRACKET],
        [']', TokenType.RIGHT_BRACKET],
        [',', TokenType.COMMA],
        [';', TokenType.SEMICOLON],
        ['.', TokenType.DOT],
        [':', TokenType.COLON],
        ['=', TokenType.EQUAL],
        ['%', TokenType.PERCENT],
    ]);

    parse(lexer: Lexer): Token | null {
        for (let [value, tokenType] of this.fixedTokens) {
            if(lexer.peakCharacters(value.length) == value) {
                lexer.consumeNextCharacters(value.length);
                return new Token(value, tokenType);
            }
        }
        return null
    }
}