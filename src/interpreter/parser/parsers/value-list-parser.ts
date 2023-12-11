import AbstractParser from './abstract-parser';
import Parser from '../index';
import Node from '../../ast/node';
import { TokenType } from '../../lexer/token';
import { assertTokenType } from '../parser-error';
import ValueListNode from '../../ast/value-list-node';
import ValueParser from './value-parser';

export default class ValueListParser extends AbstractParser {
    parse(parent: Node, parser: Parser): Node {
        const values = [];
        const node = new ValueListNode(parent);
        while (true) {
            const value = new ValueParser().parse(node, parser);
            values.push(value);
            if (parser.peekToken().type === TokenType.RIGHT_BRACKET) break;
            const comma = parser.consumeToken();
            assertTokenType(comma, TokenType.COMMA);
        }
        node.values = values;
        return node;
    }
}