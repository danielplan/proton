import Node from './node';

export default class ColorNode extends Node {
    value: string;
    constructor(value: string, parent: Node) {
        super();
        this.value = value;
        this.parent = parent;
    }
}
