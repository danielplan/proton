import Token from '../lexer/token';
import RootNode from '../ast/root-node';
import Node from '../ast/node';
import TopLevelDeclarationParser from './parsers/top-level-declaration-parser';

export default class Parser {
    tokens: Token[];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    // PROGRAM ::= TOP-LEVEL-DECLARATIONS
    public parse(): RootNode {
        const root = new RootNode();
        const nodes: Node[] = [];
        while (this.hasTokens()) {
            nodes.push(new TopLevelDeclarationParser().parse(root, this));
        }
        root.children = nodes;
        return root;
    }


    public consumeToken(): Token {
        const token = this.tokens.shift();
        if (token) return token;
        throw new Error('Unexpected end of file');
    }

    public peekToken(amount: number = 0): Token {
        return this.tokens[amount];
    }

    public hasTokens(): boolean {
        return this.tokens.length > 0;
    }
}
