import Node from './node';

export default class ValueListNode extends Node {
    values: Node[];
    constructor(parent: Node) {
        super();
        this.values = [];
        this.parent = parent;
    }
}
