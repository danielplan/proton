import BinaryNode from './binary-node';
import IdentifierNode from './identifier-node';
import KeyValuePairsNode from './key-value-pairs-node';

export default class CallNode extends BinaryNode {
    left: IdentifierNode;
    right: KeyValuePairsNode;
    constructor(identifier: IdentifierNode, args: KeyValuePairsNode) {
        super();
        this.left = identifier;
        this.right = args;
    }
}
