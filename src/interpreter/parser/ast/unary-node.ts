import Node from './node';
export default abstract class UnaryNode extends Node {
    child: Node | null;
    constructor() {
        super();
        this.child = null;
    }
}
