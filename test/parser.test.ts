import { describe, expect, it } from 'vitest';
import Parser from '../src/interpreter/parser';
import Lexer from '../src/interpreter/lexer';
import FrameNode from '../src/interpreter/ast/frame-node';
import NumberNode from '../src/interpreter/ast/number-node';
import StringNode from '../src/interpreter/ast/string-node';
import IdentifierNode from '../src/interpreter/ast/identifier-node';
import ColorNode from '../src/interpreter/ast/color-node';
import RatioNode from '../src/interpreter/ast/ratio-node';
import CallNode from '../src/interpreter/ast/call-node';
import ValueListNode from '../src/interpreter/ast/value-list-node';
import ComponentNode from '../src/interpreter/ast/component-node';
import KeyValueListNode from '../src/interpreter/ast/key-value-list-node';
import ActionNode from '../src/interpreter/ast/action-node';

describe('Parser', () => {
    it('should parse top-level statements', () => {
        const tokens = new Lexer('frame foo { }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();
        const node = result.children[0];
        expect(node).toBeInstanceOf(FrameNode);
        const fNode = node as FrameNode;
        expect(fNode.identifier.name).toBe('foo');
        expect(fNode.keyValueList!.children.size).toBe(0);

        const tokens2 = new Lexer('frame foo { } frame test { }').tokenize();
        const parser2 = new Parser(tokens2);
        const result2 = parser2.parse();
        const node2 = result2.children[0];
        expect(node2).toBeInstanceOf(FrameNode);
        const fNode2 = node2 as FrameNode;
        expect(fNode2.identifier.name).toBe('foo');
        expect(fNode2.keyValueList!.children.size).toBe(0);
        const node3 = result2.children[1];
        expect(node3).toBeInstanceOf(FrameNode);
        const fNode3 = node3 as FrameNode;
        expect(fNode3.identifier.name).toBe('test');
        expect(fNode3.keyValueList!.children.size).toBe(0);
    });

    it('should parse error on invalid top-level statement', () => {
        const tokens = new Lexer('frame foo { } frame {').tokenize();
        const parser = new Parser(tokens);
        expect(() => parser.parse()).toThrowError('Expected frame name, got: {');

        const tokens2 = new Lexer('frame foo []').tokenize();
        const parser2 = new Parser(tokens2);
        expect(() => parser2.parse()).toThrowError('Expected "{"');
    });

    it('should parse key-value children', () => {
        const tokens = new Lexer('frame foo { key: 20px }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(FrameNode);

        const fNode = node as FrameNode;
        expect(fNode.identifier.name).toBe('foo');
        expect(fNode.keyValueList).toBeInstanceOf(KeyValueListNode);

        const kvpNode = fNode.keyValueList as KeyValueListNode;
        expect(kvpNode.children.size).toBe(1);

        const kvp = kvpNode.children;
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
        expect(fNode2.keyValueList).toBeInstanceOf(KeyValueListNode);

        const kvpNode2 = fNode2.keyValueList as KeyValueListNode;
        expect(kvpNode2.children.size).toBe(2);

        const kvp2 = kvpNode2.children;
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
        expect(fNode.keyValueList).toBeInstanceOf(KeyValueListNode);

        const kvpNode = fNode.keyValueList as KeyValueListNode;
        expect(kvpNode.children.size).toBe(1);

        const kvp = kvpNode.children;
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
        expect(fNode.keyValueList).toBeInstanceOf(KeyValueListNode);

        const kvpNode = fNode.keyValueList as KeyValueListNode;
        expect(kvpNode.children.size).toBe(1);

        const kvp = kvpNode.children;
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
        expect(fNode.keyValueList).toBeInstanceOf(KeyValueListNode);

        const kvpNode = fNode.keyValueList as KeyValueListNode;
        expect(kvpNode.children.size).toBe(1);

        const kvp = kvpNode.children;
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
        expect(fNode.keyValueList).toBeInstanceOf(KeyValueListNode);

        const kvpNode = fNode.keyValueList as KeyValueListNode;
        expect(kvpNode.children.size).toBe(1);

        const kvp = kvpNode.children;
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

    it('should parse nested key-value-children', () => {
        const tokens = new Lexer('frame foo { key: { key2: 20px } }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(FrameNode);

        const fNode = node as FrameNode;
        expect(fNode.identifier.name).toBe('foo');

        const kvpNode = fNode.keyValueList as KeyValueListNode;
        expect(kvpNode.children.size).toBe(1);

        const kvp = kvpNode.children;
        const kvp2 = kvp.get('key');
        expect(kvp2).toBeInstanceOf(KeyValueListNode);

        const kvp3 = kvp2 as KeyValueListNode;
        expect(kvp3.children.size).toBe(1);

        const kvp4 = kvp3.children;
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

        const kvpNode = fNode.keyValueList as KeyValueListNode;
        expect(kvpNode.children.size).toBe(1);

        const kvp = kvpNode.children;
        const call = kvp.get('key');
        expect(call).toBeInstanceOf(CallNode);

        const cCall = call as CallNode;
        expect(cCall.identifier.name).toBe('call');
        expect(cCall.keyValueList!.children.size).toBe(1);

        const arg = cCall.keyValueList!.children.get('bar');
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

        const kvpNode = fNode.keyValueList as KeyValueListNode;
        expect(kvpNode.children.size).toBe(1);

        const kvp = kvpNode.children;
        const call = kvp.get('key');
        expect(call).toBeInstanceOf(CallNode);

        const cCall = call as CallNode;
        expect(cCall.identifier.name).toBe('call');
        expect(cCall.keyValueList!.children.size).toBe(1);

        const arg = cCall.keyValueList!.children.get('bar');
        expect(arg).toBeInstanceOf(CallNode);

        const cArg = arg as CallNode;
        expect(cArg.identifier.name).toBe('call');
        expect(cArg.keyValueList!.children.size).toBe(1);

        const arg2 = cArg.keyValueList!.children.get('baz');
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

        const kvpNode = fNode.keyValueList as KeyValueListNode;
        expect(kvpNode.children.size).toBe(1);

        const kvp = kvpNode.children;
        const list = kvp.get('key');
        expect(list).toBeInstanceOf(ValueListNode);

        const vList = list as ValueListNode;
        expect(vList.values.length).toBe(3);

        const v1 = vList.values[0];
        expect(v1).toBeInstanceOf(NumberNode);
        const nV1 = v1 as NumberNode;

        const v2 = vList.values[1];
        expect(v2).toBeInstanceOf(NumberNode);
        const nV2 = v2 as NumberNode;

        const v3 = vList.values[2];
        expect(v3).toBeInstanceOf(NumberNode);
        const nV3 = v3 as NumberNode;

        expect(nV1.value).toBe(10);
        expect(nV2.value).toBe(20);
        expect(nV3.value).toBe(30);
    });

    it('should parse components', () => {
        const tokens = new Lexer('component Foo() from Row() { }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(ComponentNode);

        const cNode = node as ComponentNode;
        expect(cNode.identifier.name).toBe('Foo');

        expect(cNode.layout).toBeInstanceOf(CallNode);
        const cCall = cNode.layout as CallNode;

        expect(cCall.identifier.name).toBe('Row');
        expect(cCall.keyValueList!.children.size).toBe(0);
    });

    it('should parse components with arguments', () => {
        const tokens = new Lexer('component Foo() from Row(foo: 10, bar: 20) { }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(ComponentNode);

        const cNode = node as ComponentNode;
        expect(cNode.identifier.name).toBe('Foo');

        expect(cNode.layout).toBeInstanceOf(CallNode);
        const cCall = cNode.layout as CallNode;

        expect(cCall.identifier.name).toBe('Row');
        expect(cCall.keyValueList!.children.size).toBe(2);

        const p1 = cCall.keyValueList!.children.get('foo');
        expect(p1).toBeInstanceOf(NumberNode);
        const nP1 = p1 as NumberNode;
        expect(nP1.value).toBe(10);

        const p2 = cCall.keyValueList!.children.get('bar');
        expect(p2).toBeInstanceOf(NumberNode);
        const nP2 = p2 as NumberNode;
        expect(nP2.value).toBe(20);
    });

    it('should parse components with content', () => {
        const tokens = new Lexer('component Foo (test, test2) from Row() { foo: 10 }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(ComponentNode);

        const cNode = node as ComponentNode;
        expect(cNode.identifier.name).toBe('Foo');

        const cArgs = cNode.args;
        expect(cArgs!.children.length).toBe(2);
        expect(cArgs!.children[0].name).toBe('test');
        expect(cArgs!.children[1].name).toBe('test2');

        expect(cNode.layout).toBeInstanceOf(CallNode);
        const cCall = cNode.layout as CallNode;

        expect(cCall.identifier.name).toBe('Row');

        expect(cNode.keyValueList).toBeInstanceOf(KeyValueListNode);
        const cKvp = cNode.keyValueList as KeyValueListNode;

        expect(cKvp.children.size).toBe(1);
        const cKvpPair = cKvp.children.get('foo');
        expect(cKvpPair).toBeInstanceOf(NumberNode);
        const cKvpPairNumber = cKvpPair as NumberNode;
        expect(cKvpPairNumber.value).toBe(10);
    });

    it('should parse parent nodes correctly', () => {
        const tokens = new Lexer('frame foo { key: call(bar: 10) }').tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(FrameNode);

        const fNode = node as FrameNode;
        expect(fNode.identifier.name).toBe('foo');

        const kvpNode = fNode.keyValueList as KeyValueListNode;
        expect(kvpNode.children.size).toBe(1);

        const kvp = kvpNode.children;
        const call = kvp.get('key');
        expect(call).toBeInstanceOf(CallNode);

        const cCall = call as CallNode;
        expect(cCall.identifier.name).toBe('call');
        expect(cCall.keyValueList!.children.size).toBe(1);

        const cKvp = cCall.keyValueList!.children;
        const cKvpPair = cKvp.get('bar');
        expect(cKvpPair).toBeInstanceOf(NumberNode);
        const cKvpPairNumber = cKvpPair as NumberNode;
        expect(cKvpPairNumber.value).toBe(10);

        expect(cCall.parent).toBeInstanceOf(KeyValueListNode);
        expect(cKvpPairNumber.parent).toBeInstanceOf(KeyValueListNode);
        expect(fNode.identifier.parent).toBeInstanceOf(FrameNode);
    });

    it('should parse actions correctly', () => {
        const tokens = new Lexer('component Foo() from Row() { click: test => call() }').tokenize();

        const parser = new Parser(tokens);
        const result = parser.parse();

        const node = result.children[0];
        expect(node).toBeInstanceOf(ComponentNode);

        const cNode = node as ComponentNode;
        expect(cNode.identifier.name).toBe('Foo');

        expect(cNode.keyValueList).toBeInstanceOf(KeyValueListNode);
        const cKvp = cNode.keyValueList as KeyValueListNode;

        expect(cKvp.children.size).toBe(1);
        const cKvpPair = cKvp.children.get('click');
        expect(cKvpPair).toBeInstanceOf(ActionNode);
        const cKvpPairAction = cKvpPair as ActionNode;

        expect(cKvpPairAction.identifier.name).toBe('test');
        expect(cKvpPairAction.parent).toBeInstanceOf(KeyValueListNode);

        expect(cKvpPairAction.value).toBeInstanceOf(CallNode);

        const cKvpPairActionCall = cKvpPairAction.value as CallNode;
        expect(cKvpPairActionCall.identifier.name).toBe('call');
        expect(cKvpPairActionCall.keyValueList).toBeInstanceOf(KeyValueListNode);

        const cKvpPairActionCallKvp = cKvpPairActionCall.keyValueList as KeyValueListNode;
        expect(cKvpPairActionCallKvp.children.size).toBe(0);
    });

    it('should parse a correct program', () => {
        const program = `
component Headline (title, subtitle) {
    children: [
        Text(text: title, size: 2, weight: bold),
        Text(text: subtitle, size: 1)
    ]
}

component Button (text, link) from Stack() {
    children: [
        Text(text: text, size: 1)
    ],
    styles: {
        background: #fff,
        border-radius: 4px,
        padding: 8px,
        cursor: pointer
    },
    events: {
        click: navigate => SignUpPage(),
        hover: style => {
            background: #eee
        }
    }
}
        `;
        const tokens = new Lexer(program).tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        expect(result.children.length).toBe(2);
        expect(result.children[0]).toBeInstanceOf(ComponentNode);
        expect(result.children[1]).toBeInstanceOf(ComponentNode);

        const c1 = result.children[0] as ComponentNode;
        expect(c1.identifier.name).toBe('Headline');
        expect(c1.args!.children.length).toBe(2);
        expect(c1.keyValueList).toBeInstanceOf(KeyValueListNode);

        const c2 = result.children[1] as ComponentNode;
        expect(c2.identifier.name).toBe('Button');
        expect(c2.args!.children.length).toBe(2);
        expect(c2.layout).toBeInstanceOf(CallNode);
        expect(c2.keyValueList).toBeInstanceOf(KeyValueListNode);

        const c2Kvp = c2.keyValueList as KeyValueListNode;
        expect(c2Kvp.children.size).toBe(3);
        const c2KvpPair = c2Kvp.children.get('events');
        expect(c2KvpPair).toBeInstanceOf(KeyValueListNode);
        const c2KvpPairNode = c2KvpPair as KeyValueListNode;

        expect(c2KvpPairNode.children.size).toBe(2);
        const c2KvpPairNodePair = c2KvpPairNode.children.get('click');
        expect(c2KvpPairNodePair).toBeInstanceOf(ActionNode);

        const c2KvpPairNodePairAction = c2KvpPairNodePair as ActionNode;
        expect(c2KvpPairNodePairAction.identifier.name).toBe('navigate');
        expect(c2KvpPairNodePairAction.value).toBeInstanceOf(CallNode);

        const c2KvpPairNodePairActionCall = c2KvpPairNodePairAction.value as CallNode;
        expect(c2KvpPairNodePairActionCall.identifier.name).toBe('SignUpPage');
    });
});
