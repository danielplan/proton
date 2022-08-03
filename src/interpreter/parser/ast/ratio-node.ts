import Node from './node';
import NumberNode from './number-node';

export default class RatioNode extends Node {
    left: NumberNode;
    right: NumberNode;
    constructor(left: number, right: number) {
        super();
        this.left = new NumberNode(left, null);
        this.right = new NumberNode(right, null);
    }
}
