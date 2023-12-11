import AbstractParser from './abstract-parser';
import Parser from '../index';
import Node from '../../ast/node';
import { TokenType } from '../../lexer/token';
import IdentifierListNode from '../../ast/identifier-list-node';
import NullNode from '../../ast/null-node';
import IdentifierParser from './identifier-parser';
import IdentifierNode from '../../ast/identifier-node';


export default class OptionalIdentifierListParser extends AbstractParser {

    // IDENTIFIER-LIST ::= IDENTIFIER | IDENTIFIER ',' IDENTIFIER-LIST
    parse(parent: Node, parser: Parser): Node {
        if (parser.peekToken().type === TokenType.IDENTIFIER) {
            return this.parseIdentifierList(parent, parser);
        }
        return new NullNode(parent);
    }

    private parseIdentifierList(parent: Node, parser: Parser) {
        const identifiers: IdentifierNode[] = [];
        while (true) {
            const identifier = new IdentifierParser().parse(parent, parser) as IdentifierNode;
            identifiers.push(identifier);
            if (parser.peekToken().type !== TokenType.COMMA) break;
            parser.consumeToken();
        }
        return new IdentifierListNode(identifiers, parent);
    }
}