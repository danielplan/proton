import Node from './node';
import IdentifierNode from './identifier-node';
import KeyValueListNode from './key-value-list-node';

export default class FrameNode extends Node {
    identifier: IdentifierNode;
    keyValueList: KeyValueListNode;

    constructor(name: string, keyValueList: KeyValueListNode, parent: Node) {
        super();
        this.identifier = new IdentifierNode(name);
        this.keyValueList = keyValueList;
        this.parent = parent;
    }
}
