import IdentifierNode from './identifier-node';
import Node from './node';

export default class ActionNode extends Node {
    public identifier: IdentifierNode;
    public value: Node;

    constructor(identifier: string, value: Node, parent: Node) {
        super();
        this.identifier = new IdentifierNode(identifier, this);
        this.value = value;
        this.parent = parent;
    }
}
