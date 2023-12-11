import CallNode from './call-node';
import IdentifierListNode from './identifier-list-node';
import IdentifierNode from './identifier-node';
import KeyValueListNode from './key-value-list-node';
import Node from './node';

export default class ComponentNode extends Node {
    public identifier: IdentifierNode;
    public args: IdentifierListNode | null = null;
    public layout: CallNode | null = null;
    public keyValueList: KeyValueListNode | null = null;

    constructor(name: string, parent: Node) {
        super();
        this.identifier = new IdentifierNode(name, this);
        this.parent = parent;
    }
}
