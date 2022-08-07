import IdentifierNode from './identifier-node';
import Node from './node';

export default class IdentifierListNode extends Node {
    public children: IdentifierNode[];

    constructor(children: IdentifierNode[], parent: Node) {
        super();
        this.children = children;
        this.parent = parent;
    }
}
