import AbstractParser from './abstract-parser';
import { TokenType } from '../../lexer/token';
import { assertTokenType } from '../parser-error';
import CallNode from '../../ast/call-node';
import Parser from '../index';
import Node from '../../ast/node';
import KeyValuePairListParser from './key-value-pair-list-parser';
import KeyValueListNode from '../../ast/key-value-list-node';
import ComponentNode from '../../ast/component-node';
import CallParser from './call-parser';
import IdentifierListNode from '../../ast/identifier-list-node';
import OptionalIdentifierListParser from './optional-identifier-list-parser';

export default class ComponentDeclarationParser extends AbstractParser {

    // COMPONENT-DECLARATION ::= 'component' IDENTIFIER '(' OPT-IDENTIFIER-LIST ')' 'from' CALL '{' KEY-VALUE-PAIR-LIST '}' | 'component' IDENTIFIER '(' OPT-IDENTIFIER-LIST ')' '{' KEY-VALUE-PAIR-LIST '}'
    parse(parent: Node, parser: Parser): Node {
        const component = parser.consumeToken();
        assertTokenType(component, TokenType.COMPONENT)

        const identifier = parser.consumeToken();
        assertTokenType(identifier, TokenType.IDENTIFIER)

        const leftParen = parser.consumeToken();
        assertTokenType(leftParen, TokenType.LEFT_PAREN)

        const node = new ComponentNode(identifier.lexeme, parent);

        node.args = new OptionalIdentifierListParser().parse(node, parser) as IdentifierListNode;

        const rightParen = parser.consumeToken();
        assertTokenType(rightParen, TokenType.RIGHT_PAREN)

        if (parser.peekToken().type === TokenType.FROM) {
            const fromToken = parser.consumeToken();
            assertTokenType(fromToken, TokenType.FROM)
            node.layout = new CallParser().parse(node, parser) as CallNode;
        }

        const leftBrace = parser.consumeToken();
        assertTokenType(leftBrace, TokenType.LEFT_BRACE)

        node.keyValueList = new KeyValuePairListParser().parse(node, parser) as KeyValueListNode

        const rightBrace = parser.consumeToken();
        assertTokenType(rightBrace, TokenType.RIGHT_BRACE)

        return node;
    }
}