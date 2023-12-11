import AbstractParser from './abstract-parser';
import { TokenType } from '../../lexer/token';
import { assertSpecialToken, assertTokenType } from '../parser-error';
import Parser from '../index';
import Node from '../../ast/node';
import FrameNode from '../../ast/frame-node';
import KeyValueListNode from '../../ast/key-value-list-node';
import KeyValuePairListParser from './key-value-pair-list-parser';

export default class FrameDeclarationParser extends AbstractParser {

    // FRAME-DECLARATION ::= 'frame' IDENTIFIER '{' KEY-VALUE-PAIR-LIST '}'
    parse(parent: Node, parser: Parser): Node {
        const frame = parser.consumeToken();
        assertTokenType(frame, TokenType.FRAME)

        const nameToken = parser.consumeToken();
        assertSpecialToken(nameToken, TokenType.IDENTIFIER, 'frame name')

        const node = new FrameNode(nameToken.lexeme, parent);

        const leftBrace = parser.consumeToken();
        assertTokenType(leftBrace, TokenType.LEFT_BRACE)

        node.keyValueList = new KeyValuePairListParser().parse(node, parser) as KeyValueListNode;

        const rightBrace = parser.consumeToken();
        assertTokenType(rightBrace, TokenType.RIGHT_BRACE)

        return node;
    }
}