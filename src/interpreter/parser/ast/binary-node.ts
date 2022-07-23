import Node from './node';

export default abstract class BinaryNode extends Node {
    left: Node | null;
    right: Node | null;
    constructor() {
        super();
        this.left = null;
        this.right = null;
    }
}
