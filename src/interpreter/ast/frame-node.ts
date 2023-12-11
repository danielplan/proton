import Node from './node';
import IdentifierNode from './identifier-node';
import KeyValueListNode from './key-value-list-node';

export default class FrameNode extends Node {
    identifier: IdentifierNode;
    keyValueList: KeyValueListNode | null = null;

    constructor(name: string, parent: Node) {
        super();
        this.identifier = new IdentifierNode(name, this);
        this.parent = parent;
    }
}
