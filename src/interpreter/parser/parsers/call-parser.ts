import AbstractParser from './abstract-parser';
import { TokenType } from '../../lexer/token';
import { assertTokenType } from '../parser-error';
import CallNode from '../../ast/call-node';
import Parser from '../index';
import Node from '../../ast/node';
import KeyValuePairListParser from './key-value-pair-list-parser';
import KeyValueListNode from '../../ast/key-value-list-node';

export default class CallParser extends AbstractParser {
    parse(parent: Node, parser: Parser): Node {
        const identifier = parser.consumeToken();
        assertTokenType(identifier, TokenType.IDENTIFIER)

        const node = new CallNode(identifier.lexeme, null, parent);

        const leftParen = parser.consumeToken();
        assertTokenType(leftParen, TokenType.LEFT_PAREN)

        node.keyValueList = new KeyValuePairListParser().parse(parent, parser) as KeyValueListNode;

        const rightParen = parser.consumeToken();
        assertTokenType(rightParen, TokenType.RIGHT_PAREN)
        return node;
    }
}