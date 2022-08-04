import Node from './node';
import IdentifierNode from './identifier-node';
import KeyValueListNode from './key-value-list-node';

export default class CallNode extends Node {
    identifier: IdentifierNode;
    keyValueList: KeyValueListNode | null;
    constructor(identifier: string, args: KeyValueListNode | null, parent: Node) {
        super();
        this.identifier = new IdentifierNode(identifier, this);
        this.keyValueList = args;
        this.parent = parent;
    }
}
