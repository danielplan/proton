import AbstractParser from './abstract-parser';
import Parser from '../index';
import { TokenType } from '../../lexer/token';
import StringNode from '../../ast/string-node';
import ColorNode from '../../ast/color-node';
import ParserError, { assertTokenType } from '../parser-error';
import NumberParser from './number-parser';
import Node from '../../ast/node';
import CallParser from './call-parser';
import IdentifierParser from './identifier-parser';
import KeyValuePairListParser from './key-value-pair-list-parser';
import ActionParser from './action-parser';
import ValueListParser from './value-list-parser';

export default class ValueParser extends AbstractParser {


    // VALUE ::= NUMBER | NUMBER UNIT | COLOR | IDENTIFIER | RATIO | STRING | [ VALUE_LIST ] | { KEY-VALUE-PAIRS } | CALL | ACTION
    parse(parent: Node, parser: Parser) {
        const token = parser.peekToken();

        switch (token.type) {
            case TokenType.NUMBER:
                return new NumberParser().parse(parent, parser);
            case TokenType.IDENTIFIER:
                if (parser.peekToken(1).type === TokenType.LEFT_PAREN) return new CallParser().parse(parent, parser);
                if (parser.peekToken(1).type === TokenType.ARROW) return new ActionParser().parse(parent, parser);
                return new IdentifierParser().parse(parent, parser);
            case TokenType.STRING:
                parser.consumeToken();
                return new StringNode(token.lexeme.substring(1, token.lexeme.length - 1), parent);
            case TokenType.COLOR:
                parser.consumeToken();
                return new ColorNode(token.lexeme, parent);
            case TokenType.LEFT_BRACE:
                const leftBrace = parser.consumeToken();
                assertTokenType(leftBrace, TokenType.LEFT_BRACE);
                const result = new KeyValuePairListParser().parse(parent, parser);

                const rightBrace = parser.consumeToken();
                assertTokenType(rightBrace, TokenType.RIGHT_BRACE)
                return result;
            case TokenType.LEFT_BRACKET:
                const leftBracket = parser.consumeToken();
                assertTokenType(leftBracket, TokenType.LEFT_BRACKET)
                const valueList = new ValueListParser().parse(parent, parser);

                const rightBracket = parser.consumeToken();
                assertTokenType(rightBracket, TokenType.RIGHT_BRACKET)
                return valueList;
            default:
                throw new ParserError('value', token, false);
        }
    }
}