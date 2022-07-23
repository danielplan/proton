import Node from './node';
import IdentifierNode from './identifier-node';
import KeyValuePairsNode from './key-value-pairs-node';

export default class FrameNode extends Node {
    identifier: IdentifierNode;
    keyValuePairs: KeyValuePairsNode | null;

    constructor(name: string, keyValuePairs: KeyValuePairsNode | null, parent: Node) {
        super();
        this.identifier = new IdentifierNode(name);
        this.keyValuePairs = keyValuePairs;
        this.parent = parent;
    }
}
