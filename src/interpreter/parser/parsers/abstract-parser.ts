import Parser from '../index';
import Node from '../../ast/node';

export default abstract class AbstractParser {
    abstract parse(parent: Node, parser: Parser): Node;
}