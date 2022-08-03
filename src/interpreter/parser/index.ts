import Token, { TokenType } from '../lexer/token';
import RootNode from './ast/root-node';
import Node from './ast/node';
import ParserError from './parser-error';
import FrameNode from './ast/frame-node';
import KeyValueListNode from './ast/key-value-list-node';
import NumberNode from './ast/number-node';
import IdentifierNode from './ast/identifier-node';
import StringNode from './ast/string-node';
import ColorNode from './ast/color-node';
import RatioNode from './ast/ratio-node';
import CallNode from './ast/call-node';
import ValueListNode from './ast/value-list-node';
import ComponentNode from './ast/component-node';

export default class Parser {
    tokens: Token[];
    pos: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    // PROGRAM ::= TOP-LEVEL-DECLARATIONS
    public parse(): RootNode {
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
        const token = this.peekToken();

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
        const frame = this.consumeToken();
        if (frame.type !== TokenType.FRAME) throw new ParserError('Expected "frame", got: ' + frame.getTypeString());

        const nameToken = this.consumeToken();
        if (nameToken.type !== TokenType.IDENTIFIER)
            throw new ParserError('Expected frame name, got: ' + nameToken.getTypeString());

        const leftBrace = this.consumeToken();
        if (leftBrace.type !== TokenType.LEFT_BRACE)
            throw new ParserError('Expected "{", got ' + leftBrace.getTypeString());

        const keyValuePairs = this.parseKeyValuePairs();

        const rightBrace = this.consumeToken();
        if (rightBrace.type !== TokenType.RIGHT_BRACE)
            throw new ParserError('Expected "}", got: ' + rightBrace.getTypeString());

        return new FrameNode(nameToken.lexeme, keyValuePairs, root);
    }

    // COMPONENT-DECLARATION ::= 'component' IDENTIFIER 'from' CALL '{' KEY-VALUE-PAIRS '}'
    private parseComponentDeclaration(root: Node): ComponentNode {
        const component = this.consumeToken();
        if (component.type !== TokenType.COMPONENT)
            throw new ParserError('Expected "component", got: ' + component.getTypeString());

        const identifier = this.consumeToken();
        if (identifier.type !== TokenType.IDENTIFIER)
            throw new ParserError('Expected component name, got: ' + identifier.getTypeString());
        const fromToken = this.consumeToken();
        if (fromToken.type !== TokenType.FROM)
            throw new ParserError('Expected "from", got: ' + fromToken.getTypeString());

        const call = this.parseCall();

        const leftBrace = this.consumeToken();
        if (leftBrace.type !== TokenType.LEFT_BRACE)
            throw new ParserError('Expected "{", got: ' + leftBrace.getTypeString());

        const keyValuePairs = this.parseKeyValuePairs();

        const rightBrace = this.consumeToken();
        if (rightBrace.type !== TokenType.RIGHT_BRACE)
            throw new ParserError('Expected "}", got: ' + rightBrace.getTypeString());

        return new ComponentNode(identifier.lexeme, call, keyValuePairs, root);
    }

    // KEY-VALUE-PAIRS ::= KEY-VALUE-PAIR | KEY-VALUE-PAIRS ',' KEY-VALUE-PAIR | EMPTY
    private parseKeyValuePairs(): KeyValueListNode {
        const result = new KeyValueListNode();

        const opener = this.peekToken();
        if (opener.type === TokenType.RIGHT_BRACE || opener.type === TokenType.RIGHT_PAREN)
            //is empty
            return result;

        while (true) {
            this.parseKeyValuePair(result);
            if (this.peekToken().type === TokenType.RIGHT_BRACE || this.peekToken().type === TokenType.RIGHT_PAREN)
                break;
            const comma = this.consumeToken();
            if (comma.type !== TokenType.COMMA) throw new ParserError('Expected ",", got: ' + comma.getTypeString());
        }
        return result;
    }

