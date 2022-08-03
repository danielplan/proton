import CallNode from './call-node';
import IdentifierNode from './identifier-node';
import KeyValueListNode from './key-value-list-node';
import Node from './node';

export default class ComponentNode extends Node {
    identifier: IdentifierNode;
    layout: CallNode;
    keyValueList: KeyValueListNode;

    constructor(name: string, layout: CallNode, keyValueList: KeyValueListNode, parent: Node) {
        super();
        this.identifier = new IdentifierNode(name);
        this.layout = layout;
        this.keyValueList = keyValueList;
    }
}
