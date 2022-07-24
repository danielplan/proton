import { describe, expect, it } from 'vitest';
import Parser from '../src/interpreter/parser';
import Lexer from '../src/interpreter/lexer';
import FrameNode from '../src/interpreter/parser/ast/frame-node';
import KeyValuePairsNode from '../src/interpreter/parser/ast/key-value-pairs-node';
import NumberNode from '../src/interpreter/parser/ast/number-node';
import StringNode from '../src/interpreter/parser/ast/string-node';
import IdentifierNode from '../src/interpreter/parser/ast/identifier-node';
import ColorNode from '../src/interpreter/parser/ast/color-node';
import RatioNode from '../src/interpreter/parser/ast/ratio-node';

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

        const tokens2 = new Lexer('frame foo { } frame test { }').tokenize();
        const parser2 = new Parser(tokens2);
        const result2 = parser2.parse();
        const node2 = result2.children[0];
        expect(node2).toBeInstanceOf(FrameNode);
        const fNode2 = node2 as FrameNode;
        expect(fNode2.identifier.name).toBe('foo');
        expect(fNode2.keyValuePairs).toBeNull();
        const node3 = result2.children[1];
        expect(node3).toBeInstanceOf(FrameNode);
        const fNode3 = node3 as FrameNode;
        expect(fNode3.identifier.name).toBe('test');
        expect(fNode3.keyValuePairs).toBeNull();
    });

    it('should parse error on invalid top-level statement', () => {
        const tokens = new Lexer('frame foo { } frame {').tokenize();
        const parser = new Parser(tokens);
        expect(() => parser.parse()).toThrowError('Unexpected end of input.');

        const tokens2 = new Lexer('frame foo []').tokenize();
        const parser2 = new Parser(tokens2);
        expect(() => parser2.parse()).toThrowError('Expected "{"');
    });

    it('should parse key-value pairs', () => {
        const tokens = new Lexer('frame foo { key: 20px }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(FrameNode);

        const fNode = node as FrameNode;
        expect(fNode.identifier.name).toBe('foo');
        expect(fNode.keyValuePairs).toBeInstanceOf(KeyValuePairsNode);

        const kvpNode = fNode.keyValuePairs as KeyValuePairsNode;
        expect(kvpNode.pairs.size).toBe(1);

        const kvp = kvpNode.pairs;
        const number = kvp.get('key');
        expect(number).toBeInstanceOf(NumberNode);
        const nNumber = number as NumberNode;
        expect(nNumber.value).toBe(20);
        expect(nNumber.unit).toBe('px');

        const tokens2 = new Lexer('frame foo { key: 20px, key2: 20 }').tokenize();
        const parser2 = new Parser(tokens2);
        const result2 = parser2.parse();

        const node2 = result2.children[0];
        expect(node2).toBeInstanceOf(FrameNode);

        const fNode2 = node2 as FrameNode;
        expect(fNode2.identifier.name).toBe('foo');
        expect(fNode2.keyValuePairs).toBeInstanceOf(KeyValuePairsNode);

        const kvpNode2 = fNode2.keyValuePairs as KeyValuePairsNode;
        expect(kvpNode2.pairs.size).toBe(2);

        const kvp2 = kvpNode2.pairs;
        const number2 = kvp2.get('key');
        expect(number2).toBeInstanceOf(NumberNode);
        const nNumber2 = number2 as NumberNode;
        expect(nNumber2.value).toBe(20);
        expect(nNumber2.unit).toBe('px');
        const number3 = kvp2.get('key2');
        expect(number3).toBeInstanceOf(NumberNode);
        const nNumber3 = number3 as NumberNode;
        expect(nNumber3.value).toBe(20);
        expect(nNumber3.unit).toBeNull();
    });

    it('should parse error on invalid key-value pair', () => {
        const tokens = new Lexer('frame foo { key: 20px, }').tokenize();
        const parser = new Parser(tokens);
        expect(() => parser.parse()).toThrowError('Expected key, got: }');

        const tokens2 = new Lexer('frame foo { key: 20px, key2: }').tokenize();
        const parser2 = new Parser(tokens2);
        expect(() => parser2.parse()).toThrowError('Expected value, got: }');

        const tokens3 = new Lexer('frame foo { key: 20px, key2: 20px 10 }').tokenize();

        const parser3 = new Parser(tokens3);
        expect(() => parser3.parse()).toThrowError('Expected ",", got: NUMBER');
    });

    it('should parse string as value', () => {
        const tokens = new Lexer('frame foo { key: "string" }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(FrameNode);

        const fNode = node as FrameNode;
        expect(fNode.identifier.name).toBe('foo');
        expect(fNode.keyValuePairs).toBeInstanceOf(KeyValuePairsNode);

        const kvpNode = fNode.keyValuePairs as KeyValuePairsNode;
        expect(kvpNode.pairs.size).toBe(1);

        const kvp = kvpNode.pairs;
        const string = kvp.get('key');
        expect(string).toBeInstanceOf(StringNode);
        const sString = string as StringNode;
        expect(sString.value).toBe('string');
    });

    it('should parse an identifier', () => {
        const tokens = new Lexer('frame foo { key: value }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(FrameNode);

        const fNode = node as FrameNode;
        expect(fNode.identifier.name).toBe('foo');
        expect(fNode.keyValuePairs).toBeInstanceOf(KeyValuePairsNode);

        const kvpNode = fNode.keyValuePairs as KeyValuePairsNode;
        expect(kvpNode.pairs.size).toBe(1);

        const kvp = kvpNode.pairs;
        const identifier = kvp.get('key');
        expect(identifier).toBeInstanceOf(IdentifierNode);
        const iIdentifier = identifier as IdentifierNode;
        expect(iIdentifier.name).toBe('value');
    });

    it('should parse color', () => {
        const tokens = new Lexer('frame foo { key: #fff }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(FrameNode);

        const fNode = node as FrameNode;
        expect(fNode.identifier.name).toBe('foo');
        expect(fNode.keyValuePairs).toBeInstanceOf(KeyValuePairsNode);

        const kvpNode = fNode.keyValuePairs as KeyValuePairsNode;
        expect(kvpNode.pairs.size).toBe(1);

        const kvp = kvpNode.pairs;
        const color = kvp.get('key');
        expect(color).toBeInstanceOf(ColorNode);
        const cColor = color as ColorNode;
        expect(cColor.value).toBe('#fff');
    });

    it('should parse ratio', () => {
        const tokens = new Lexer('frame foo { key: 1/2 }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(FrameNode);

        const fNode = node as FrameNode;
        expect(fNode.identifier.name).toBe('foo');
        expect(fNode.keyValuePairs).toBeInstanceOf(KeyValuePairsNode);

        const kvpNode = fNode.keyValuePairs as KeyValuePairsNode;
        expect(kvpNode.pairs.size).toBe(1);

        const kvp = kvpNode.pairs;
        const ratio = kvp.get('key');
        expect(ratio).toBeInstanceOf(RatioNode);
        const rRatio = ratio as RatioNode;

        const left = rRatio.left;
        expect(left).toBeInstanceOf(NumberNode);
        const nLeft = left as NumberNode;
        expect(nLeft.value).toBe(1);

        const right = rRatio.right;
        expect(right).toBeInstanceOf(NumberNode);
        const nRight = right as NumberNode;
        expect(nRight.value).toBe(2);
    });
});
