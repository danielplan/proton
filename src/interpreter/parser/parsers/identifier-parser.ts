import AbstractParser from './abstract-parser';
import { TokenType } from '../../lexer/token';
import { assertTokenType } from '../parser-error';
import Parser from '../index';
import Node from '../../ast/node';
import IdentifierNode from '../../ast/identifier-node';

export default class IdentifierParser extends AbstractParser {
    parse(parent: Node, parser: Parser): Node {
        const token = parser.consumeToken();
        assertTokenType(token, TokenType.IDENTIFIER)
        return new IdentifierNode(token.lexeme, parent);
    }
}