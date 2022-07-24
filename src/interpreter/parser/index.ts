import Token, { TokenType } from '../lexer/token';
import RootNode from './ast/root-node';
import Node from './ast/node';
import ParserError from './parser-error';
import FrameNode from './ast/frame-node';
import KeyValuePairsNode from './ast/key-value-pairs-node';
import NumberNode from './ast/number-node';
import IdentifierNode from './ast/identifier-node';
import StringNode from './ast/string-node';
import ColorNode from './ast/color-node';
import RatioNode from './ast/ratio-node';

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
        const token = this.consumeToken();

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
        const nameToken = this.consumeToken();
        if (this.consumeToken().type !== TokenType.LEFT_BRACE) throw new ParserError('Expected "{"');

        const keyValuePairs = this.parseKeyValuePairs();
        if (this.consumeToken().type !== TokenType.RIGHT_BRACE) {
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
        const nextToken = this.peekToken();
        if (nextToken.type === TokenType.RIGHT_BRACE) return null;
        const node = new KeyValuePairsNode();
        while (true) {
            const identifier = this.consumeToken();
            if (identifier.type !== TokenType.IDENTIFIER)
                throw new ParserError('Expected key, got: ' + identifier.getTypeString());

            const colon = this.consumeToken();
            if (colon.type !== TokenType.COLON) throw new ParserError('Expected ":", got: ' + colon.getTypeString());

            node.add(identifier.lexeme, this.parseValue());

            if (this.peekToken().type === TokenType.RIGHT_BRACE) break;
            const comma = this.consumeToken();
            if (comma.type !== TokenType.COMMA) throw new ParserError('Expected ",", got: ' + comma.getTypeString());
        }
        return node;
    }

    // VALUE ::= NUMBER | NUMBER UNIT | COLOR | IDENTIFIER | RATIO | STRING
    private parseValue(): Node {
        const token = this.peekToken();
        switch (token.type) {
            case TokenType.NUMBER:
                return this.parseNumber();
            case TokenType.IDENTIFIER:
                this.consumeToken();
                return new IdentifierNode(token.lexeme);
            case TokenType.STRING:
                this.consumeToken();
                return new StringNode(token.lexeme.substring(1, token.lexeme.length - 1));
            case TokenType.COLOR:
                this.consumeToken();
                return new ColorNode(token.lexeme);
            default:
                throw new ParserError('Expected value, got: ' + token.getTypeString());
        }
    }

    private parseNumber(): NumberNode | RatioNode {
        const number = Number.parseFloat(this.consumeToken().lexeme);
        const nextToken = this.peekToken();

        if (nextToken.type === TokenType.DIVIDE) {
            this.consumeToken();
            const rightToken = this.consumeToken();
            if (rightToken.type !== TokenType.NUMBER)
                throw new ParserError('Expected number, got: ' + rightToken.getTypeString());
            return new RatioNode(number, Number.parseFloat(rightToken.lexeme));
        }

        let unit: string | null = null;
        switch (nextToken.type) {
            case TokenType.PERCENT:
            case TokenType.UNIT:
                unit = nextToken.lexeme;
                this.consumeToken();
                break;
        }

        return new NumberNode(number, unit);
    }

    private consumeToken(): Token {
        const token = this.tokens.shift();
        if (token) return token;
        throw new ParserError('Unexpected end of input.');
    }

    private peekToken(): Token {
        return this.tokens[0];
    }
}
