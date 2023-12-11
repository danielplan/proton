import AbstractParser from './abstract-parser';
import Parser from '../index';
import Node from '../../ast/node';
import { TokenType } from '../../lexer/token';
import ParserError from '../parser-error';
import FrameDeclarationParser from './frame-declaration-parser';
import ComponentDeclarationParser from './component-declaration-parser';

export default class TopLevelDeclarationParser extends AbstractParser {
    // TOP-LEVEL-DECLARATION ::= FRAME-DECLARATION | COMPONENT-DECLARATION
    parse(parent: Node, parser: Parser): Node {
        const token = parser.peekToken();

        switch (token.type) {
            case TokenType.FRAME:
                return new FrameDeclarationParser().parse(parent, parser);
            case TokenType.COMPONENT:
                return new ComponentDeclarationParser().parse(parent, parser);
            default:
                throw new ParserError('top level declaration', token, false)
        }
    }
}