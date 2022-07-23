import { describe, expect, it } from 'vitest';
import Parser from '../src/interpreter/parser';
import Lexer from '../src/interpreter/lexer';
import RootNode from '../src/interpreter/parser/ast/root-node';
import FrameNode from '../src/interpreter/parser/ast/frame-node';
import KeyValuePairsNode from '../src/interpreter/parser/ast/key-value-pairs-node';

describe('Parser', () => {
    it('should parse top-level statements', () => {
        const tokens = new Lexer('frame foo { }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();
        const node = result.children[0];
        expect(node).toBeInstanceOf(FrameNode);
        const fNode = node as FrameNode;
        expect(fNode.identifier.name).toBe('foo');
        expect(fNode.keyValuePairs).toBeNull();
    });
});
