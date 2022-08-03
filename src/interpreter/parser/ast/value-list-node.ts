import Node from './node';

export default class ValueListNode extends Node {
    values: Node[];
    constructor(values: Node[]) {
        super();
        this.values = values;
    }
}
