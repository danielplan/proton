import CallNode from './call-node';
import IdentifierNode from './identifier-node';
import KeyValueListNode from './key-value-list-node';
import Node from './node';

export default class ComponentNode extends Node {
    identifier: IdentifierNode;
    layout: CallNode | null = null;
    keyValueList: KeyValueListNode | null = null;

    constructor(name: string, parent: Node) {
        super();
        this.identifier = new IdentifierNode(name, this);
        this.parent = parent;
    }
}
