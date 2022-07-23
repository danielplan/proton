import Node from './node';

export default abstract class NaryNode extends Node {
    children: Node[];
    constructor(children: Node[]) {
        super();
        this.children = children;
    }
}
