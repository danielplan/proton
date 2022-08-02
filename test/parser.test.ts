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
import CallNode from '../src/interpreter/parser/ast/call-node';
import ValueListNode from '../src/interpreter/parser/ast/value-list-node';
import ComponentNode from '../src/interpreter/parser/ast/component-node';

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

    it('should parse nested key-value-pairs', () => {
        const tokens = new Lexer('frame foo { key: { key2: 20px } }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(FrameNode);

        const fNode = node as FrameNode;
        expect(fNode.identifier.name).toBe('foo');

        const kvpNode = fNode.keyValuePairs as KeyValuePairsNode;
        expect(kvpNode.pairs.size).toBe(1);

        const kvp = kvpNode.pairs;
        const kvp2 = kvp.get('key');
        expect(kvp2).toBeInstanceOf(KeyValuePairsNode);

        const kvp3 = kvp2 as KeyValuePairsNode;
        expect(kvp3.pairs.size).toBe(1);

        const kvp4 = kvp3.pairs;
        const kvp5 = kvp4.get('key2');
        expect(kvp5).toBeInstanceOf(NumberNode);
        const nKvp5 = kvp5 as NumberNode;
        expect(nKvp5.value).toBe(20);
    });

    it('should parse calls', () => {
        const tokens = new Lexer('frame foo { key: call(bar: 10) }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(FrameNode);

        const fNode = node as FrameNode;
        expect(fNode.identifier.name).toBe('foo');

        const kvpNode = fNode.keyValuePairs as KeyValuePairsNode;
        expect(kvpNode.pairs.size).toBe(1);

        const kvp = kvpNode.pairs;
        const call = kvp.get('key');
        expect(call).toBeInstanceOf(CallNode);

        const cCall = call as CallNode;
        expect(cCall.left.name).toBe('call');
        expect(cCall.right.pairs.size).toBe(1);

        const arg = cCall.right.pairs.get('bar');
        expect(arg).toBeInstanceOf(NumberNode);
        const nArg = arg as NumberNode;
        expect(nArg.value).toBe(10);
    });

    it('should parse nested calls', () => {
        const tokens = new Lexer('frame foo { key: call(bar: call(baz: 10)) }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(FrameNode);

        const fNode = node as FrameNode;
        expect(fNode.identifier.name).toBe('foo');

        const kvpNode = fNode.keyValuePairs as KeyValuePairsNode;
        expect(kvpNode.pairs.size).toBe(1);

        const kvp = kvpNode.pairs;
        const call = kvp.get('key');
        expect(call).toBeInstanceOf(CallNode);

        const cCall = call as CallNode;
        expect(cCall.left.name).toBe('call');
        expect(cCall.right.pairs.size).toBe(1);

        const arg = cCall.right.pairs.get('bar');
        expect(arg).toBeInstanceOf(CallNode);

        const cArg = arg as CallNode;
        expect(cArg.left.name).toBe('call');
        expect(cArg.right.pairs.size).toBe(1);

        const arg2 = cArg.right.pairs.get('baz');
        expect(arg2).toBeInstanceOf(NumberNode);
        const nArg2 = arg2 as NumberNode;
        expect(nArg2.value).toBe(10);
    });

    it('should parse value-lists', () => {
        const tokens = new Lexer('frame foo { key: [10, 20, 30] }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(FrameNode);

        const fNode = node as FrameNode;
        expect(fNode.identifier.name).toBe('foo');

        const kvpNode = fNode.keyValuePairs as KeyValuePairsNode;
        expect(kvpNode.pairs.size).toBe(1);

        const kvp = kvpNode.pairs;
        const list = kvp.get('key');
        expect(list).toBeInstanceOf(ValueListNode);

        const vList = list as ValueListNode;
        expect(vList.children.length).toBe(3);

        const v1 = vList.children[0];
        expect(v1).toBeInstanceOf(NumberNode);
        const nV1 = v1 as NumberNode;

        const v2 = vList.children[1];
        expect(v2).toBeInstanceOf(NumberNode);
        const nV2 = v2 as NumberNode;

        const v3 = vList.children[2];
        expect(v3).toBeInstanceOf(NumberNode);
        const nV3 = v3 as NumberNode;

        expect(nV1.value).toBe(10);
        expect(nV2.value).toBe(20);
        expect(nV3.value).toBe(30);
    });

    it('should parse components', () => {
        const tokens = new Lexer('component Foo from Row() { }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(ComponentNode);

        const cNode = node as ComponentNode;
        expect(cNode.identifier.name).toBe('Foo');

        expect(cNode.layout).toBeInstanceOf(CallNode);
        const cCall = cNode.layout as CallNode;

        expect(cCall.left.name).toBe('Row');
        expect(cCall.right).toBeNull();
    });

    it('should parse components with arguments', () => {
        const tokens = new Lexer('component Foo from Row(foo: 10, bar: 20) { }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(ComponentNode);

        const cNode = node as ComponentNode;
        expect(cNode.identifier.name).toBe('Foo');

        expect(cNode.layout).toBeInstanceOf(CallNode);
        const cCall = cNode.layout as CallNode;

        expect(cCall.left.name).toBe('Row');
        expect(cCall.right.pairs.size).toBe(2);

        const p1 = cCall.right.pairs.get('foo');
        expect(p1).toBeInstanceOf(NumberNode);
        const nP1 = p1 as NumberNode;
        expect(nP1.value).toBe(10);

        const p2 = cCall.right.pairs.get('bar');
        expect(p2).toBeInstanceOf(NumberNode);
        const nP2 = p2 as NumberNode;
        expect(nP2.value).toBe(20);
    });

    it('should parse components with content', () => {
        const tokens = new Lexer('component Foo from Row() { foo: 10 }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(ComponentNode);

        const cNode = node as ComponentNode;
        expect(cNode.identifier.name).toBe('Foo');

        expect(cNode.layout).toBeInstanceOf(CallNode);
        const cCall = cNode.layout as CallNode;

        expect(cCall.left.name).toBe('Row');
        expect(cCall.right).toBeNull();

        expect(cNode.keyValuePairs).toBeInstanceOf(KeyValuePairsNode);
        const cKvp = cNode.keyValuePairs as KeyValuePairsNode;

        expect(cKvp.pairs.size).toBe(1);
        const cKvpPair = cKvp.pairs.get('foo');
        expect(cKvpPair).toBeInstanceOf(NumberNode);
        const cKvpPairNumber = cKvpPair as NumberNode;
        expect(cKvpPairNumber.value).toBe(10);
    });
});
