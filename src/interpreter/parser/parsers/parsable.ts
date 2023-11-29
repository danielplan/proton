import Parser from '../index';
import Node from '../ast/node';

export default interface Parsable {
    parse(parent: Node, parser: Parser): Node;
}