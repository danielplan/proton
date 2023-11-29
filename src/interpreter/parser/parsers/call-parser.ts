import Parsable from './parsable';
import { TokenType } from '../../lexer/token';
import ParserError from '../parser-error';
import CallNode from '../ast/call-node';
import Parser from '../index';

export default class CallParser implements Parsable {
    parse(parent: Node, parser: Parser): Node {
        const identifier = parser.consumeToken();
        if (identifier.type !== TokenType.IDENTIFIER)
            throw new ParserError('Expected identifier, got: ' + identifier.getTypeString());

        const node = new CallNode(identifier.lexeme, null, parent);

        const leftParen = parser.consumeToken();
        if (leftParen.type !== TokenType.LEFT_PAREN)
            throw new ParserError('Expected "(", got: ' + leftParen.getTypeString());

        node.keyValueList = this.parseKeyValuePairs(node);

        const rightParen = this.consumeToken();
        if (rightParen.type !== TokenType.RIGHT_PAREN)
            throw new ParserError('Expected ")", got: ' + rightParen.getTypeString());

        return node;
    }
}