import BinaryNode from './binary-node';
import NumberNode from './number-node';

export default class RatioNode extends BinaryNode {
    constructor(left: number, right: number) {
        super();
        this.left = new NumberNode(left, null);
        this.right = new NumberNode(right, null);
    }
}
