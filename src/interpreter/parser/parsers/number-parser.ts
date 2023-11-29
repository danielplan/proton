import Parsable from './parsable';
import Node from '../ast/node';
import NumberNode from '../ast/number-node';
import RatioNode from '../ast/ratio-node';
import { TokenType } from '../../lexer/token';
import ParserError from '../parser-error';
import Parser from '../index';

export default class NumberParser implements Parsable {
    parse(parent: Node, parser: Parsable): Node {
        const number = Number.parseFloat(parser.consumeToken().lexeme);
        const nextToken = parser.peekToken();

        if (nextToken.type === TokenType.DIVIDE) {
            parser.consumeToken();
            const rightToken = parser.consumeToken();
            if (rightToken.type !== TokenType.NUMBER)
                throw new ParserError('Expected number, got: ' + rightToken.getTypeString());
            return new RatioNode(number, Number.parseFloat(rightToken.lexeme), parent);
        }

        let unit: string | null = null;
        switch (nextToken.type) {
            case TokenType.PERCENT:
            case TokenType.UNIT:
                unit = nextToken.lexeme;
                parser.consumeToken();
                break;
        }

        return new NumberNode(number, unit, parent);
    }
}