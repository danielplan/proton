import Parsable from './parsable';
import Node from '../ast/node';
import Parser from '../index';
import { TokenType } from '../../lexer/token';
import ParserError from '../parser-error';
import IdentifierNode from '../ast/identifier-node';
import CallNode from '../ast/call-node';
import ActionNode from '../ast/action-node';

export default class IdentifierValueParser implements Parsable {
    parse(parent: Node, parser: Parser): Node {

        if (parser.peekToken(1).type === TokenType.LEFT_PAREN) return this.parseCall(parent);
        if (parser.peekToken(1).type === TokenType.ARROW) return this.parseAction(parent);
        return this.parseIdentifier(parent);
    }

    private parseIdentifier(parent: Node): Node {
        const token = parser.consumeToken();
        if (token.type !== TokenType.IDENTIFIER)
            throw new ParserError('Expected identifier, got: ' + token.getTypeString());
        return new IdentifierNode(token.lexeme, parent);
    }

    private parseCall(parent: Node): CallNode {
        const identifier = this.consumeToken();
        if (identifier.type !== TokenType.IDENTIFIER)
            throw new ParserError('Expected identifier, got: ' + identifier.getTypeString());

        const node = new CallNode(identifier.lexeme, null, parent);

        const leftParen = this.consumeToken();
        if (leftParen.type !== TokenType.LEFT_PAREN)
            throw new ParserError('Expected "(", got: ' + leftParen.getTypeString());

        node.keyValueList = this.parseKeyValuePairs(node);

        const rightParen = this.consumeToken();
        if (rightParen.type !== TokenType.RIGHT_PAREN)
            throw new ParserError('Expected ")", got: ' + rightParen.getTypeString());

        return node;
    }

    private parseAction(parent: Node): Node {
        const identifier = this.consumeToken();
        if (identifier.type !== TokenType.IDENTIFIER)
            throw new ParserError('Expected action, got: ' + identifier.getTypeString());

        const arrow = this.consumeToken();
        if (arrow.type !== TokenType.ARROW) throw new ParserError('Expected "=>", got: ' + arrow.getTypeString());

        const value = this.parseValue(parent);
        return new ActionNode(identifier.lexeme, value, parent);
    }
}