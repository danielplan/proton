import {describe, expect, it} from 'vitest'
import Token, {TokenType} from "../src/interpreter/lexer/token";
import Lexer from "../src/interpreter/lexer";

describe('Lexer', () => {
    it('should tokenize a number', () => {
        const lexer = new Lexer('123');
        expect(lexer.tokenize()).toContainEqual(new Token('123', TokenType.TOKEN_NUMBER));
        lexer.content = '123.456';
        expect(lexer.tokenize()).toContainEqual(new Token('123.456', TokenType.TOKEN_NUMBER));
        lexer.content = '          123.456\t\t\n        10';
        expect(lexer.tokenize()).toContainEqual(new Token('123.456', TokenType.TOKEN_NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('10', TokenType.TOKEN_NUMBER));
    });
    it('should tokenize a string', () => {
        const lexer = new Lexer('"abc"');
        expect(lexer.tokenize()).toContainEqual(new Token('\"abc\"', TokenType.TOKEN_STRING));
        lexer.content = "'abc'";
        expect(lexer.tokenize()).toContainEqual(new Token("'abc'", TokenType.TOKEN_STRING));
    });
    it('should tokenize a string and number', () => {
        const lexer = new Lexer('"abc" 123');
        expect(lexer.tokenize()).toContainEqual(new Token('\"abc\"', TokenType.TOKEN_STRING));
        expect(lexer.tokenize()).toContainEqual(new Token('123', TokenType.TOKEN_NUMBER));
        lexer.content = "'abc1010' \t\t\n123";
        expect(lexer.tokenize()).toContainEqual(new Token("'abc1010'", TokenType.TOKEN_STRING));
        expect(lexer.tokenize()).toContainEqual(new Token('123', TokenType.TOKEN_NUMBER));
    });
    it('should fail on invalid string', () => {
        const lexer = new Lexer('"abc\t\t\n123');
        expect(() => lexer.tokenize()).toThrowError(/Unterminated string/);
    });
});