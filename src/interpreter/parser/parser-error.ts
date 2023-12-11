import Token, { TokenType } from '../lexer/token';

export default class ParserError extends Error {
    constructor(expected: string, token: Token, expectedLiteral: boolean = true){
        super(`Expected ${expectedLiteral ? `"${expected}"` : expected}, got: ${token.getTypeString()}`);
    }
}
export function assertTokenType(token: Token, expected: TokenType, expectedLiteral: boolean = true) {
    if (token.type !== expected) {
        throw new ParserError(expected, token, expectedLiteral);
    }
}

export function assertSpecialToken(token: Token, expected: TokenType, expectedString: string) {
    if (token.type !== expected) {
        throw new ParserError(expectedString, token, false);
    }
}
