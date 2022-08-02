import CallNode from './call-node';
import IdentifierNode from './identifier-node';
import KeyValuePairsNode from './key-value-pairs-node';
import Node from './node';

export default class ComponentNode extends Node {
    identifier: IdentifierNode;
    layout: CallNode;
    keyValuePairs: KeyValuePairsNode | null;

    constructor(name: string, layout: CallNode, keyValuePairs: KeyValuePairsNode | null) {
        super();
        this.identifier = new IdentifierNode(name);
        this.layout = layout;
        this.keyValuePairs = keyValuePairs;
    }
}
