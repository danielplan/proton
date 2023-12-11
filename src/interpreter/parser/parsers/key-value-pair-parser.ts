import AbstractParser from './abstract-parser';
import { TokenType } from '../../lexer/token';
import { assertSpecialToken, assertTokenType } from '../parser-error';
import Parser from '../index';
import ValueParser from './value-parser';
import KeyValueListNode from '../../ast/key-value-list-node';
import Node from '../../ast/node';

export default class KeyValuePairParser extends AbstractParser {
    // KEY-VALUE-PAIR ::= IDENTIFIER ':' VALUE
    parse(parent: KeyValueListNode, parser: Parser): Node {
        const identifier = parser.consumeToken();
        assertSpecialToken(identifier, TokenType.IDENTIFIER, 'key')

        const colon = parser.consumeToken();
        assertTokenType(colon, TokenType.COLON)
        const value = new ValueParser().parse(parent, parser);
        parent.addChild(identifier.lexeme, value);
        return parent;
    }
}