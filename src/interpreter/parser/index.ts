import Token, { TokenType } from '../lexer/token';
import RootNode from './ast/root-node';
import Node from './ast/node';
import ParserError from './parser-error';
import FrameNode from './ast/frame-node';
import KeyValuePairsNode from './ast/key-value-pairs-node';
import NumberNode from './ast/number-node';

export default class Parser {
    tokens: Token[];
    pos: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    // PROGRAM ::= TOP-LEVEL-DECLARATIONS
    parse(): RootNode {
        const root = new RootNode();
        const children = this.parseTopLevelDeclarations(root);
        root.children = children;
        return root;
    }

    // TOP-LEVEL-DECLARATIONS ::= TOP-LEVEL-DECLARATION | TOP-LEVEL-DECLARATIONS TOP-LEVEL-DECLARATION
    private parseTopLevelDeclarations(root: Node): Node[] {
        const nodes: Node[] = [];
        while (this.tokens.length > 0) {
            nodes.push(this.parseTopLevelDeclaration(root));
        }
        return nodes;
    }

    // TOP-LEVEL-DECLARATION ::= FRAME-DECLARATION | COMPONENT-DECLARATION
    private parseTopLevelDeclaration(root: Node): Node {
        const token = this.getNextToken();

        switch (token.type) {
            case TokenType.FRAME:
                return this.parseFrameDeclaration(root);
            case TokenType.COMPONENT:
                return this.parseComponentDeclaration(root);
            default:
                throw new ParserError('Unexpected token: ' + token.getTypeString());
        }
    }

    // FRAME-DECLARATION ::= 'frame' IDENTIFIER '{' KEY-VALUE-PAIRS '}'
    private parseFrameDeclaration(root: Node): Node {
        const nameToken = this.getNextToken();
        if (this.getNextToken().type !== TokenType.LEFT_BRACE) throw new ParserError('Expected "{"');

        const keyValuePairs = this.parseKeyValuePairs();
        if (this.getNextToken().type !== TokenType.RIGHT_BRACE) {
            throw new ParserError('Expected "}"');
        }

        return new FrameNode(nameToken.lexeme, keyValuePairs, root);
    }

    // COMPONENT-DECLARATION ::= 'component' IDENTIFIER '{' KEY-VALUE-PAIRS '}'
    private parseComponentDeclaration(root: Node): Node {
        throw new Error('Method not implemented.');
    }

    // KEY-VALUE-PAIRS ::= KEY-VALUE-PAIR | KEY-VALUE-PAIRS ',' KEY-VALUE-PAIR | EMPTY
    // KEY-VALUE-PAIR ::= IDENTIFIER ':' VALUE
    private parseKeyValuePairs(): KeyValuePairsNode | null {
        const nextToken = this.peekNextToken();
        if (nextToken.type === TokenType.RIGHT_BRACE) return null;
        const node = new KeyValuePairsNode();
        while (true) {
            const identifier = this.getNextToken();
            if (identifier.type !== TokenType.IDENTIFIER)
                throw new ParserError('Expected identifier, got: ' + identifier.getTypeString());
            if (this.getNextToken().type !== TokenType.COLON)
                throw new ParserError('Expected ":", got: ' + this.getNextToken().getTypeString());
            node.add(identifier.lexeme, this.parseValue());

            if (this.peekNextToken().type === TokenType.RIGHT_BRACE) break;
            if (this.getNextToken().type !== TokenType.COMMA)
                throw new ParserError('Expected ",", got: ' + this.getNextToken().getTypeString());
        }
        return node;
    }

    // VALUE ::= NUMBER | NUMBER UNIT | COLOR | IDENTIFIER
    private parseValue(): Node {
        if (this.peekNextToken().type === TokenType.NUMBER) {
            return this.parseNumber();
        }
        if (this.peekNextToken().type === TokenType.IDENTIFIER) {
            return this.parseIdentifier();
        }
        throw new ParserError('Unexpected token: ' + this.peekNextToken().getTypeString());
    }

    private parseIdentifier(): Node {
        throw new Error('Method not implemented.');
    }

    private parseNumber(): NumberNode {
        const number = this.getNextToken();
        const unitToken = this.peekNextToken();
        let unit: string | null = null;
        if (unitToken.type === TokenType.UNIT) {
            this.getNextToken();
            unit = unitToken.lexeme;
        }

        return new NumberNode(Number.parseFloat(number.lexeme), unit);
    }

    private getNextToken(): Token {
        const token = this.tokens.shift();
        if (token) return token;
        throw new ParserError('Unexpected end of input.');
    }

    private peekNextToken(): Token {
        return this.tokens[0];
    }
}
