import AbstractParser from './abstract-parser';
import { TokenType } from '../../lexer/token';
import { assertTokenType } from '../parser-error';
import Parser from '../index';
import Node from '../../ast/node';
import KeyValueListNode from '../../ast/key-value-list-node';
import KeyValuePairParser from './key-value-pair-parser';

export default class KeyValuePairListParser extends AbstractParser {
    // KEY-VALUE-PAIR-LIST ::= KEY-VALUE-PAIR | KEY-VALUE-PAIR-LIST ',' KEY-VALUE-PAIR | EMPTY
    parse(parent: Node, parser: Parser): Node {
        const result = new KeyValueListNode(parent);

        const opener = parser.peekToken();
        if (opener.type === TokenType.RIGHT_BRACE || opener.type === TokenType.RIGHT_PAREN)
            //is empty
            return result;

        while (true) {
            new KeyValuePairParser().parse(result, parser);
            if (parser.peekToken().type === TokenType.RIGHT_BRACE || parser.peekToken().type === TokenType.RIGHT_PAREN)
                break;
            const comma = parser.consumeToken();
            assertTokenType(comma, TokenType.COMMA)
        }
        return result;
    }
}