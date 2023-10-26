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
import IdentifierListNode from './ast/identifier-list-node';
import ActionNode from './ast/action-node';

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

        const node = new FrameNode(nameToken.lexeme, root);

        const leftBrace = this.consumeToken();
        if (leftBrace.type !== TokenType.LEFT_BRACE)
            throw new ParserError('Expected "{", got ' + leftBrace.getTypeString());

        node.keyValueList = this.parseKeyValuePairs(node);

        const rightBrace = this.consumeToken();
        if (rightBrace.type !== TokenType.RIGHT_BRACE)
            throw new ParserError('Expected "}", got: ' + rightBrace.getTypeString());

        return node;
    }

    // COMPONENT-DECLARATION ::= 'component' IDENTIFIER '(' OPT-IDENTIFIER-LIST ')' 'from' CALL '{' KEY-VALUE-PAIRS '}' | 'component' IDENTIFIER '(' OPT-IDENTIFIER-LIST ')' '{' KEY-VALUE-PAIRS '}'
    private parseComponentDeclaration(root: Node): ComponentNode {
        const component = this.consumeToken();
        if (component.type !== TokenType.COMPONENT)
            throw new ParserError('Expected "component", got: ' + component.getTypeString());

        const identifier = this.consumeToken();
        if (identifier.type !== TokenType.IDENTIFIER)
            throw new ParserError('Expected component name, got: ' + identifier.getTypeString());

        const leftParen = this.consumeToken();
        if (leftParen.type !== TokenType.LEFT_PAREN)
            throw new ParserError('Expected "(", got: ' + leftParen.getTypeString());

        const node = new ComponentNode(identifier.lexeme, root);

        node.args = this.parseOptionalIdentifierList(node);

        const rightParen = this.consumeToken();
        if (rightParen.type !== TokenType.RIGHT_PAREN)
            throw new ParserError('Expected ")", got: ' + rightParen.getTypeString());

        if (this.peekToken().type === TokenType.FROM) {
            const fromToken = this.consumeToken();
            if (fromToken.type !== TokenType.FROM)
                throw new ParserError('Expected "from", got: ' + fromToken.getTypeString());
            node.layout = this.parseCall(node);
        }

        const leftBrace = this.consumeToken();
        if (leftBrace.type !== TokenType.LEFT_BRACE)
            throw new ParserError('Expected "{", got: ' + leftBrace.getTypeString());

        node.keyValueList = this.parseKeyValuePairs(node);

        const rightBrace = this.consumeToken();
        if (rightBrace.type !== TokenType.RIGHT_BRACE)
            throw new ParserError('Expected "}", got: ' + rightBrace.getTypeString());

        return node;
    }
    private parseOptionalIdentifierList(parent: ComponentNode): IdentifierListNode | null {
        if (this.peekToken().type === TokenType.IDENTIFIER) {
            return this.parseIdentifierList(parent);
        }
        return null;
    }

    // IDENTIFIER-LIST ::= IDENTIFIER | IDENTIFIER ',' IDENTIFIER-LIST
    private parseIdentifierList(parent: ComponentNode) {
        const identifiers = [];
        while (true) {
            const identifier = this.parseIdentifier(parent);
            identifiers.push(identifier);
            if (this.peekToken().type !== TokenType.COMMA) break;
            this.consumeToken();
        }
        return new IdentifierListNode(identifiers, parent);
    }

    // KEY-VALUE-PAIRS ::= KEY-VALUE-PAIR | KEY-VALUE-PAIRS ',' KEY-VALUE-PAIR | EMPTY
    private parseKeyValuePairs(parent: Node): KeyValueListNode {
        const result = new KeyValueListNode(parent);

        const opener = this.peekToken();
        if (opener.type === TokenType.RIGHT_BRACE || opener.type === TokenType.RIGHT_PAREN)
            //is empty
            return result;

        for (;;) {
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

        list.addChild(identifier.lexeme, this.parseValue(list));
    }

    // VALUE ::= NUMBER | NUMBER UNIT | COLOR | IDENTIFIER | RATIO | STRING | [ VALUE_LIST ] | { KEY-VALUE-PAIRS } | CALL | ACTION
    private parseValue(parent: Node): Node {
        const token = this.peekToken();
        switch (token.type) {
            case TokenType.NUMBER:
                return this.parseNumber(parent);
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
            case TokenType.LEFT_BRACE: {
                const leftBrace = this.consumeToken();
                if (leftBrace.type !== TokenType.LEFT_BRACE)
                    throw new ParserError('Expected "{", got: ' + leftBrace.getTypeString());

                const result = this.parseKeyValuePairs(parent);

                const rightBrace = this.consumeToken();
                if (rightBrace.type !== TokenType.RIGHT_BRACE)
                    throw new ParserError('Expected "}", got: ' + rightBrace.getTypeString());
                return result;
            }
            case TokenType.LEFT_BRACKET: {
                const leftBracket = this.consumeToken();
                if (leftBracket.type !== TokenType.LEFT_BRACKET)
                    throw new ParserError('Expected "[", got: ' + leftBracket.getTypeString());

                const valueList = this.parseValueList(parent);

                const rightBracket = this.consumeToken();
                if (rightBracket.type !== TokenType.RIGHT_BRACKET)
                    throw new ParserError('Expected "]", got: ' + rightBracket.getTypeString());
                return valueList;
            }
            default:
                throw new ParserError('Expected value, got: ' + token.getTypeString());
        }
    }

    // ACTION ::== IDENTIFIER '=>' VALUE
    private parseAction(parent: Node): Node {
        const identifier = this.consumeToken();
        if (identifier.type !== TokenType.IDENTIFIER)
            throw new ParserError('Expected action, got: ' + identifier.getTypeString());

        const arrow = this.consumeToken();
        if (arrow.type !== TokenType.ARROW) throw new ParserError('Expected "=>", got: ' + arrow.getTypeString());

        const value = this.parseValue(parent);
        return new ActionNode(identifier.lexeme, value, parent);
    }

    private parseValueList(parent: Node): ValueListNode {
        const values = [];
        const node = new ValueListNode(parent);
        for (;;) {
            values.push(this.parseValue(node));
            if (this.peekToken().type === TokenType.RIGHT_BRACKET) break;
            const comma = this.consumeToken();
            if (comma.type !== TokenType.COMMA) throw new ParserError('Expected ",", got: ' + comma.getTypeString());
        }
        node.values = values;
        return node;
    }

    private parseNumber(parent: Node): NumberNode | RatioNode {
        const number = Number.parseFloat(this.consumeToken().lexeme);
        const nextToken = this.peekToken();

        if (nextToken.type === TokenType.DIVIDE) {
            this.consumeToken();
            const rightToken = this.consumeToken();
            if (rightToken.type !== TokenType.NUMBER)
                throw new ParserError('Expected number, got: ' + rightToken.getTypeString());
            return new RatioNode(number, Number.parseFloat(rightToken.lexeme), parent);
        }

        let unit: string | null = null;
        switch (nextToken.type) {
            case TokenType.PERCENT:
            case TokenType.UNIT:
                unit = nextToken.lexeme;
                this.consumeToken();
                break;
        }

        return new NumberNode(number, unit, parent);
    }

    private parseIdentifier(parent: Node): IdentifierNode {
        const token = this.consumeToken();
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

    private consumeToken(): Token {
        const token = this.tokens.shift();
        if (token) return token;
        throw new ParserError('Unexpected end of input.');
    }

    private peekToken(amount: number = 0): Token {
        return this.tokens[amount];
    }
}
