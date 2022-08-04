import Node from './node';
import NumberNode from './number-node';

export default class RatioNode extends Node {
    left: NumberNode;
    right: NumberNode;
    constructor(left: number, right: number, parent: Node) {
        super();
        this.left = new NumberNode(left, null, this);
        this.right = new NumberNode(right, null, this);
        this.parent = parent;
    }
}
