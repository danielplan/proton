import Parsable from './parsable';
import Parser from '../index';
import { TokenType } from '../../lexer/token';
import StringNode from '../ast/string-node';
import ColorNode from '../ast/color-node';
import ParserError from '../parser-error';
import NumberParser from './number-parser';
import Node from '../ast/node';

export default class ValueParser implements Parsable {


    parse(parent: Node, parser: Parser) {

        const token = parser.peekToken();
        switch (token.type) {
            case TokenType.NUMBER:
                return new NumberParser().parse(parent, parser);
            case TokenType.IDENTIFIER:
                if (this.peekToken(1).type === TokenType.LEFT_PAREN) return this.parseCall(parent);
                if (this.peekToken(1).type === TokenType.ARROW) return this.parseAction(parent);
                return this.parseIdentifier(parent);
            case TokenType.STRING:
                this.consumeToken();
                return new StringNode(token.lexeme.substring(1, token.lexeme.length - 1), parent);
            case TokenType.COLOR:
                this.consumeToken();
                return new ColorNode(token.lexeme, parent);
            case TokenType.LEFT_BRACE:
                const leftBrace = this.consumeToken();
                if (leftBrace.type !== TokenType.LEFT_BRACE)
                    throw new ParserError('Expected "{", got: ' + leftBrace.getTypeString());

                const result = this.parseKeyValuePairs(parent);

                const rightBrace = this.consumeToken();
                if (rightBrace.type !== TokenType.RIGHT_BRACE)
                    throw new ParserError('Expected "}", got: ' + rightBrace.getTypeString());
                return result;
            case TokenType.LEFT_BRACKET:
                const leftBracket = this.consumeToken();
                if (leftBracket.type !== TokenType.LEFT_BRACKET)
                    throw new ParserError('Expected "[", got: ' + leftBracket.getTypeString());

                const valueList = this.parseValueList(parent);

                const rightBracket = this.consumeToken();
                if (rightBracket.type !== TokenType.RIGHT_BRACKET)
                    throw new ParserError('Expected "]", got: ' + rightBracket.getTypeString());
                return valueList;
            default:
                throw new ParserError('Expected value, got: ' + token.getTypeString());
        }
    }
}