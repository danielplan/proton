import Node from './node';
import IdentifierNode from './identifier-node';
import KeyValueListNode from './key-value-list-node';

export default class CallNode extends Node {
    identifier: IdentifierNode;
    keyValueList: KeyValueListNode;
    constructor(identifier: string, args: KeyValueListNode) {
        super();
        this.identifier = new IdentifierNode(identifier);
        this.keyValueList = args;
    }
}
