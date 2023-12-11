import AbstractParser from './abstract-parser';
import { TokenType } from '../../lexer/token';
import { assertTokenType } from '../parser-error';
import Parser from '../index';
import Node from '../../ast/node';
import ActionNode from '../../ast/action-node';
import ValueParser from './value-parser';

export default class ActionParser extends AbstractParser {
    // ACTION ::== IDENTIFIER '=>' VALUE
    parse(parent: Node, parser: Parser): Node {
        const identifier = parser.consumeToken();
        assertTokenType(identifier, TokenType.IDENTIFIER)

        const arrow = parser.consumeToken();
        assertTokenType(arrow, TokenType.ARROW)

        const value = new ValueParser().parse(parent, parser);
        return new ActionNode(identifier.lexeme, value, parent);
    }
}