    // KEY-VALUE-PAIR ::= IDENTIFIER ':' VALUE
    private parseKeyValuePair(list: KeyValueListNode): void {
        const identifier = this.consumeToken();
        if (identifier.type !== TokenType.IDENTIFIER)
            throw new ParserError('Expected key, got: ' + identifier.getTypeString());

        const colon = this.consumeToken();
        if (colon.type !== TokenType.COLON) throw new ParserError('Expected ":", got: ' + colon.getTypeString());

        list.addChild(identifier.lexeme, this.parseValue());
    }

    // VALUE ::= NUMBER | NUMBER UNIT | COLOR | IDENTIFIER | RATIO | STRING | [ VALUE_LIST ] | { KEY-VALUE-PAIRS } | CALL
    private parseValue(): Node {
        const token = this.peekToken();
        switch (token.type) {
            case TokenType.NUMBER:
                return this.parseNumber();
            case TokenType.IDENTIFIER:
                if (this.peekToken(1).type === TokenType.LEFT_PAREN) return this.parseCall();
                return this.parseIdentifier();
            case TokenType.STRING:
                this.consumeToken();
                return new StringNode(token.lexeme.substring(1, token.lexeme.length - 1));
            case TokenType.COLOR:
                this.consumeToken();
                return new ColorNode(token.lexeme);
            case TokenType.LEFT_BRACE:
                const leftBrace = this.consumeToken();
                if (leftBrace.type !== TokenType.LEFT_BRACE)
                    throw new ParserError('Expected "{", got: ' + leftBrace.getTypeString());

                const result = this.parseKeyValuePairs();

                const rightBrace = this.consumeToken();
                if (rightBrace.type !== TokenType.RIGHT_BRACE)
                    throw new ParserError('Expected "}", got: ' + rightBrace.getTypeString());
                return result;
            case TokenType.LEFT_BRACKET:
                const leftBracket = this.consumeToken();
                if (leftBracket.type !== TokenType.LEFT_BRACKET)
                    throw new ParserError('Expected "[", got: ' + leftBracket.getTypeString());

                const valueList = this.parseValueList();

                const rightBracket = this.consumeToken();
                if (rightBracket.type !== TokenType.RIGHT_BRACKET)
                    throw new ParserError('Expected "]", got: ' + rightBracket.getTypeString());
                return valueList;
            default:
                throw new ParserError('Expected value, got: ' + token.getTypeString());
        }
    }
    private parseValueList(): ValueListNode {
        const values = [];
        while (true) {
            values.push(this.parseValue());
            if (this.peekToken().type === TokenType.RIGHT_BRACKET) break;
            const comma = this.consumeToken();
            if (comma.type !== TokenType.COMMA) throw new ParserError('Expected ",", got: ' + comma.getTypeString());
        }
        return new ValueListNode(values);
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

    private parseIdentifier(): IdentifierNode {
        const token = this.consumeToken();
        if (token.type !== TokenType.IDENTIFIER)
            throw new ParserError('Expected identifier, got: ' + token.getTypeString());
        return new IdentifierNode(token.lexeme);
    }

    private parseCall(): CallNode {
        const identifier = this.consumeToken();
        if (identifier.type !== TokenType.IDENTIFIER)
            throw new ParserError('Expected identifier, got: ' + identifier.getTypeString());

        const leftParen = this.consumeToken();
        if (leftParen.type !== TokenType.LEFT_PAREN)
            throw new ParserError('Expected "(", got: ' + leftParen.getTypeString());

        const args = this.parseKeyValuePairs();

        const rightParen = this.consumeToken();
        if (rightParen.type !== TokenType.RIGHT_PAREN)
            throw new ParserError('Expected ")", got: ' + rightParen.getTypeString());

        return new CallNode(identifier.lexeme, args);
    }

    private consumeToken(): Token {
        const token = this.tokens.shift();
        if (token) return token;
        throw new ParserError('Unexpected end of input.');
    }

    private peekToken(amount: number = 0): Token {
        return this.tokens[amount];
    }
}
