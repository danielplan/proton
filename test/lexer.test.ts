import { describe, expect, it } from 'vitest';
import Token, { TokenType } from '../src/interpreter/lexer/token';
import Lexer from '../src/interpreter/lexer';

describe('Lexer', () => {
    it('should tokenize a number', () => {
        const lexer = new Lexer('123');
        expect(lexer.tokenize()).toContainEqual(new Token('123', TokenType.TOKEN_NUMBER));
        lexer.content = '123.456';
        expect(lexer.tokenize()).toContainEqual(new Token('123.456', TokenType.TOKEN_NUMBER));
        lexer.content = '          123.456\t\t\n        10     ';
        expect(lexer.tokenize()).toContainEqual(new Token('123.456', TokenType.TOKEN_NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('10', TokenType.TOKEN_NUMBER));
    });

    it('should tokenize a string', () => {
        const lexer = new Lexer('"abc"');
        expect(lexer.tokenize()).toContainEqual(new Token('"abc"', TokenType.TOKEN_STRING));
        lexer.content = "'abc'";
        expect(lexer.tokenize()).toContainEqual(new Token("'abc'", TokenType.TOKEN_STRING));
    });

    it('should tokenize a string and number', () => {
        const lexer = new Lexer('"abc" 123');
        expect(lexer.tokenize()).toContainEqual(new Token('"abc"', TokenType.TOKEN_STRING));
        expect(lexer.tokenize()).toContainEqual(new Token('123', TokenType.TOKEN_NUMBER));
        lexer.content = "'abc1010' \t\t\n123";
        expect(lexer.tokenize()).toContainEqual(new Token("'abc1010'", TokenType.TOKEN_STRING));
        expect(lexer.tokenize()).toContainEqual(new Token('123', TokenType.TOKEN_NUMBER));
    });

    it('should fail on invalid string', () => {
        const lexer = new Lexer('"abc\t\t\n123');
        expect(() => lexer.tokenize()).toThrowError(/Unterminated string/);
    });

    it('should tokenize escape characters', () => {
        const lexer = new Lexer('"abc\\t\\t\\n123"');
        expect(lexer.tokenize()).toContainEqual(new Token('"abc\t\t\n123"', TokenType.TOKEN_STRING));
        lexer.content = "'abc\\t\\t\\n123\\''";
        expect(lexer.tokenize()).toContainEqual(new Token("'abc\t\t\n123''", TokenType.TOKEN_STRING));
    });

    it('should tokenize single char tokens', () => {
        const lexer = new Lexer('5+6-7*8/9%10');
        expect(lexer.tokenize()).toContainEqual(new Token('5', TokenType.TOKEN_NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('+', TokenType.TOKEN_PLUS));
        expect(lexer.tokenize()).toContainEqual(new Token('6', TokenType.TOKEN_NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('-', TokenType.TOKEN_MINUS));
        expect(lexer.tokenize()).toContainEqual(new Token('7', TokenType.TOKEN_NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('*', TokenType.TOKEN_MULTIPLY));
        expect(lexer.tokenize()).toContainEqual(new Token('8', TokenType.TOKEN_NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('/', TokenType.TOKEN_DIVIDE));
        expect(lexer.tokenize()).toContainEqual(new Token('9', TokenType.TOKEN_NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('%', TokenType.TOKEN_PERCENT));
        expect(lexer.tokenize()).toContainEqual(new Token('10', TokenType.TOKEN_NUMBER));
    });

    it('should tokenize keywords', () => {
        const lexer = new Lexer('component frame');
        expect(lexer.tokenize()).toContainEqual(new Token('component', TokenType.TOKEN_COMPONENT));
        expect(lexer.tokenize()).toContainEqual(new Token('frame', TokenType.TOKEN_FRAME));
    });

    it('should tokenize identifiers', () => {
        const lexer = new Lexer('abc123');
        expect(lexer.tokenize()).toContainEqual(new Token('abc123', TokenType.TOKEN_IDENTIFIER));
        lexer.content = '_abc123';
        expect(lexer.tokenize()).toContainEqual(new Token('_abc123', TokenType.TOKEN_IDENTIFIER));
        lexer.content = '_abc123_';
        expect(lexer.tokenize()).toContainEqual(new Token('_abc123_', TokenType.TOKEN_IDENTIFIER));
        lexer.content = '_abc123_123';
        expect(lexer.tokenize()).toContainEqual(new Token('_abc123_123', TokenType.TOKEN_IDENTIFIER));
    });

    it('should tokenize units', () => {
        const lexer = new Lexer('20px');
        expect(lexer.tokenize()).toContainEqual(new Token('20', TokenType.TOKEN_NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('px', TokenType.TOKEN_UNIT));
    });

    it('should tokenize a program', () => {
        const lexer = new Lexer(`
        frame mobile {
            home: LandingPage(),
            size: 9/16,
            background: #fff,
        }

        component LandingPage() {
            children: [
                Headline (
                    title: "Welcome to proton"
                    subtitle: "Let's get started"
                ),
                Text("This is a proton example"),
                Button(
                    text: "Sign Up"
                    link: SignUpPage()
                )
            ]
        }

        component SignUpPage() {
            children: [
                Headline (
                    title: "Sign Up"
                    subtitle: "Let's get started"
                ),
                Text("Sign up"),
                Box(
                    background: #fff
                    height: 200px
                )
            ]
        }
    `);
        expect(lexer.tokenize()).toContainEqual(new Token('frame', TokenType.TOKEN_FRAME));
        expect(lexer.tokenize()).toContainEqual(new Token('mobile', TokenType.TOKEN_IDENTIFIER));
        expect(lexer.tokenize()).toContainEqual(new Token('{', TokenType.TOKEN_LEFT_BRACE));
        expect(lexer.tokenize()).toContainEqual(new Token('home', TokenType.TOKEN_IDENTIFIER));
        expect(lexer.tokenize()).toContainEqual(new Token(':', TokenType.TOKEN_COLON));
        expect(lexer.tokenize()).toContainEqual(new Token('LandingPage', TokenType.TOKEN_IDENTIFIER));
    });
});
