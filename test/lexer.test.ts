import { describe, expect, it } from 'vitest';
import Token, { TokenType } from '../src/interpreter/lexer/token';
import Lexer from '../src/interpreter/lexer';

describe('Lexer', () => {
    it('should tokenize a number', () => {
        let lexer = new Lexer('123');
        expect(lexer.tokenize()).toContainEqual(new Token('123', TokenType.NUMBER));
        lexer = new Lexer( '123.456');
        expect(lexer.tokenize()).toContainEqual(new Token('123.456', TokenType.NUMBER));
        lexer = new Lexer('          123.456\t\t\n        10     ');
        expect(lexer.tokenize()).toContainEqual(new Token('123.456', TokenType.NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('10', TokenType.NUMBER));
    });

    it('should tokenize a string', () => {
        let lexer = new Lexer('"abc"');
        expect(lexer.tokenize()).toContainEqual(new Token('"abc"', TokenType.STRING));
        lexer = new Lexer('\'abc\'');
        expect(lexer.tokenize()).toContainEqual(new Token("'abc'", TokenType.STRING));
    });

    it('should tokenize a string and number', () => {
        let lexer = new Lexer('"abc" 123');
        expect(lexer.tokenize()).toContainEqual(new Token('"abc"', TokenType.STRING));
        expect(lexer.tokenize()).toContainEqual(new Token('123', TokenType.NUMBER));
        lexer = new Lexer("'abc1010' \t\t\n123");
        expect(lexer.tokenize()).toContainEqual(new Token("'abc1010'", TokenType.STRING));
        expect(lexer.tokenize()).toContainEqual(new Token('123', TokenType.NUMBER));
    });

    it('should fail on invalid string', () => {
        const lexer = new Lexer('"abc\t\t\n123');
        expect(() => lexer.tokenize()).toThrowError(/Unterminated string/);
    });

    it('should tokenize escape characters', () => {
        let lexer = new Lexer('"abc\\t\\t\\n123"');
        expect(lexer.tokenize()).toContainEqual(new Token('"abc\t\t\n123"', TokenType.STRING));
        lexer = new Lexer("'abc\\t\\t\\n123\\''");
        expect(lexer.tokenize()).toContainEqual(new Token("'abc\t\t\n123''", TokenType.STRING));
    });

    it('should tokenize single char tokens', () => {
        const lexer = new Lexer('5+6-7*8/9%10');
        expect(lexer.tokenize()).toContainEqual(new Token('5', TokenType.NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('+', TokenType.PLUS));
        expect(lexer.tokenize()).toContainEqual(new Token('6', TokenType.NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('-', TokenType.MINUS));
        expect(lexer.tokenize()).toContainEqual(new Token('7', TokenType.NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('*', TokenType.MULTIPLY));
        expect(lexer.tokenize()).toContainEqual(new Token('8', TokenType.NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('/', TokenType.DIVIDE));
        expect(lexer.tokenize()).toContainEqual(new Token('9', TokenType.NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('%', TokenType.PERCENT));
        expect(lexer.tokenize()).toContainEqual(new Token('10', TokenType.NUMBER));
    });

    it('should tokenize keywords', () => {
        const lexer = new Lexer('component frame');
        expect(lexer.tokenize()).toContainEqual(new Token('component', TokenType.COMPONENT));
        expect(lexer.tokenize()).toContainEqual(new Token('frame', TokenType.FRAME));
    });

    it('should tokenize identifiers', () => {
        let lexer = new Lexer('abc123');
        expect(lexer.tokenize()).toContainEqual(new Token('abc123', TokenType.IDENTIFIER));
        lexer = new Lexer('_abc123');
        expect(lexer.tokenize()).toContainEqual(new Token('_abc123', TokenType.IDENTIFIER));
        lexer = new Lexer('_abc123_');
        expect(lexer.tokenize()).toContainEqual(new Token('_abc123_', TokenType.IDENTIFIER));
        lexer = new Lexer('_abc123_123');
        expect(lexer.tokenize()).toContainEqual(new Token('_abc123_123', TokenType.IDENTIFIER));
    });

    it('should tokenize units', () => {
        const lexer = new Lexer('20px');
        expect(lexer.tokenize()).toContainEqual(new Token('20', TokenType.NUMBER));
        expect(lexer.tokenize()).toContainEqual(new Token('px', TokenType.UNIT));
    });

    it('should tokenize colors', () => {
        const lexer = new Lexer('#fff');
        expect(lexer.tokenize()).toContainEqual(new Token('#fff', TokenType.COLOR));

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
        expect(lexer.tokenize()).toContainEqual(new Token('frame', TokenType.FRAME));
        expect(lexer.tokenize()).toContainEqual(new Token('mobile', TokenType.IDENTIFIER));
        expect(lexer.tokenize()).toContainEqual(new Token('{', TokenType.LEFT_BRACE));
        expect(lexer.tokenize()).toContainEqual(new Token('home', TokenType.IDENTIFIER));
        expect(lexer.tokenize()).toContainEqual(new Token(':', TokenType.COLON));
        expect(lexer.tokenize()).toContainEqual(new Token('LandingPage', TokenType.IDENTIFIER));
    });
});
